/* Libraries */
import { fromWei } from "web3-utils";
import React, { useState, useEffect, useRef } from "react";
import { useSortBy, useTable } from "react-table";
import styled from "styled-components";
import axios from "axios";
import { RotateCircleLoading } from "react-loadingg";
import { HashLink } from "react-router-hash-link";
import { withTranslation } from "react-i18next";
import WalletConnect from "../Components/Common/WalletConnect";
/* Libraries */
import {
  getChargerList,
  createContractInstance,
  getChargerInfo,
} from "../lib/read_contract/Station";
/* State */
import { useRecoilState } from "recoil";
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
    numberOf: {},
    totalCirculation: {},
    // BEP: {},
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
      {
        Header: "",
        accessor: "detail",
        disableSortBy: true,
      },
    ],
    []
  );

  const initialState = {
    sortBy: [
      {
        id: "balance",
        desc: true,
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
      const UNISWAP_LP_HOLDER_ADDRESS =
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
        RCG_eth_TOKEN_balance,
      ] = await Promise.all([
        await RCG_TOKEN_INSTANCE.methods
          .balanceOf(RCG_bsc_CONTRACT_ADDRESS)
          .call(),
        await WBNB_TOKEN_INSTANCE.methods
          .balanceOf(RCG_bsc_CONTRACT_ADDRESS)
          .call(),
        await UNISWAP_LP_INSTANCE.methods
          .balanceOf(UNISWAP_LP_HOLDER_ADDRESS)
          .call(),
        await RCG_eth_TOKEN_INSTANCE.methods
          .balanceOf(UNISWAP_LP_ADDRESS)
          .call(),
      ]);

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

      let uni_lp_price =
        Number(fromWei(RCG_eth_TOKEN_balance, "ether")) *
        token0Price *
        2 *
        0.95;
      // console.log("RCG_eth_TOKEN_balance", RCG_eth_TOKEN_balance);

      setUniLpLocker(
        Number(fromWei(UNISWAP_LP_balance, "ether")) * uni_lp_price
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
    if (account) {
      loadMyPools();
    }
    loadAnalytics();
  }, 5000);

  useEffect(() => {
    if (account) loadMyPools();
  }, [account]);

  return (
    <Container>
      <Content id="station">
        <div className="first" style={{ paddingTop: "100px" }}>
          <div className="theme Roboto_50pt_Black">Overview</div>
          <div className="contents">
            <div className="content">
              <div className="box">
                <div style={{ width: "96.4px", height: "80px" }}>
                  <img src="/ic_chargingstation.svg" />
                </div>
                <div className="desc">
                  <div className="name Roboto_40pt_Black_L">
                    Charging Station
                  </div>
                  <div className="text Roboto_25pt_Regular">
                    {t("De-Fi/Station/charging-station")}
                  </div>
                  <HashLink to={"/station"} style={{ textDecoration: "none" }}>
                    <div className="link Roboto_25pt_Regular">
                      {t("De-Fi/Station/charging-station-link")}
                    </div>
                  </HashLink>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="box">
                <div style={{ width: "96.4px", height: "80px" }}>
                  <img
                    src="/ic_rechargingswap.svg"
                    style={{ width: "96.4px", height: "80px" }}
                  />
                </div>
                <div className="desc">
                  <div className="Roboto_40pt_Black_L">Recharge swap</div>
                  <div className="text Roboto_25pt_Regular">
                    {t("De-Fi/Station/recharge-swap")}
                  </div>
                  <HashLink to={"/swap"} style={{ textDecoration: "none" }}>
                    <div className="link Roboto_25pt_Regular">
                      {t("De-Fi/Station/recharge-swap-link")}
                    </div>
                  </HashLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Content id="mypools">
        <div className="second">
          <div className="theme Roboto_30pt_Black_L">My pools</div>
          <Line />
          {!account ? (
            <div className="contents">
              <div className="content Roboto_30pt_Medium">
                {t("De-Fi/Station/MyPool/ask-connect")}
              </div>

              {/* <WalletConnect
                need="2"
                notConnected="Wallet Connect"
                wrongNetwork="Change network for data"
                m="auto"
                w="540px"
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
          ) : myPools.length == 0 ? (
            <div className="contents">
              <div
                className="content Roboto_40pt_Black"
                style={{ width: "356px" }}
              >
                {t("De-Fi/Station/MyPool/no-pool")}
              </div>
            </div>
          ) : (
            <div className="contents">
              <table
                {...getTableProps()}
                style={{ width: "720px", borderCollapse: "collapse" }}
                className="Roboto_20pt_Black"
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

                            // <td
                            //   {...cell.getCellProps()}
                            //   onClick={() => {
                            //     setParams({
                            //       type: `${myPools[row.index].type.split(" ")[0]
                            //         }`,
                            //       isLP: false,
                            //     });

                            //     setModalPool2Open(!modalPool2Open);
                            //     handleModalPool();
                            //   }}
                            //   style={{
                            //     paddingTop: "20px",
                            //     textAlign: "center",
                            //   }}
                            // >
                            //   {cell.render("Cell")}
                            // </td>
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
      <Content id="analytics" style={{ width: "100%" }}>
        <div className="third" style={{ marginTop: "200px" }}>
          <div className="themes">
            <div className="theme Roboto_30pt_Black_L">Analytics</div>
            <div className="subTheme Roboto_20pt_Medium_L">
              Overview of Recharge Ecosystem
            </div>
          </div>
          <Line />
          <div className="contents">
            <div className="container">
              <div className="center box exception">
                <div className="title Roboto_40pt_Medium_C">
                  ${" "}
                  {tvd
                    ? Number(Number(tvd).toFixed(2)).toLocaleString()
                    : Number(3195417.17).toLocaleString()}
                </div>
                <div className="text Roboto_25pt_Gray">Total Value Deposit</div>
              </div>
            </div>
            <div className="container">
              <div
                className="center box"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  width: "620px",
                  height: "226px",
                }}
              >
                <div>
                  <div
                    className="Roboto_25pt_Black"
                    style={{ textAlign: "center", marginBottom: "8px" }}
                  >
                    {`$ 
                    ${
                      analytics.uniswap_lp_locker
                        ? analytics.uniswap_lp_locker
                        : "0.00"
                    }
                    `}
                  </div>
                  <div className="text Roboto_25pt_Gray">Uniswap LP Locker</div>
                </div>
                <div>
                  <div
                    className="Roboto_25pt_Black"
                    style={{ textAlign: "center", marginBottom: "8px" }}
                  >
                    $ 0.00
                  </div>
                  <div className="text Roboto_25pt_Gray">
                    PancakeSwap LP Locker
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box exception">
                <div className="title Roboto_40pt_Medium_C">
                  {/* {analytics.general.RedemptionRate
                    ? makeNum(analytics.general.RedemptionRate) / 100
                    : 0}{" "} */}
                  2 %
                </div>
                <div className="text Roboto_25pt_Gray">
                  Current Redemption Rate
                </div>
              </div>
              <div className="right box exception">
                <div className="item">
                  <div
                    className="title Roboto_25pt_Black"
                    style={{ textAlign: "center" }}
                  >
                    {analytics.numberOf.Plugged
                      ? analytics.numberOf.Plugged
                      : 0}
                  </div>
                  <div className="text Roboto_20pt_Regular_Gray">
                    Number of Services{<br />}Plugged
                  </div>
                </div>
                <div className="item">
                  <div
                    className="title Roboto_25pt_Black"
                    style={{ textAlign: "center" }}
                  >
                    {analytics.numberOf.Charger
                      ? analytics.numberOf.Charger
                      : 0}
                  </div>
                  <div className="text Roboto_20pt_Regular_Gray">
                    Number of Chargers{<br />}Activated
                  </div>
                </div>
                <div className="item">
                  <div
                    className="title Roboto_25pt_Black"
                    style={{ textAlign: "center" }}
                  >
                    {analytics.numberOf.Bridges
                      ? analytics.numberOf.Bridges
                      : 0}
                  </div>
                  <div className="text Roboto_20pt_Regular_Gray">
                    Number of Bridges{<br />}Activated
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box">
                <div
                  className="title Roboto_40pt_Medium_C"
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
                  className="text Roboto_20pt_Regular_Gray"
                  style={{ zIndex: "2" }}
                >
                  Total Circulating Supply in ERC20
                </div>
                <div className="logo1">
                  <img
                    src="/img_erc_back.svg"
                    style={{ width: "92.2px", height: "150px" }}
                  />
                </div>
              </div>
              <div className="right box">
                <div className="content le">
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {/* {analytics.ERC.redemption
                        ? makeNum(analytics.ERC.redemption)
                        : 0}{" "}RCG */}
                      -
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      Accumulated Carbon Redemption ERC20
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      ${" "}
                      {analytics.rcg_eth_price
                        ? makeNum(analytics.rcg_eth_price)
                        : 0}
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      Current RCG Price($) ERC20 Uniswap
                    </div>
                  </div>
                </div>
                <div className="content">
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {/* {analytics.ERC.swapped
                        ? makeNum(analytics.ERC.swapped)
                        : 0} */}
                      0
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      RCG (ERC20) Swapped in
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {/* {analytics.ERC.conversion
                        ? makeNum(analytics.ERC.conversion)
                        : 0}{" "} */}
                      0 RCG
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      Accumulated Conversion Fee(ERC20)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box">
                <div
                  className="title Roboto_40pt_Medium_C"
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
                  className="text Roboto_20pt_Regular_Gray"
                  style={{ zIndex: "2" }}
                >
                  Total Circulating Supply in BEP20
                </div>
                <div className="logo3">
                  <img
                    src="/img_bep_back.svg"
                    style={{ width: "150px", height: "150px" }}
                  />
                </div>
              </div>
              <div className="right box">
                <div className="content le">
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {/* {analytics.BEP.redemption
                        ? makeNum(analytics.BEP.redemption)
                        : 0}{" "}
                      RCG */}
                      -
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      Accumulated Carbon Redemption BEP20
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      $ {analytics.rcg_bsc_price ? analytics.rcg_bsc_price : 0}
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      Current RCG Price($) BEP20 Pancakeswap
                    </div>
                  </div>
                </div>
                <div className="content">
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {/* {analytics.BEP.swapped
                        ? makeNum(analytics.BEP.swapped)
                        : 0} */}
                      0
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      RCG (BEP20) Swapped in
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {/* {analytics.BEP.conversion
                        ? makeNum(analytics.BEP.conversion)
                        : 0}{" "} */}
                      0 RCG
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      Accumulated Conversion Fee(BEP20)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box">
                <div
                  className="title Roboto_40pt_Medium_C"
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
                  className="text Roboto_20pt_Regular_Gray"
                  style={{ zIndex: "2" }}
                >
                  Total Circulating Supply in HRC20
                </div>
                <div className="logo2">
                  <img
                    src="/img_hrc_back.svg"
                    style={{ width: "97.5px", height: "150px" }}
                  />
                </div>
              </div>
              <div className="right box">
                <div className="content le">
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {/* {analytics.HRC.redemption
                        ? makeNum(analytics.HRC.redemption)
                        : 0}{" "}
                      RCG */}
                      -
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      Accumulated Carbon Redemption HRC20
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      ${" "}
                      {/* {analytics.HRC.price
                        ? analytics.HRC.price === "0"
                          ? "-"
                          : makeNum(analytics.HRC.price)
                        : 0} */}
                      0
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      Current RCG Price($) HRC20-Mdex
                    </div>
                  </div>
                </div>
                <div className="content">
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {/* {analytics.HRC.swapped
                        ? makeNum(analytics.HRC.swapped)
                        : 0} */}
                      0
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      RCG (HRC20) Swapped in
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {/* {analytics.HRC.conversion
                        ? makeNum(analytics.HRC.conversion)
                        : 0}{" "} */}
                      0 RCG
                    </div>
                    <div className="text Roboto_20pt_Regular_Gray">
                      Accumulated Conversion Fee(HRC20)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="subTheme Roboto_30pt_Medium">
              Daily Carbon Redemption
            </div>
            <div className="graph">
              <img src="/sampleimg_graph.svg" />
            </div> */}
        </div>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  margin: auto auto;
  margin-top: 105px;
  display: flex;
  flex-direction: column;
  // min-width: 1088px;
  width: 100%;
`;
const Content = styled.div`
  display: flex;
  margin: auto auto;
  margin-bottom: 20px;
  width: 720px;
  justify-content: center;
  height: fit-content; // 조정 필요

  color: var(--white);

  .text {
    white-space: pre-line;
  }
  .first {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    width: 720px;
    padding-bottom: 100px;

    .theme {
      margin: auto auto;
      margin-bottom: 120px;
    }
    .contents {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: auto;
      width: 620px;
      gap: 80px;

      .content {
        display: flex;
        flex-direction: column;
        margin: auto 10px;
        width: 620px;

        .box {
          text-decoration: none;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          width: 620px;
          border-radius: 8px;
          img {
            width: 96.4px;
            height: 90px;
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
    width: 620px;
    margin: 100px auto;

    .theme {
      margin-bottom: 8px;
    }

    .contents {
      table {
        margin-top: 80px;
        background-color: none;
      }

      .tableRow:hover {
        background-color: var(--black-20);
      }
      .content {
        margin: auto;
        margin-top: 8px;
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
    margin: auto 50px;
    width: 620px;
    .themes {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 8px;

      .theme {
      }
      .subTheme {
      }
    }
    .contents {
      display: flex;
      flex-direction: column;
      gap: 16px 0;
      width: 100%;
      margin-top: 40px;
      margin-bottom: 120px;

      .container {
        display: flex;
        flex-direction: column;
        gap: 16px 0;

        .center {
          position: relative;
          width: 100%;
          height: 120px;
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
          height: 230px;
          display: flex;
          flex-direction: column;
          gap: 16px 0;
          box-sizing: border-box;
          padding: 20px;
          justify-content: center;
          align-items: center;

          .logo1 {
            position: absolute;
            bottom: 40px;
            right: 262.8px;
          }

          .logo2 {
            position: absolute;
            bottom: 40px;
            right: 260.5px;
          }

          .logo3 {
            position: absolute;
            bottom: 40px;
            right: 234.3px;
          }
        }

        .left.exception {
          height: 150px;
        }

        .right.exception {
          display: flex;
          flex-direction: row;
          height: 120px;
          padding: 0 20px;
          box-sizing: border-box;
          justify-content: space-between;
          align-items: center;

          .item {
            display: flex;
            flex-direction: column;
            gap: 8px 0;
          }
        }

        .right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 20px 0;

          .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 20px 0;

            .item {
              display: flex;
              flex-direction: column;
              gap: 8px 0;
            }
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

const Footer = styled.div`
  display: flex;
  margin: auto;
  margin-bottom: 180px;
  color: #ffffff;

  .footer {
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    .header {
      display: flex;
      margin: 0 auto;
      padding: 12px 0;
      width: 286px;
      height: 50px;
      box-sizing: border-box;
      text-align: center;
      border: 1px solid var(--yellow);
      border-radius: 6px;
      a {
        margin: auto;
        margin-top: -3px;
        text-decoration: none;
        color: #ffffff;
      }
      span {
        margin-left: 30px;
        margin-right: -30px;
        color: var(--yellow);
      }
    }
    .header:hover {
      border-radius: 6px;
      background-color: var(--yellow);

      span {
        color: var(--white);
      }
    }
    .sns {
      display: flex;
      margin: 40px auto;
      align-items: center;
      .logo {
        margin: 0 20px;
        cursor: pointer;
        img {
          width: 30px;
          vertical-align: top;
        }
      }
    }
    .bottom {
      margin: 0 auto;
    }
  }
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
    width: 400px;
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
