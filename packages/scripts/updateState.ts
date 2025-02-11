import { SunriseStakeClient } from "../app/src/lib/client/";
import "./util";
import { AnchorProvider } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { SUNRISE_STAKE_STATE } from "@sunrisestake/app/src/lib/constants";

// const newliqPoolProportion = parseInt(process.argv[2], 10);
//
// console.log("Setting new LP Proportion to", newliqPoolProportion);

(async () => {
  const provider = AnchorProvider.env();
  const client = await SunriseStakeClient.get(provider, SUNRISE_STAKE_STATE);
  await client.update({
    newTreasury: new PublicKey("F7P4qYbVKFiiD4dQpwwVS6ao22DLr2sAF7Z3cCHneC8w"),
  });
})().catch(console.error);
