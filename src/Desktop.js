/* Components */
import Gnb from "./Gnb/desktop";
import Home from "./Defi/desktop";
import Station from "./Defi/Station";
import Swap from "./Defi/Swap";
/* Libraries */
import React, { useState, useEffect, useRef } from "react";
import { Route, Switch } from "react-router-dom";
import { useRecoilState } from "recoil";
import axios from "axios";
import { fromWei } from "web3-utils";
/* Read Contract */
import {
  getChargerList,
  createContractInstance,
  getTokenInfo,
  getChargerInfo,
} from "./lib/read_contract/Station";
// import styled from "styled-components";
import { withTranslation } from "react-i18next";
import i18next from "./locale/i18n";
/* Store */
import { accountState } from "./store/web3";
import { web3ReaderState } from "./store/read-web3";
import { tvdState } from "./store/data";
import { uniLpLockerState } from "./store/data";

function makeNum(str, decimal = 4) {
  let arr = str.split(".");
  if (arr.length == 1 || arr[0].length > 8) return arr[0];
  else {
    return arr[0] + "." + arr[1].substr(0, decimal);
  }
}

const App = React.memo(
  ({ toast, t }) => {
    const [account] = useRecoilState(accountState);
    const [web3_R] = useRecoilState(web3ReaderState);
    const [tvd, setTvd] = useRecoilState(tvdState);
    const [uniLpLocker, setUniLpLocker] = useRecoilState(uniLpLockerState);
    const NETWORKS = require("./lib/networks.json");
    const CHARGERLIST_ABI = require("./lib/read_contract/abi/chargerList.json");
    const CHARGER_ABI = require("./lib/read_contract/abi/charger.json");
    const ERC20_ABI = require("./lib/read_contract/abi/erc20.json");
    const [onLoading, setOnLoading] = useState(true);
    const [myPools, setMyPools] = useState(null);
    const [analytics, setAnalytics] = useState({
      totalCirculation: {},
      numberOf: {},
      Accumulated: {
        eth: {},
        bsc: {},
        heco: {},
      },
    });

    const loading_data = [
      {
        address: "0x0",
        // apy: "-",
        name: "Loading List..",
        period: [1625022000, 14400],
        redemtion: 200,
        symbol: ["RCG", "RCG"],
        token: [
          "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30", // 이더리움 토큰주소
          "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30",
        ],
        tvl: "-",
        type: "flexible",
        network: "ERC",
      },
    ];

    const chargerInfo = [
      {
        address: "0x0",
        // apy: "-",
        name: "There is currently no Charger List available.",
        period: [1625022000, 14400],
        redemtion: 200,
        symbol: ["RCG", "RCG"],
        token: [
          "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30", // 이더리움 토큰주소
          "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30",
        ],
        tvl: "-",
        type: "flexible",
        network: "ERC",
      },
    ];

    // chargerList Info
    const [chList, setChList] = useState(loading_data);
    const [fullList, setFullList] = useState(loading_data);
    const [tvl, setTvl] = useState(0);
    // LockerList Info
    const [chListPrivate, setChListPrivate] = useState(loading_data);
    const [fullListPrivate, setFullListPrivate] = useState(loading_data);
    const [privateTvl, setPrivateTvl] = useState(0);

    const loadAnalytics = async () => {
      try {
        const BEP_WEB3 = web3_R["BEP"];
        const ERC_WEB3 = web3_R["ERC"];

        const RCG_TOKEN_ADDRESS = "0x2d94172436d869c1e3c094bead272508fab0d9e3";
        const WBNB_TOKEN_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
        const UNISWAP_LP_ADDRESS = "0x9C20be0f142FB34F10E33338026fB1DD9e308da3";
        const RCG_eth_TOKEN_ADDRESS =
          "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30";

        const RCG_bsc_CONTRACT_ADDRESS =
          "0x0A9B1C9893aE0BE97A6d31AdBc39bCd6737B4922";
        const UNISWAP_LP_LOCKER_ADDRESS =
          "0x384e5de8c108805d6a1d5bf4c2aaa0b390ea018b";

        const RCG_TOKEN_INSTANCE = createContractInstance(
          BEP_WEB3,
          RCG_TOKEN_ADDRESS,
          ERC20_ABI
        );
        const WBNB_TOKEN_INSTANCE = createContractInstance(
          BEP_WEB3,
          WBNB_TOKEN_ADDRESS,
          ERC20_ABI
        );

        const RCG_eth_TOKEN_INSTANCE = createContractInstance(
          ERC_WEB3,
          RCG_eth_TOKEN_ADDRESS,
          ERC20_ABI
        );

        const UNISWAP_LP_INSTANCE = createContractInstance(
          ERC_WEB3,
          UNISWAP_LP_ADDRESS,
          ERC20_ABI
        );

        let [
          RCG_balance,
          WBNB_balance,
          UNISWAP_LP_balance,
          UNISWAP_LP_totalSupply,
          RCG_eth_TOKEN_balance,
        ] = await Promise.all([
          await RCG_TOKEN_INSTANCE.methods
            .balanceOf(RCG_bsc_CONTRACT_ADDRESS)
            .call(),
          await WBNB_TOKEN_INSTANCE.methods
            .balanceOf(RCG_bsc_CONTRACT_ADDRESS)
            .call(),
          await UNISWAP_LP_INSTANCE.methods
            .balanceOf(UNISWAP_LP_LOCKER_ADDRESS)
            .call(),
          await UNISWAP_LP_INSTANCE.methods.totalSupply().call(),
          await RCG_eth_TOKEN_INSTANCE.methods
            .balanceOf(UNISWAP_LP_ADDRESS)
            .call(),
        ]);

        // console.log("RCG_eth_TOKEN_balance", RCG_eth_TOKEN_balance);

        // console.log(
        //   "UNISWAP_LP_balance",
        //   Number(fromWei(UNISWAP_LP_balance, "ether")) * 4058179.031940315
        // );

        //Get Token Price
        const coinPriceData = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd`
        );
        const BNBPrice = coinPriceData.data["binancecoin"].usd;

        const RCG_bsc_price = ((WBNB_balance / RCG_balance) * BNBPrice).toFixed(
          4
        );

        const [analData, priceData, tvlData] = await Promise.all([
          axios.get(`https://analytics.api.therecharge.io/`),
          axios.post(
            `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`,
            {
              query:
                'query{pairs(where:{id:"0x9c20be0f142fb34f10e33338026fb1dd9e308da3"}) { token0Price token1Price }}',
            }
          ),
          axios.get(`https://api.therecharge.io/tvl`),
        ]);
        let { token0Price, token1Price } = priceData.data.data.pairs[0];
        token0Price = makeNum(token0Price);
        token1Price = makeNum(token1Price);
        let TVL = makeNum("" + tvlData.data.TVL);

        /* Start to get LP Locker */

        // console.log("TVL", tvlData);
        // console.log("analData", analData);
        // console.log("RCG_eth_TOKEN_balance", RCG_eth_TOKEN_balance);
        // console.log("RCG_eth_TOKEN_balance_type", typeof RCG_eth_TOKEN_balance);
        console.log(
          "UNISWAP LP 컨트랙트가 보유한 RCG(eth)(단위: RCG) : ",
          fromWei(RCG_eth_TOKEN_balance, "ether")
        );
        console.log("UNISWAP LP 총발행량 : ", 0.242903245740529089);
        console.log("RCG(eth) 개당 가격(단위: $) : ", token0Price);
        console.log(
          "UNISWAP LP 개당 가격(단위: RCG) = UNISWAP LP 컨트랙트가 보유한 RCG(eth) * 2 * 0.95 / UNISWAP LP 총 발행량",
          "$ " +
            (Number(fromWei(RCG_eth_TOKEN_balance, "ether")) *
              token0Price *
              2 *
              0.95) /
              Number(fromWei(UNISWAP_LP_totalSupply, "ether"))
        );

        let uni_lp_price =
          (Number(fromWei(RCG_eth_TOKEN_balance, "ether")) *
            token0Price *
            2 *
            0.95) /
          Number(fromWei(UNISWAP_LP_totalSupply, "ether"));
        // console.log("RCG_eth_TOKEN_balance", RCG_eth_TOKEN_balance);

        console.log(
          "UNI_LP_LOCKER가 보유한 balance(단위: RCG) : ",
          fromWei(UNISWAP_LP_balance, "ether")
        );
        setUniLpLocker(
          Number(fromWei(UNISWAP_LP_balance, "ether")) * uni_lp_price
        );

        console.log(
          "UNI_LP_LOCKER가 보유한 balance의 달러가치(단위: $) : ",
          uniLpLocker
        );

        setAnalytics({
          ...analData.data,
          // ERC: {
          //   ...analData.data.ERC,
          rcg_eth_price: token0Price, // 이더리움 유니스왑 실시간 가격
          rcg_bsc_price: RCG_bsc_price,
          uniswap_lp_locker: Number(uniLpLocker.toFixed(2)).toLocaleString(),
          // },
          // general: { tvl: TVL },
        });
        /**
         * ERC: {},
         * HRC: {},
         * general: {},
         */
        console.log(analytics);
      } catch (err) {
        console.log(err);
      }
    };

    const loadChargerList = async () => {
      const priceData = await axios.post(
        `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`,
        {
          query:
            'query{pairs(where:{id:"0x9c20be0f142fb34f10e33338026fb1dd9e308da3"}) { token0Price token1Price }}',
        }
      );
      const RCG_PRICE = makeNum(priceData.data.data.pairs[0].token0Price);

      /**
       * 1. 모든 차져리스트를 받는다
       *  1-1. 각 네트워크에 대한 web3, 풀어드레스를 받는다
       *  1-2. 각 네트워크에 대한 차져 리스트를 받을 수 있다.
       *
       * {
       *    ERC: [],
       *    BEP: [],
       *    HRC: [],
       * }
       *
       * 2. 모든 차져리스트에 대한 인스턴스 생성
       * 3. 모든 차져 인스턴스에 대한 인포 받기
       * 4. 네트워크, 타입에 따라 필터링 진행
       */

      const ETH_WEB3 = web3_R.ERC;
      const BEP_WEB3 = web3_R.BEP;
      const HRC_WEB3 = web3_R.HRC;
      const ALL_WEB3 = [ETH_WEB3, BEP_WEB3, HRC_WEB3];

      const NETWORK = NETWORKS["mainnet"];
      // const TOKEN_ADDRESS = NETWORK.tokenAddress[network]; //
      const ETH_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress.ERC;
      const BEP_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress.BEP;
      const HRC_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress.HRC; //

      const CHARGERLIST_ABI = require("./lib/read_contract/abi/chargerList.json");
      const TOKEN_ABI = require("./lib/read_contract/abi/erc20.json");
      const CHARGER_ABI = require("./lib/read_contract/abi/charger.json");

      const ETH_CHARGERLIST_INSTANCE = createContractInstance(
        ETH_WEB3,
        ETH_CHARGERLIST_ADDRESS,
        CHARGERLIST_ABI
      );
      const BEP_CHARGERLIST_INSTANCE = createContractInstance(
        BEP_WEB3,
        BEP_CHARGERLIST_ADDRESS,
        CHARGERLIST_ABI
      );
      const HRC_CHARGERLIST_INSTANCE = createContractInstance(
        HRC_WEB3,
        HRC_CHARGERLIST_ADDRESS,
        CHARGERLIST_ABI
      ); //

      const getList = async () => {
        const ETH_CHARGER_LIST = await getChargerList(ETH_CHARGERLIST_INSTANCE);
        const BEP_CHARGER_LIST = await getChargerList(BEP_CHARGERLIST_INSTANCE);
        const HRC_CHARGER_LIST = await getChargerList(HRC_CHARGERLIST_INSTANCE); //
        const ALL_NETWORK_CHARGERLIST = [
          ETH_CHARGER_LIST,
          BEP_CHARGER_LIST,
          HRC_CHARGER_LIST,
        ];

        if (ETH_CHARGER_LIST.length === 0 && BEP_CHARGER_LIST.length === 0)
          return setChList(chargerInfo);

        let ALL_RESULTS = {
          0: [],
          1: [],
          2: [], //
        };

        const ALL_CHARGER_INSTANCES = ALL_NETWORK_CHARGERLIST.map(
          (CHARGERLIST, network) => {
            return CHARGERLIST.map((CHARGER_ADDRESS) =>
              createContractInstance(
                ALL_WEB3[network],
                CHARGER_ADDRESS,
                CHARGER_ABI
              )
            );
          }
        );
        const ALL_CHARGERS_INFO = await Promise.all(
          ALL_CHARGER_INSTANCES.map(async (CHARGER_INSTANCES) => {
            return Promise.all(
              CHARGER_INSTANCES.map((INSTANCE) => getChargerInfo(INSTANCE))
            );
          })
        );
        ALL_CHARGERS_INFO.map((CHARGERS_INFO, network) => {
          CHARGERS_INFO.map((INFO, i) => {
            ALL_RESULTS[network][i] = INFO;
          });
        });

        const ALL_REWARDS_AMOUNT = await Promise.all(
          ALL_NETWORK_CHARGERLIST.map(async (CHARGERLIST, network) => {
            return Promise.all(
              CHARGERLIST.map((CHARGER_ADDRESS, i) => {
                const REWARDTOKEN_INSTANCE = createContractInstance(
                  ALL_WEB3[network],
                  ALL_RESULTS[network][i].rewardToken,
                  TOKEN_ABI
                );
                return REWARDTOKEN_INSTANCE.methods
                  .balanceOf(CHARGER_ADDRESS)
                  .call();
              })
            );
          })
        );
        const ALL_REWARDS_SYMBOL = await Promise.all(
          ALL_NETWORK_CHARGERLIST.map((CHARGERLIST, network) => {
            return Promise.all(
              CHARGERLIST.map((CHARGER_ADDRESS, i) => {
                const TOKEN_INSTANCE = createContractInstance(
                  ALL_WEB3[network],
                  ALL_RESULTS[network][i].rewardToken,
                  TOKEN_ABI
                );
                return TOKEN_INSTANCE.methods.symbol().call();
              })
            );
          })
        );
        const ALL_STAKES_SYMBOL = await Promise.all(
          ALL_NETWORK_CHARGERLIST.map((CHARERLIST, network) => {
            return Promise.all(
              CHARERLIST.map((CHARGER_ADDRESS, i) => {
                const TOKEN_INSTANCE = createContractInstance(
                  ALL_WEB3[network],
                  ALL_RESULTS[network][i].stakeToken,
                  TOKEN_ABI
                );
                return TOKEN_INSTANCE.methods.symbol().call();
              })
            );
          })
        );
        const ALL_STAKES_BASEPERCENT = await Promise.all(
          ALL_NETWORK_CHARGERLIST.map((CHARGERLIST, network) => {
            return Promise.all(
              CHARGERLIST.map(async (CHARGER_ADDRESS, i) => {
                if (ALL_STAKES_SYMBOL[network][i] != "RCG") return 0;
                const TOKEN_INSTANCE = createContractInstance(
                  ALL_WEB3[network],
                  ALL_RESULTS[network][i].stakeToken,
                  TOKEN_ABI
                );
                return TOKEN_INSTANCE.methods.basePercent().call();
              })
            );
          })
        );

        await ALL_NETWORK_CHARGERLIST.map(async (CHARGERLIST, network) => {
          let net;
          switch (network) {
            case 0:
              net = "ERC";
              break;
            case 1:
              net = "BEP";
              break;
            case 2:
              net = "HRC";
              break;
          }
          await CHARGERLIST.map((CHARGER_ADDRESS, i) => {
            // 11.12 풀을 위해 임시적으로 사용됩니다.
            if (
              ALL_RESULTS[network][i].name === "11.2 Premier Locked Pool 300"
            ) {
              ALL_RESULTS[network][i].name = "11.12 Premier Locked Pool 200";
            } else if (
              ALL_RESULTS[network][i].name === "11.2 Locked Pool 200"
            ) {
              ALL_RESULTS[network][i].name = "11.12 Locked Pool 100";
            }

            ALL_RESULTS[network][i].address = CHARGER_ADDRESS;
            ALL_RESULTS[network][i].status = loadActiveStatus(
              ALL_RESULTS[network][i]
            );
            // 컨트랙트에서 미니멈 값을 제대로 주기 전까지 일시적으로 사용합니다.
            ALL_RESULTS[network][i].minimum = fromWei(
              ALL_RESULTS[network][i].limit,
              "ether"
            );

            ALL_RESULTS[network][i].rewardAmount =
              ALL_REWARDS_AMOUNT[network][i];
            ALL_RESULTS[network][i].basePercent =
              ALL_STAKES_BASEPERCENT[network][i];
            ALL_RESULTS[network][i].symbol = [
              ALL_REWARDS_SYMBOL[network][i],
              ALL_STAKES_SYMBOL[network][i],
            ];
            ALL_RESULTS[network][i].network = net;
            ALL_RESULTS[network][i].apy = getAPY(
              ALL_RESULTS[network][i].totalSupply,
              ALL_RESULTS[network][i].rewardAmount -
                (ALL_RESULTS[network][i].rewardToken ==
                ALL_RESULTS[network][i].stakeToken
                  ? ALL_RESULTS[network][i].totalSupply
                  : 0),
              ALL_RESULTS[network][i].DURATION,
              ALL_RESULTS[network][i].name,
              ALL_RESULTS[network][i].network
            );
            ALL_RESULTS[network][i].isLP = ALL_RESULTS[network][
              i
            ].name.includes("LP");
            ALL_RESULTS[network][i].isLocked = ALL_RESULTS[network][
              i
            ].name.includes("Locked");
            ALL_RESULTS[network][i].poolTVL =
              ALL_RESULTS[network][i].isLP &&
              ALL_RESULTS[network][i].network === "BEP"
                ? 25.6082687419 *
                  Number(
                    fromWei(ALL_RESULTS[network][i].totalSupply, "ether")
                  ) *
                  RCG_PRICE
                : ALL_RESULTS[network][i].isLP &&
                  ALL_RESULTS[network][i].network === "ERC"
                ? 4272102.29339 *
                  Number(fromWei(ALL_RESULTS[network][i].totalSupply, "ether"))
                : Number(
                    fromWei(ALL_RESULTS[network][i].totalSupply, "ether")
                  ) * RCG_PRICE;
          });
        });

        // 1. pool type에 따라 필터링 진행
        // let test = updatedList.filter((charger) =>
        //   charger.name.includes(params.type)
        // ); //
        let ALL_LIST = [];
        for (let network in ALL_RESULTS) {
          ALL_RESULTS[network].map((charger) => {
            if (
              charger.name === "9.3 Locked Pool 500" ||
              charger.name === "9.15 BSC Zero-Burning Pool 20"
            ) {
            } else {
              ALL_LIST.push(charger);
            }
          });
        }

        let tvl = 0;
        ALL_LIST.map(
          (charger) => (tvl += Number(fromWei(charger.totalSupply, "ether")))
        );
        setTvl(tvl * RCG_PRICE);
        // if (params.type === "Locked") {
        //   // 해당 풀타입이 없을 때
        //   let catchZeroPool = [];
        //   // bep Loced 예외처리 Zero 잡기
        //   catchZeroPool = updatedList.filter((charger) =>
        //     charger.name.includes("Zero")
        //   );
        //   if (catchZeroPool.length !== 0) {
        //     test.unshift(catchZeroPool[0]);
        //   }
        // }

        ALL_LIST.sort(
          (charger1, charger2) => charger2.startTime - charger1.startTime
        );

        // ALL_LIST.sort((charger1, charger2) => charger2.apy - charger1.apy);

        // UNISWAP LP POOL을 위해 임시적으로 사용합니다.

        // ALL_LIST.reverse()
        // console.log("ALL_LIST", ALL_LIST)
        // let lastCharger = ALL_LIST.pop()
        // ALL_LIST.unshift(lastCharger)

        console.log("ALL_LIST", ALL_LIST);

        if (ALL_LIST.length === 0) {
          setChList(chargerInfo);
          setFullList(chargerInfo);
        } else {
          setChList(ALL_LIST);
          setFullList(ALL_LIST);
        }
      };
      getList();

      return;
    };

    const loadPrivateChargerList = async () => {
      const priceData = await axios.post(
        `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`,
        {
          query:
            'query{pairs(where:{id:"0x9c20be0f142fb34f10e33338026fb1dd9e308da3"}) { token0Price token1Price }}',
        }
      );
      const RCG_PRICE = makeNum(priceData.data.data.pairs[0].token0Price);

      /**
       * 1. 모든 차져리스트를 받는다
       *  1-1. 각 네트워크에 대한 web3, 풀어드레스를 받는다
       *  1-2. 각 네트워크에 대한 차져 리스트를 받을 수 있다.
       *
       * {
       *    ERC: [],
       *    BEP: [],
       *    HRC: [],
       * }
       *
       * 2. 모든 차져리스트에 대한 인스턴스 생성
       * 3. 모든 차져 인스턴스에 대한 인포 받기
       * 4. 네트워크, 타입에 따라 필터링 진행
       */

      const ETH_WEB3 = web3_R.ERC;
      const BEP_WEB3 = web3_R.BEP;
      const HRC_WEB3 = web3_R.HRC;
      const ALL_WEB3 = [ETH_WEB3, BEP_WEB3, HRC_WEB3];

      const TOKEN_ABI = require("./lib/read_contract/abi/erc20.json");
      const CHARGER_ABI = require("./lib/read_contract/abi/charger.json");

      const getList = async () => {
        const ETH_CHARGER_LIST = [];
        const BEP_CHARGER_LIST = [
          "0xBda852B667e3DB881AD03a94db1b0233219bB777",
          "0x2a188018e466069933c2dfcc7326C9b3874D2569",
          "0x86d1Ecdfb61814bc8fD1f46C4Acb49a2C96a6c80",
        ];
        const HRC_CHARGER_LIST = []; //
        const ALL_NETWORK_CHARGERLIST = [
          ETH_CHARGER_LIST,
          BEP_CHARGER_LIST,
          HRC_CHARGER_LIST,
        ];

        if (ETH_CHARGER_LIST.length === 0 && BEP_CHARGER_LIST.length === 0)
          return setChListPrivate(chargerInfo);

        let ALL_RESULTS = {
          0: [],
          1: [],
          2: [], //
        };

        const ALL_CHARGER_INSTANCES = ALL_NETWORK_CHARGERLIST.map(
          (CHARGERLIST, network) => {
            return CHARGERLIST.map((CHARGER_ADDRESS) =>
              createContractInstance(
                ALL_WEB3[network],
                CHARGER_ADDRESS,
                CHARGER_ABI
              )
            );
          }
        );
        const ALL_CHARGERS_INFO = await Promise.all(
          ALL_CHARGER_INSTANCES.map(async (CHARGER_INSTANCES) => {
            return Promise.all(
              CHARGER_INSTANCES.map((INSTANCE) => getChargerInfo(INSTANCE))
            );
          })
        );
        ALL_CHARGERS_INFO.map((CHARGERS_INFO, network) => {
          CHARGERS_INFO.map((INFO, i) => {
            ALL_RESULTS[network][i] = INFO;
          });
        });

        const ALL_REWARDS_AMOUNT = await Promise.all(
          ALL_NETWORK_CHARGERLIST.map(async (CHARGERLIST, network) => {
            return Promise.all(
              CHARGERLIST.map((CHARGER_ADDRESS, i) => {
                const REWARDTOKEN_INSTANCE = createContractInstance(
                  ALL_WEB3[network],
                  ALL_RESULTS[network][i].rewardToken,
                  TOKEN_ABI
                );
                return REWARDTOKEN_INSTANCE.methods
                  .balanceOf(CHARGER_ADDRESS)
                  .call();
              })
            );
          })
        );
        const ALL_REWARDS_SYMBOL = await Promise.all(
          ALL_NETWORK_CHARGERLIST.map((CHARGERLIST, network) => {
            return Promise.all(
              CHARGERLIST.map((CHARGER_ADDRESS, i) => {
                const TOKEN_INSTANCE = createContractInstance(
                  ALL_WEB3[network],
                  ALL_RESULTS[network][i].rewardToken,
                  TOKEN_ABI
                );
                return TOKEN_INSTANCE.methods.symbol().call();
              })
            );
          })
        );
        const ALL_STAKES_SYMBOL = await Promise.all(
          ALL_NETWORK_CHARGERLIST.map((CHARERLIST, network) => {
            return Promise.all(
              CHARERLIST.map((CHARGER_ADDRESS, i) => {
                const TOKEN_INSTANCE = createContractInstance(
                  ALL_WEB3[network],
                  ALL_RESULTS[network][i].stakeToken,
                  TOKEN_ABI
                );
                return TOKEN_INSTANCE.methods.symbol().call();
              })
            );
          })
        );
        const ALL_STAKES_BASEPERCENT = await Promise.all(
          ALL_NETWORK_CHARGERLIST.map((CHARGERLIST, network) => {
            return Promise.all(
              CHARGERLIST.map(async (CHARGER_ADDRESS, i) => {
                if (ALL_STAKES_SYMBOL[network][i] != "RCG") return 0;
                const TOKEN_INSTANCE = createContractInstance(
                  ALL_WEB3[network],
                  ALL_RESULTS[network][i].stakeToken,
                  TOKEN_ABI
                );
                return TOKEN_INSTANCE.methods.basePercent().call();
              })
            );
          })
        );

        await ALL_NETWORK_CHARGERLIST.map(async (CHARGERLIST, network) => {
          let net;
          switch (network) {
            case 0:
              net = "ERC";
              break;
            case 1:
              net = "BEP";
              break;
            case 2:
              net = "HRC";
              break;
          }
          await CHARGERLIST.map((CHARGER_ADDRESS, i) => {
            ALL_RESULTS[network][i].address = CHARGER_ADDRESS;
            ALL_RESULTS[network][i].status = loadActiveStatus(
              ALL_RESULTS[network][i]
            );
            ALL_RESULTS[network][i].rewardAmount =
              ALL_REWARDS_AMOUNT[network][i];
            ALL_RESULTS[network][i].basePercent =
              ALL_STAKES_BASEPERCENT[network][i];
            ALL_RESULTS[network][i].apy = getAPY(
              ALL_RESULTS[network][i].totalSupply,
              ALL_RESULTS[network][i].rewardAmount -
                (ALL_RESULTS[network][i].rewardToken ==
                ALL_RESULTS[network][i].stakeToken
                  ? ALL_RESULTS[network][i].totalSupply
                  : 0),
              ALL_RESULTS[network][i].DURATION
            );
            ALL_RESULTS[network][i].symbol = [
              ALL_REWARDS_SYMBOL[network][i],
              ALL_STAKES_SYMBOL[network][i],
            ];
            ALL_RESULTS[network][i].network = net;
            ALL_RESULTS[network][i].isLP = ALL_RESULTS[network][
              i
            ].name.includes("LP");
            ALL_RESULTS[network][i].isLocked = ALL_RESULTS[network][
              i
            ].name.includes("Locked");
            ALL_RESULTS[network][i].poolTVL =
              ALL_RESULTS[network][i].isLP &&
              ALL_RESULTS[network][i].network === "BEP"
                ? 25.6082687419 *
                  Number(
                    fromWei(ALL_RESULTS[network][i].totalSupply, "ether")
                  ) *
                  RCG_PRICE
                : ALL_RESULTS[network][i].isLP &&
                  ALL_RESULTS[network][i].network === "ERC"
                ? 4272102.29339 *
                  Number(fromWei(ALL_RESULTS[network][i].totalSupply, "ether"))
                : Number(
                    fromWei(ALL_RESULTS[network][i].totalSupply, "ether")
                  ) * RCG_PRICE;
          });
        });

        // 1. pool type에 따라 필터링 진행
        // let test = updatedList.filter((charger) =>
        //   charger.name.includes(params.type)
        // ); //
        let ALL_LIST = [];
        for (let network in ALL_RESULTS) {
          ALL_RESULTS[network].map((charger) => {
            if (
              charger.name === "9.3 Locked Pool 500" ||
              charger.name === "9.15 BSC Zero-Burning Pool 20"
            ) {
            } else {
              ALL_LIST.push(charger);
            }
          });
        }

        let tvl = 0;
        ALL_LIST.map(
          (charger) => (tvl += Number(fromWei(charger.totalSupply, "ether")))
        );
        setPrivateTvl(tvl * RCG_PRICE);
        // if (params.type === "Locked") {
        //   // 해당 풀타입이 없을 때
        //   let catchZeroPool = [];
        //   // bep Loced 예외처리 Zero 잡기
        //   catchZeroPool = updatedList.filter((charger) =>
        //     charger.name.includes("Zero")
        //   );
        //   if (catchZeroPool.length !== 0) {
        //     test.unshift(catchZeroPool[0]);
        //   }
        // }
        console.log("ALL_LIST", ALL_LIST.reverse());

        if (ALL_LIST.length === 0) {
          setChListPrivate(chargerInfo);
          setFullListPrivate(chargerInfo);
        } else {
          setChListPrivate(ALL_LIST.reverse());
          setFullListPrivate(ALL_LIST.reverse());
        }
      };
      getList();

      return;
    };

    const loadActiveStatus = ({
      totalSupply,
      startTime,
      DURATION,
      limit,
      name,
    }) => {
      startTime = Number(startTime);
      DURATION = Number(DURATION);
      let NOW = new Date().getTime() / 1000;

      // 11.1 풀을 위해 일시적으로 사용합니다.
      if (name.includes("11.1 ")) return "Inactive";

      if (name.includes("10.1 ")) return "Inactive";

      if (name.includes("11.12 ")) return "Closed";

      if (NOW < startTime) return "Inactive";

      if (NOW > startTime + DURATION) return "Closed";
      // 리미트 설정 이전까지 잠정 주석처리 합니다.
      // if (limit != "0" && totalSupply >= limit) return "Close";
      return "Active";
    };

    const getAPY = (totalSupply, rewardAmount, DURATION, name, network) => {
      console.log(name);
      const Year = 1 * 365 * 24 * 60 * 60;

      if (
        name === "11.12 Pancake LP Locked Pool 300" ||
        name === "11.12 Premier Locked Pool 200" ||
        name === "11.12 Locked Pool 100"
      ) {
        return 0;
      }

      if (name.includes("LP")) {
        if (network === "BEP") {
          // console.log(((((rewardAmount * (Year / DURATION)) / totalSupply) * 100) / 25).toString())
          return (
            (((rewardAmount * (Year / DURATION)) / totalSupply) * 100) /
            25.6328762768
          ).toString();
        } else if (network === "ERC") {
          // console.log(toBN(rewardAmount))
          // console.log(fromWei(rewardAmount, "ether"))
          // console.log(((((rewardAmount * (Year / DURATION)) / totalSupply) * 100) / 31).toString())
          // return ((((rewardAmount * (Year / DURATION)) / totalSupply) * 100) / 31).toString();
          return (
            (((rewardAmount * (Year / DURATION)) / totalSupply) * 100) /
            966514.761619
          ).toString();
        }
      } else {
        return (
          ((rewardAmount * (Year / DURATION)) / totalSupply) *
          100
        ).toString();
      }
    };

    return (
      <div className="App">
        <Gnb />
        <Switch>
          <Route
            path="/station"
            component={() => (
              <Station
                toast={toast}
                loadChargerList={loadChargerList}
                chList={chList}
                setChList={setChList}
                fullList={fullList}
                setFullList={setFullList}
                tvl={tvl}
                setTvl={setTvl}
                loadPrivateChargerList={loadPrivateChargerList}
                chListPrivate={chListPrivate}
                setChListPrivate={setChListPrivate}
                fullListPrivate={fullListPrivate}
                setFullListPrivate={setFullListPrivate}
                privateTvl={privateTvl}
                setPrivateTvl={setPrivateTvl}
              />
            )}
          ></Route>
          <Route path="/swap" component={() => <Swap toast={toast} />}></Route>
          <Route
            path="/"
            component={() => (
              <Home loadAnalytics={loadAnalytics} analytics={analytics} />
            )}
          ></Route>
        </Switch>
        <style jsx global>{`
          .App {
            display: flex;
            background-color: #02051c;
            min-height: 100vh;
          }
          .home {
            width: 100%;
            min-width: 1088px;
            // overflow: hidden;
            // background: url(/bg_main_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .about {
            width: 100%;
            min-width: 1088px;
            // background: url(/bg_about_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .recharge {
            width: 100%;
            min-width: 1088px;
            // background: url(/bg_recharge_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .defi {
            width: 100%;
            min-width: 1088px;
            // background: url(/bg_station_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          .docs {
            width: 100%;
            min-width: 1088px;
            // background: url(/gb_docs_bottom.svg);
            background-color: #02051c;
            // background-size: cover;
            // background-position: bottom 0px center;
          }
          body::-webkit-scrollbar {
            width: 2px;
          }
          body::-webkit-scrollbar-thumb {
            background-color: #2f3542;
            border-radius: 1px;
          }
          body::-webkit-scrollbar-track {
            background-color: #02051c;
            border-radius: 1px;
          }
          .ToastHub___StyledAnimatedDiv-sc-1y0i8xl-1 {
            margin-top: 10px;
          }
          .ToastHub___StyledDiv2-sc-1y0i8xl-2 {
            font-size: 15px;
            height: 110%;
            padding: 5px 20px;
          }
        `}</style>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return true;
  }
);

export default App;
