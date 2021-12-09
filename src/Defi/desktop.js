/* Libraries */
import { fromWei } from "web3-utils";
import React, { useState, useEffect, useRef } from "react";
import { useSortBy, useTable } from "react-table";
import styled from "styled-components";
import axios from "axios";
import { RotateCircleLoading } from "react-loadingg";
import { withTranslation } from "react-i18next";
/* Components */
import Footer from "../Components/Desktop/Footer";
import WalletConnect from "../Components/Common/WalletConnect";
/* Libraries */
import {
  getChargerList,
  createContractInstance,
  getChargerInfo,
} from "../lib/read_contract/Station";
/* State */
import { useRecoilState } from "recoil";
import { HashLink } from "react-router-hash-link";
import { accountState } from "../store/web3";
import { web3ReaderState } from "../store/read-web3";
import { tvdState } from "../store/data";
import { uniLpLockerState } from "../store/data";

function convert(n) {
  var sign = +n < 0 ? "-" : "",
    toStr = n.toString();
  if (!/e/i.test(toStr)) {
    return n;
  }
  var [lead, decimal, pow] = n
    .toString()
    .replace(/^-/, "")
    .replace(/^([0-9]+)(e.*)/, "$1.$2")
    .split(/e|\./);
  return +pow < 0
    ? sign +
        "0." +
        "0".repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) +
        lead +
        decimal
    : sign +
        lead +
        (+pow >= decimal.length
          ? decimal + "0".repeat(Math.max(+pow - decimal.length || 0, 0))
          : decimal.slice(0, +pow) + "." + decimal.slice(+pow));
}

const convertNum = (num, { unitSeparator } = { unitSeparator: false }) => {
  let newNum;
  if (typeof num === "string") newNum = Number(num);
  if (unitSeparator) return newNum.toLocaleString();
  return newNum.toLocaleString("fullwide", { useGrouping: false });
};
function makeNum(str, decimal = 4) {
  let arr = str.split(".");
  if (arr.length == 1 || arr[0].length > 8) return arr[0];
  else {
    return arr[0] + "." + arr[1].substr(0, decimal);
  }
}
const weiToEther = (wei) => {
  return fromWei(wei, "ether");
};

function Defi({ toast, t }) {
  const [account] = useRecoilState(accountState);
  const [web3_R] = useRecoilState(web3ReaderState);
  const [tvd, setTvd] = useRecoilState(tvdState);
  const [uniLpLocker, setUniLpLocker] = useRecoilState(uniLpLockerState);
  const NETWORKS = require("../lib/networks.json");
  const CHARGERLIST_ABI = require("../lib/read_contract/abi/chargerList.json");
  const CHARGER_ABI = require("../lib/read_contract/abi/charger.json");
  const ERC20_ABI = require("../lib/read_contract/abi/erc20.json");
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
    // general: {},
  });

  const data = React.useMemo(() => (myPools === null ? [] : myPools), [
    myPools,
  ]);
  const columns = React.useMemo(
    () => [
      {
        Header: "Type",
        accessor: "type", // accessor is the "key" in the data
        disableSortBy: true,
      },
      {
        Header: "Name",
        accessor: "name",
        disableSortBy: true,
      },
      {
        Header: "My Balance",
        accessor: "balance",
        id: "balance",
        disableSortBy: true,
      },
      {
        Header: "Reward",
        accessor: "reward",
        disableSortBy: true,
      },
    ],
    []
  );
  const initialState = {
    sortBy: [
      {
        id: "name",
      },
    ],
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, initialState }, useSortBy);

  const loadMyPools = async () => {
    try {
      const NETWORK = NETWORKS["mainnet"];
      const ERC_WEB3 = web3_R["ERC"];
      const BEP_WEB3 = web3_R["BEP"];
      const ERC_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress["ERC"];
      const BEP_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress["BEP"];

      const ERC_CHARGERLIST_INSTANCE = createContractInstance(
        ERC_WEB3,
        ERC_CHARGERLIST_ADDRESS,
        CHARGERLIST_ABI
      );
      const BEP_CHARGERLIST_INSTANCE = createContractInstance(
        BEP_WEB3,
        BEP_CHARGERLIST_ADDRESS,
        CHARGERLIST_ABI
      );

      const ERC_CHARGERLIST = await getChargerList(ERC_CHARGERLIST_INSTANCE);
      const BEP_CHARGERLIST = await getChargerList(BEP_CHARGERLIST_INSTANCE);

      const ERC_CHARGER_INSTANCES = ERC_CHARGERLIST.map((CHARGER_ADDRESS) => {
        return createContractInstance(ERC_WEB3, CHARGER_ADDRESS, CHARGER_ABI);
      });
      const BEP_CHARGER_INSTANCES = BEP_CHARGERLIST.map((CHARGER_ADDRESS) => {
        return createContractInstance(BEP_WEB3, CHARGER_ADDRESS, CHARGER_ABI);
      });

      const ERC_CHARGERS_INFO = await Promise.all(
        ERC_CHARGER_INSTANCES.map((CHARGER_INSTANCE) => {
          return getChargerInfo(CHARGER_INSTANCE);
        })
      );
      const BEP_CHARGERS_INFO = await Promise.all(
        BEP_CHARGER_INSTANCES.map((CHARGER_INSTANCE) => {
          return getChargerInfo(CHARGER_INSTANCE);
        })
      );

      let ercPool = await Promise.all(
        ERC_CHARGER_INSTANCES.map(async (instance, i) => {
          let { name } = ERC_CHARGERS_INFO[i];

          let [balance, reward] = await Promise.all([
            await instance.methods.balanceOf(account).call(),
            await instance.methods.earned(account).call(),
          ]);

          return {
            type:
              name.includes("Locked") || name.includes("Zero")
                ? "Locked Staking"
                : "Flexible Staking",
            name: name,
            balance: makeNum(fromWei(balance, "ether")),
            reward: makeNum(fromWei(reward, "ether")),
          };
        })
      );

      let bepPool = await Promise.all(
        BEP_CHARGER_INSTANCES.map(async (instance, i) => {
          let { name } = BEP_CHARGERS_INFO[i];

          let [balance, reward] = await Promise.all([
            await instance.methods.balanceOf(account).call(),
            await instance.methods.earned(account).call(),
          ]);

          return {
            type:
              name.includes("Locked") || name.includes("Zero")
                ? "Locked Staking"
                : "Flexible Staking",
            name: name,
            balance: fromWei(balance, "ether"),
            reward: fromWei(reward, "ether"),
          };
        })
      );

      let ALL_OF_CHARCERS_INFO = [...ercPool, ...bepPool].filter(
        (pool) => pool.balance > 0
      );

      // console.log("ALL_OF_CHARCERS_INFO", ALL_OF_CHARCERS_INFO)

      setMyPools(ALL_OF_CHARCERS_INFO);
    } catch (err) {
      console.log(err);
    }
  };

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
      // console.log(
      //   "UNISWAP LP 컨트랙트가 보유한 RCG(eth)(단위: RCG) : ",
      //   fromWei(RCG_eth_TOKEN_balance, "ether")
      // );
      // console.log("UNISWAP LP 총발행량 : ", 0.242903245740529089);
      // console.log("RCG(eth) 개당 가격(단위: $) : ", token0Price);
      // console.log(
      //   "UNISWAP LP 개당 가격(단위: RCG) = UNISWAP LP 컨트랙트가 보유한 RCG(eth) * 2 * 0.95 / UNISWAP LP 총 발행량",
      //   "$ " +
      //     (Number(fromWei(RCG_eth_TOKEN_balance, "ether")) *
      //       token0Price *
      //       2 *
      //       0.95) /
      //       Number(fromWei(UNISWAP_LP_totalSupply, "ether"))
      // );

      let uni_lp_price =
        (Number(fromWei(RCG_eth_TOKEN_balance, "ether")) *
          token0Price *
          2 *
          0.95) /
        Number(fromWei(UNISWAP_LP_totalSupply, "ether"));
      // console.log("RCG_eth_TOKEN_balance", RCG_eth_TOKEN_balance);

      // console.log(
      //   "UNI_LP_LOCKER가 보유한 balance(단위: RCG) : ",
      //   fromWei(UNISWAP_LP_balance, "ether")
      // );
      setUniLpLocker(
        Number(fromWei(UNISWAP_LP_balance, "ether")) * uni_lp_price
      );

      // console.log(
      //   "UNI_LP_LOCKER가 보유한 balance의 달러가치(단위: $) : ",
      //   uniLpLocker
      // );

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
      // console.log(analytics);
    } catch (err) {
      console.log(err);
    }
  };

  const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };

  useInterval(() => {
    if (account) loadMyPools();
    loadAnalytics();
    // console.log("!!!!!!!!!!!!!!!!!!!!!!", editedTVLData);
  }, 5000);

  useEffect(() => {
    if (account) loadMyPools();
  }, [account]);

  return (
    <Container>
      <Content>
        <div className="first" id="station" style={{ paddingTop: "80px" }}>
          <div className="theme Roboto_40pt_Black">Overview</div>
          <div className="contents">
            <div className="content">
              <div className="box">
                <img src="/ic_chargingstation.svg" />
                <div className="desc">
                  <div className="name Roboto_30pt_Black_L">
                    Charging Station
                  </div>
                  <div className="text Roboto_16pt_Regular_L">
                    {t("De-Fi/Station/charging-station")}
                  </div>
                  <HashLink to={"/station"} style={{ textDecoration: "none" }}>
                    <div className="link Roboto_16pt_Regular_L">
                      {t("De-Fi/Station/charging-station-link")}
                    </div>
                  </HashLink>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="box">
                <img src="/ic_rechargingswap.svg" />
                <div className="desc">
                  <div className="name Roboto_30pt_Black_L">Recharge swap</div>
                  <div className="text Roboto_16pt_Regular_L">
                    {t("De-Fi/Station/recharge-swap")}
                  </div>
                  <HashLink to={"/swap"} style={{ textDecoration: "none" }}>
                    <div className="link Roboto_16pt_Regular_L">
                      {t("De-Fi/Station/recharge-swap-link")}
                    </div>
                  </HashLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Content>
        <div className="second" id="mypools" style={{ paddingTop: "100px" }}>
          <div className="theme Roboto_30pt_Black">My pools</div>
          <Line />
          {!account ? (
            <div className="contents">
              <div className="content Roboto_30pt_Medium">
                {t("De-Fi/Station/MyPool/ask-connect")}
              </div>
              {/* <WalletConnect
                need="2"
                notConnected="Wallet Connect"
                wrongNetwork="Change network"
                m="auto"
                w="366px"
                h="40px"
                fontsize="20px"
              /> */}
            </div>
          ) : myPools === null ? (
            <Loading style={{ display: onLoading ? "" : "none" }}>
              <div className="box">
                <RotateCircleLoading
                  color="#9314b2"
                  style={{ margin: "auto", marginTop: "67.6px" }}
                />
                <div className="text Roboto_30pt_Black">Loading…</div>
              </div>
            </Loading>
          ) : myPools.length === 0 ? (
            <div className="contents">
              <div className="content Roboto_30pt_Medium">
                {t("De-Fi/Station/MyPool/no-pool")}
              </div>
            </div>
          ) : (
            <div className="contents">
              <table
                {...getTableProps()}
                style={{ width: "1088px", borderCollapse: "collapse" }}
                className="Roboto_16pt_Bold"
              >
                <thead>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          style={{
                            textAlign: "center",
                          }}
                        >
                          {column.render("Header")}
                          {column.Header !== "" ? (
                            <div
                              style={{
                                width: "100%",
                                height: "2px",
                                margin: "20px 0",
                                objectFit: "contain",
                                boxShadow: "0 0 20px 0 #ffffff",
                                backgroundColor: "var(--purple)",
                              }}
                            ></div>
                          ) : (
                            <></>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} className="tableRow">
                        {row.cells.map((cell) => {
                          return (
                            <HashLink
                              to={`/defi/station#${
                                myPools[row.index].type.split(" ")[0]
                              }`}
                              style={{
                                display: "table-cell",
                                textDecoration: "none",
                                padding: "10px",
                                textAlign: "center",
                                cursor: "pointer",
                              }}
                            >
                              {cell.render("Cell")}
                            </HashLink>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Content>
      <Content>
        <div className="third" id="analytics" style={{ paddingTop: "100px" }}>
          <div className="themes">
            <div className="theme Roboto_30pt_Black">Analytics</div>
            <div className="subTheme Roboto_20pt_Medium_L">
              Overview of Recharge Ecosystem
            </div>
          </div>
          <Line style={{ marginBottom: "20px" }} />
          <div className="contents">
            <div className="container">
              <div className="center box exception">
                <div className="title Roboto_30pt_Black">
                  ${" "}
                  {/* {analytics.general.tvl
                    ? Number(
                        Number(analytics.general.tvl).toFixed(2)
                      ).toLocaleString()
                    : Number(0).toFixed(2)} */}
                  {tvd
                    ? Number(Number(tvd).toFixed(2)).toLocaleString()
                    : Number(3478866.78).toLocaleString()}
                </div>
                <div className="text Roboto_16pt_Regular_Gray">
                  Total Value Deposited
                </div>
              </div>
            </div>
            <div className="container">
              <div
                className="center box"
                style={{ display: "flex", flexDirection: "row", gap: "180px" }}
              >
                <div>
                  <div className="title Roboto_30pt_Black">{`$ ${
                    analytics.uniswap_lp_locker
                      ? analytics.uniswap_lp_locker
                      : "0.00"
                  }`}</div>
                  <div className="text Roboto_16pt_Regular_Gray">
                    Uniswap LP Locker
                  </div>
                </div>
                <div>
                  <div className="title Roboto_30pt_Black">$ 0.00</div>
                  <div className="text Roboto_16pt_Regular_Gray">
                    PancakeSwap LP Locker
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box exception">
                <div className="title Roboto_20pt_Medium_C">
                  {/* {analytics.general.RedemptionRate
                    ? makeNum(analytics.general.RedemptionRate) / 100
                    : 0}{" "} */}
                  2 %
                </div>
                <div className="text Roboto_12pt_Regular_L_Gray">
                  Current Redemption Rate
                </div>
              </div>
              <div className="right box exception">
                <div className="item">
                  <div className="title Roboto_16pt_Bold">
                    {analytics.numberOf.Plugged
                      ? analytics.numberOf.Plugged
                      : 0}
                  </div>
                  <div className="text Roboto_12pt_Regular_L_Gray">
                    Number of Services Plugged
                  </div>
                </div>
                <div className="item">
                  <div className="title Roboto_16pt_Bold">
                    {/* {analytics.numberOf.Charger
                      ? analytics.numberOf.Charger
                      : 0} */}
                    3
                  </div>
                  <div className="text Roboto_12pt_Regular_L_Gray">
                    Number of Chargers Activated
                  </div>
                </div>
                <div className="item">
                  <div className="title Roboto_16pt_Bold">
                    {analytics.numberOf.Bridges
                      ? analytics.numberOf.Bridges
                      : 0}
                  </div>
                  <div className="text Roboto_12pt_Regular_L_Gray">
                    Number of Bridges Activated
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box">
                <div
                  className="title title Roboto_20pt_Medium_C"
                  style={{ zIndex: "2" }}
                >
                  {analytics.totalCirculation.eth
                    ? Number(
                        Number(
                          weiToEther(convertNum(analytics.totalCirculation.eth))
                        ).toFixed(2)
                      ).toLocaleString()
                    : Number(0).toFixed(2)}{" "}
                  RCG
                </div>
                <div
                  className="text Roboto_12pt_Regular_L_Gray"
                  style={{ zIndex: "2" }}
                >
                  Total Circulating Supply in ERC20
                </div>
                <div className="logo1">
                  <img
                    src="/img_erc_back.svg"
                    style={{ width: "61.5px", height: "100px" }}
                  />
                </div>
              </div>
              <div className="right box">
                <div className="content le">
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      {analytics.Accumulated.eth.Redemption
                        ? Number(
                            Number(
                              weiToEther(
                                convertNum(analytics.Accumulated.eth.Redemption)
                              )
                            ).toFixed(2)
                          ).toLocaleString()
                        : Number(0).toFixed(2)}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      Accumulated Carbon Redemption ERC20
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      ${" "}
                      {analytics.rcg_eth_price
                        ? makeNum(analytics.rcg_eth_price)
                        : 0}
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      Current RCG Price($) ERC20 Uniswap
                    </div>
                  </div>
                </div>
                <div className="content">
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      {analytics.Accumulated.eth.SwappedIn
                        ? Number(
                            Number(
                              weiToEther(
                                convertNum(analytics.Accumulated.eth.SwappedIn)
                              )
                            ).toFixed(2)
                          ).toLocaleString()
                        : Number(0).toFixed(2)}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      RCG (ERC20) Swapped in
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      {analytics.Accumulated.eth.ConversionFee
                        ? Number(
                            Number(
                              weiToEther(
                                convertNum(
                                  analytics.Accumulated.eth.ConversionFee
                                )
                              )
                            ).toFixed(2)
                          ).toLocaleString()
                        : Number(0).toFixed(2)}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      Accumulated Conversion Fee(ERC20)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box">
                <div
                  className="title title Roboto_20pt_Medium_C"
                  style={{ zIndex: "2" }}
                >
                  {analytics.totalCirculation.bsc
                    ? Number(
                        Number(
                          weiToEther(convertNum(analytics.totalCirculation.bsc))
                        ).toFixed(2)
                      ).toLocaleString()
                    : Number(0).toFixed(2)}{" "}
                  RCG
                </div>
                <div
                  className="text Roboto_12pt_Regular_L_Gray"
                  style={{ zIndex: "2" }}
                >
                  Total Circulating Supply in BEP20
                </div>
                <div className="logo3">
                  <img
                    src="/img_bep_back.svg"
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              </div>
              <div className="right box">
                <div className="content le">
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      {analytics.Accumulated.bsc.Redemption
                        ? Number(
                            Number(
                              weiToEther(
                                convertNum(analytics.Accumulated.bsc.Redemption)
                              )
                            ).toFixed(2)
                          ).toLocaleString()
                        : Number(0).toFixed(2)}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      Accumulated Carbon Redemption BEP20
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      $ {analytics.rcg_bsc_price ? analytics.rcg_bsc_price : 0}
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      Current RCG Price($) BEP20 Pancakeswap
                    </div>
                  </div>
                </div>
                <div className="content">
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      {analytics.Accumulated.bsc.SwappedIn
                        ? Number(
                            Number(
                              weiToEther(
                                convertNum(analytics.Accumulated.bsc.SwappedIn)
                              )
                            ).toFixed(2)
                          ).toLocaleString()
                        : Number(0).toFixed(2)}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      RCG (BEP20) Swapped in
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      {analytics.Accumulated.bsc.ConversionFee
                        ? Number(
                            Number(
                              weiToEther(
                                convertNum(
                                  analytics.Accumulated.bsc.ConversionFee
                                )
                              )
                            ).toFixed(2)
                          ).toLocaleString()
                        : Number(0).toFixed(2)}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      Accumulated Conversion Fee(BEP20)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box">
                <div
                  className="title title Roboto_20pt_Medium_C"
                  style={{ zIndex: "2" }}
                >
                  {analytics.totalCirculation.heco
                    ? Number(
                        Number(
                          weiToEther(
                            convertNum(analytics.totalCirculation.heco)
                          )
                        ).toFixed(2)
                      ).toLocaleString()
                    : Number(0).toFixed(2)}{" "}
                  RCG
                </div>
                <div
                  className="text Roboto_12pt_Regular_L_Gray"
                  style={{ zIndex: "2" }}
                >
                  Total Circulating Supply in HRC20
                </div>
                <div className="logo2">
                  <img
                    src="/img_hrc_back.svg"
                    style={{ width: "65px", height: "100px" }}
                  />
                </div>
              </div>
              <div className="right box">
                <div className="content le">
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      {analytics.Accumulated.heco.Redemption
                        ? Number(
                            Number(
                              weiToEther(
                                convertNum(
                                  analytics.Accumulated.heco.Redemption
                                )
                              )
                            ).toFixed(2)
                          ).toLocaleString()
                        : Number(0).toFixed(2)}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      Accumulated Carbon Redemption HRC20
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      ${" "}
                      {/* {analytics.HRC.price
                        ? analytics.HRC.price === "0"
                          ? "-"
                          : makeNum(analytics.HRC.price)
                        : 0} */}
                      0
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      Current RCG Price($) HRC20-Mdex
                    </div>
                  </div>
                </div>
                <div className="content">
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      {analytics.Accumulated.heco.SwappedIn
                        ? Number(
                            Number(
                              weiToEther(
                                convertNum(analytics.Accumulated.heco.SwappedIn)
                              )
                            ).toFixed(2)
                          ).toLocaleString()
                        : Number(0).toFixed(2)}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      RCG (HRC20) Swapped in
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_16pt_Bold">
                      {analytics.Accumulated.heco.ConversionFee
                        ? Number(
                            Number(
                              weiToEther(
                                convertNum(
                                  analytics.Accumulated.heco.ConversionFee
                                )
                              )
                            ).toFixed(2)
                          ).toLocaleString()
                        : Number(0).toFixed(2)}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_12pt_Regular_L_Gray">
                      Accumulated Conversion Fee(HRC20)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  margin: auto auto;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  min-width: 1088px;
  width: 100%;
`;
const Content = styled.div`
  display: flex;
  margin: auto auto;
  margin-bottom: 20px;
  width: 1088px;
  justify-content: center;
  height: fit-content; // 조정 필요

  color: var(--white);

  .first {
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 1088px;

    .theme {
      margin: auto auto;
      margin-bottom: 80px;
    }
    .contents {
      display: flex;
      margin: auto;
      width: 100%;

      .content {
        display: flex;
        flex-direction: column;
        margin: auto 10px;
        width: 534px;

        .box {
          text-decoration: none;
          display: flex;
          align-content: center;
          justify-content: center;
          align-items: center;
          width: 534px;
          border-radius: 8px;
          img {
            width: 68.4px;
            height: 80px;
          }
          .desc {
            display: flex;
            flex-direction: column;
            margin-left: 20px;
          }
          .name {
            margin-bottom: 8px;
          }
        }
        .text {
          line-height: 1.56;
        }
        .link {
          margin-top: 8px;
          line-height: 1.56;
          color: var(--purple);
          text-decoration: none;
          cursor: pointer;
        }
      }
      .disable {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
  }
  .second {
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 1088px;

    .theme {
      margin-bottom: 16px;
      text-align: left;
    }

    .contents {
      table {
        margin-top: 80px;
        background-color: none;
      }

      .tableRow:hover {
        width: 1052px;
        background-color: var(--black-20);
      }
      .content {
        margin: auto;
        margin-top: 16px;
        margin-bottom: 120px;
      }
      .walletConnect {
        display: flex;
        cursor: pointer;
        width: 366px;
        height: 40px;
        border: solid 2px var(--yellow);
        border-radius: 210px;
        p {
          margin: auto;
        }
      }
      .walletConnect:hover {
        background-color: var(--yellow);
      }
    }
  }
  .third {
    display: flex;
    flex-direction: column;
    margin: auto;

    .themes {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .theme {
      // margin: auto;
    }
    .subTheme {
      // margin: auto;
      // margin-bottom: 80px;
    }
    .contents {
      display: flex;
      flex-direction: column;
      gap: 20px 0;
      width: 100%;
      gap: 16px 0;
      margin-bottom: 160px;

      .container {
        display: flex;
        gap: 0 8px;

        .center {
          position: relative;
          width: 100%;
          height: 100px;
          display: flex;
          flex-direction: column;
          gap: 8px 0;
          box-sizing: border-box;
          padding: 20px;
          justify-content: center;
          align-items: center;
        }

        .left {
          position: relative;
          width: 400px;
          height: 146px;
          display: flex;
          flex-direction: column;
          gap: 8px 0;
          box-sizing: border-box;
          padding: 20px;
          justify-content: center;
          align-items: center;

          .logo1 {
            position: absolute;
            bottom: 20px;
            right: 170px;
          }

          .logo2 {
            position: absolute;
            bottom: 20px;
            right: 170px;
          }

          .logo3 {
            position: absolute;
            bottom: 20px;
            right: 153px;
          }
        }

        .left.exception {
          height: 80px;
        }

        .right.exception {
          display: flex;
          height: 80px;
          padding: 0 40px;
          box-sizing: border-box;
          justify-content: space-between;
          align-items: center;

          .item {
            display: flex;
            flex-direction: column;
            gap: 8px 0;
          }
          .title {
            text-align: left;
          }
          .text {
            text-align: left;
          }
        }

        .right {
          display: flex;
          width: 680px;
          height: 146px;

          .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 40px;
            gap: 20px 0;

            .item {
              display: flex;
              flex-direction: column;
              gap: 8px 0;
            }
            .title {
              text-align: left;
            }
            .text {
              text-align: left;
            }
          }
          .le {
            width: 302px;
          }
        }
      }
      .box {
        background-color: var(--black-30);
        border-radius: 20px;
      }
      .box:hover {
        background-color: var(--black-20);
      }
    }
  }
`;

const Line = styled.div`
  height: 2px;
  background-color: var(--purple);
  box-shadow: 0 0 20px 0 #fff;
`;

const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 7;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background-color: rgba(0, 0, 0, 0.5);

  .box {
    display: flex;
    flex-direction: column;
    width: 600px;
    height: 255px;
    background-color: rgba(0, 0, 0, 1);
    border-radius: 20px;

    .text {
      margin: auto;
      margin-bottom: 67.6px;
    }
  }
`;

export default withTranslation()(Defi);
