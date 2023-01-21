import { Switch } from "@headlessui/react";
import React, { useState } from "react";
import useScript from "../hooks/useScript";
import clx from "classnames";
import { XMarkIcon } from "@heroicons/react/24/solid";
import toast, { Toast } from "react-hot-toast";

interface TweetButtonProps {
  amount: string;
  t: Toast;
}

const TweetButton: React.FC<TweetButtonProps> = ({ amount, t }) => {
  const [enabled, setEnabled] = useState(false);

  useScript("https://platform.twitter.com/widgets.js");

  return (
    <div className=" bg-background p-8 rounded-md border border-green">
      <div className={`ml-2 flex-shrink-0 flex justify-end`}>
        <button
          onClick={() => toast.dismiss(t.id)}
          className={`default-transition rounded-md inline-flex text-white hover:opacity-75 focus:outline-none`}
        >
          <span className={`sr-only`}>Close</span>

          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(46, 133, 85, 0) 34.82%, rgba(46, 133, 85, 0.11) 100%), #212121",
          maxWidth: "464px",
        }}
        className="flex flex-col items-center px-16 pt-8 my-8 rounded-md"
      >
        <div className="text-center mb-4">
          I just staked with Sunrise, offsetting carbon and making Solana
          stronger
        </div>
        <svg
          width="69"
          height="58"
          viewBox="0 0 69 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M29.0713 0.15275L29.0875 0.1755C30.2088 0.0584997 31.3495 0 32.5 0C50.1768 0 64.558 14.1115 64.9903 31.6875C61.2008 30.901 55.7343 30.4103 47.9993 31.4373C46.0297 31.6955 44.1076 32.2362 42.2923 33.0427C42.2698 32.9268 42.247 32.8109 42.224 32.695C42.1178 32.1007 41.9712 31.5144 41.7853 30.94C41.7853 30.94 41.769 30.8977 41.7235 30.8197C41.6588 30.7033 41.5894 30.5894 41.5155 30.4785C41.2804 30.1275 41.0344 29.7839 40.7778 29.4482L40.4203 28.9835C39.9003 28.2945 39.273 27.4788 38.7433 26.6695C38.1063 25.701 37.388 24.4335 37.1605 23.0815C37.0151 22.2841 37.0767 21.4628 37.3393 20.696C37.6415 19.838 38.1973 19.1295 38.9188 18.5868C40.4918 17.4102 42.7993 14.7778 44.8468 12.22C45.7795 11.0533 46.6148 9.96125 47.2388 9.1325C42.6804 6.24708 37.3738 4.76645 31.98 4.875C32.3765 5.67125 32.8055 6.60725 33.1923 7.6375C34.32 10.6372 35.3568 15.054 33.5173 18.9702C31.8208 22.5875 28.8893 23.5203 26.7248 24.0825L26.4485 24.1507C24.3165 24.7032 23.4975 24.9145 22.8995 25.8212C22.347 26.6565 22.4315 27.7127 23.0978 29.8837L23.2473 30.3648C23.5105 31.2033 23.8323 32.2173 23.9948 33.1695C24.2028 34.3525 24.258 35.8573 23.5008 37.3133C22.8611 38.6108 21.8406 39.6823 20.5758 40.3845C19.4675 40.9857 18.3203 41.2165 17.4623 41.366L17.16 41.4212C15.4863 41.7137 14.6868 41.8568 13.91 42.6888C13.3023 43.3388 12.9123 44.486 12.6815 46.1955C12.5905 46.891 12.5353 47.5833 12.4768 48.295L12.4443 48.6752C12.3793 49.4617 12.3013 50.3685 12.1225 51.1452V51.1518C16.8641 56.3413 23.4099 59.5223 30.42 60.0438C29.8513 61.6785 29.4775 63.2938 29.3215 64.844C24.9277 64.415 20.6676 63.0942 16.8017 60.9623C12.9358 58.8304 9.54547 55.9323 6.83804 52.4452H6.82829V52.4355C2.39175 46.7383 -0.0118321 39.7209 4.37979e-05 32.5C4.37979e-05 15.7235 12.7108 1.9175 29.029 0.182L29.0713 0.15275ZM32.5163 65.6695C32.7113 62.53 34.125 58.708 36.5235 55.1005C37.358 53.6952 38.3221 52.3711 39.403 51.1452C43.2587 46.7574 48.353 43.6403 54.015 42.2045C54.4304 42.0973 54.7865 41.8302 55.0057 41.4615C55.2249 41.0927 55.2894 40.6523 55.1852 40.2362C55.081 39.8201 54.8164 39.4621 54.4493 39.2402C54.0821 39.0184 53.6421 38.9507 53.2253 39.052C46.9234 40.6481 41.2532 44.1166 36.9623 49.0002C36.1094 49.9698 35.3202 50.9935 34.5995 52.065C34.279 50.9892 34.117 49.8725 34.1185 48.75C34.1185 45.773 35.6363 42.5328 38.0413 39.9685C40.784 37.0504 44.4537 35.1737 48.425 34.658C57.525 33.4555 63.1735 34.463 66.5048 35.3957C66.9539 35.5223 67.3573 35.7751 67.6669 36.1241C67.9766 36.4731 68.1796 36.9037 68.2518 37.3647C68.3241 37.8256 68.2624 38.2977 68.0743 38.7247C67.8862 39.1517 67.5794 39.5157 67.1905 39.7735C67.0053 39.897 66.7063 40.196 66.3455 40.8785C65.9205 41.7398 65.5724 42.6371 65.3055 43.5597C65.0228 44.486 64.753 45.4838 64.4605 46.5693L64.272 47.2583C63.9113 48.5908 63.5115 50.0207 63.0305 51.4377C62.0815 54.2392 60.7425 57.226 58.4903 59.5238C56.1535 61.906 52.9815 63.3912 48.7435 63.3912C44.4243 63.3912 41.4083 61.6395 39.481 59.6245C38.168 62.0295 37.4855 64.2948 37.3815 65.9653C37.3676 66.2887 37.2895 66.6061 37.1515 66.899C37.0136 67.1919 36.8187 67.4544 36.5783 67.6712C36.3378 67.8879 36.0565 68.0546 35.7509 68.1614C35.4454 68.2683 35.1215 68.3132 34.7984 68.2936C34.4753 68.274 34.1593 68.1901 33.8689 68.047C33.5785 67.9039 33.3195 67.7044 33.107 67.4601C32.8946 67.2159 32.7329 66.9317 32.6315 66.6243C32.5301 66.3168 32.4909 65.9922 32.5163 65.6695Z"
            fill="#2E8555"
          />
        </svg>
      </div>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center">
          <Switch
            checked={enabled}
            onChange={(e: boolean) => {
              setEnabled(e);
            }}
            className={clx(
              {
                "bg-outset": !enabled,
                "bg-green": enabled,
              },
              " relative inline-flex h-6 w-12 items-center rounded-full invisible disabled"
            )}
          >
            <span className="sr-only">Enable notifications</span>
            <span
              className={clx(
                {
                  "translate-x-7": enabled,
                  "translate-x-1": !enabled,
                },
                "inline-block h-4 w-4 transform rounded-full bg-white transition"
              )}
            />
          </Switch>
          {/* <div className="text-xs ml-2">Disclose Amount</div> */}
        </div>
        <a
          href="https://twitter.com/share?ref_src=twsrc%5Etfw"
          className="twitter-share-button"
          data-size="large"
          data-text="I just staked with Sunrise, offsetting carbon and making Solana stronger"
          data-url="https://app.sunrisestake.com/"
          data-via="sunrisestake"
          // data-hashtags=""
          // data-related=""
          data-show-count="false"
        >
          Tweet
        </a>
      </div>
    </div>
  );
};

export default TweetButton;
