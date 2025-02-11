use crate::{
    check_mint_supply,
    utils::{calc, seeds, token as TokenUtils},
    State,
};
use anchor_lang::{prelude::*, solana_program::program::invoke_signed};
use anchor_spl::token::{Mint, Token, TokenAccount};
use spl_stake_pool::state::StakePool;

///   CPI Instructions:
///
///   Withdraw SOL directly from the pool's reserve account. Fails if the
///   reserve does not have enough SOL.
///
///   0. `[w]` Stake pool
///   1. `[]` Stake pool withdraw authority
///   2. `[s]` User transfer authority, for pool token account
///   3. `[w]` User account to burn pool tokens
///   4. `[w]` Reserve stake account, to withdraw SOL
///   5. `[w]` Account receiving the lamports from the reserve, must be a system account
///   6. `[w]` Account to receive pool fee tokens
///   7. `[w]` Pool token mint account
///   8. '[]' Clock sysvar
///   9. '[]' Stake history sysvar
///  10. `[]` Stake program account
///  11. `[]` Token program id
///  12. `[s]` (Optional) Stake pool sol withdraw authority

#[derive(Accounts)]
pub struct SplWithdrawSol<'info> {
    #[account(
        has_one = gsol_mint,
        constraint = state.blaze_state == *stake_pool.key
    )]
    pub state: Box<Account<'info, State>>,
    pub gsol_mint: Box<Account<'info, Mint>>,
    #[account(
        seeds = [state.key().as_ref(), seeds::GSOL_MINT_AUTHORITY],
        bump = state.gsol_mint_authority_bump
    )]
    pub gsol_mint_authority: SystemAccount<'info>,

    pub user: Signer<'info>,
    #[account(
        mut,
        token::mint = gsol_mint,
        token::authority = user,
    )]
    pub user_gsol_token_account: Account<'info, TokenAccount>,

    #[account(mut, token::authority = bsol_account_authority)]
    pub bsol_token_account: Account<'info, TokenAccount>,
    #[account(
        seeds = [state.key().as_ref(), seeds::BSOL_ACCOUNT],
        bump = state.bsol_authority_bump
    )]
    /// CHECK:
    pub bsol_account_authority: AccountInfo<'info>,

    #[account(mut)]
    /// CHECK:
    pub stake_pool: AccountInfo<'info>,
    /// CHECK:
    pub stake_pool_withdraw_authority: AccountInfo<'info>,
    /// CHECK:
    #[account(mut)]
    /// CHECK:
    pub reserve_stake_account: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK:
    pub manager_fee_account: AccountInfo<'info>,
    #[account(mut)]
    /// CHECK:
    pub stake_pool_token_mint: AccountInfo<'info>,
    /// CHECK:
    pub sysvar_clock: AccountInfo<'info>,
    /// CHECK:
    pub sysvar_stake_history: AccountInfo<'info>,
    /// CHECK:
    pub stake_pool_program: AccountInfo<'info>,
    /// CHECK:
    pub native_stake_program: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

impl<'info> SplWithdrawSol<'info> {
    fn check_stake_pool_program(&self) -> Result<()> {
        require_keys_eq!(*self.stake_pool_program.key, spl_stake_pool::ID);
        Ok(())
    }

    fn calculate_bsol_from_lamports(&self, lamports: u64) -> Result<u64> {
        let stake_pool = StakePool::try_from_slice(&self.stake_pool.data.borrow())?;
        let token_supply = stake_pool.pool_token_supply;
        let total_lamports = stake_pool.total_lamports;

        let bsol = calc::proportional(lamports, token_supply, total_lamports)?;
        Ok(bsol)
    }

    pub fn withdraw_sol(&mut self, lamports: u64) -> Result<()> {
        self.check_stake_pool_program()?;

        let bump = self.state.bsol_authority_bump;
        let state_key = self.state.to_account_info().key;
        let signer_seeds = &[state_key.as_ref(), seeds::BSOL_ACCOUNT, &[bump]];
        let signer_seeds = &[&signer_seeds[..]];

        let pool_tokens = self.calculate_bsol_from_lamports(lamports)?;
        invoke_signed(
            &spl_stake_pool::instruction::withdraw_sol(
                &spl_stake_pool::ID,
                self.stake_pool.key,
                self.stake_pool_withdraw_authority.key,
                &self.bsol_account_authority.key(),
                &self.bsol_token_account.key(),
                self.reserve_stake_account.key,
                self.user.key,
                self.manager_fee_account.key,
                self.stake_pool_token_mint.key,
                self.token_program.key,
                pool_tokens,
            ),
            &[
                self.stake_pool_program.clone(),
                self.stake_pool.clone(),
                self.stake_pool_withdraw_authority.clone(),
                self.bsol_account_authority.to_account_info(),
                self.bsol_token_account.to_account_info(),
                self.reserve_stake_account.clone(),
                self.user.to_account_info(),
                self.manager_fee_account.clone(),
                self.stake_pool_token_mint.clone(),
                self.sysvar_clock.clone(),
                self.sysvar_stake_history.clone(),
                self.native_stake_program.clone(),
                self.token_program.to_account_info(),
            ],
            signer_seeds,
        )?;

        // Fees may apply so we might be burning more than the user expects

        // let fees = u64::try_from(stake_pool.sol_withdrawal_fee
        //    .apply(equivalent_bsol).unwrap()).ok();
        // We could subtract the fees here so the user doesn't burn more gsol than
        // lamports received
        TokenUtils::burn(
            lamports,
            &self.gsol_mint.to_account_info(),
            &self.user.to_account_info(),
            &self.user_gsol_token_account.to_account_info(),
            &self.token_program,
        )?;

        let state = &mut self.state;
        self.state.blaze_minted_gsol = state.blaze_minted_gsol.checked_sub(lamports).unwrap();

        check_mint_supply(&self.state, &self.gsol_mint)
    }
}
