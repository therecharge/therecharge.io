/* Libraries */
import { fromWei } from "web3-utils";
import React, { useState, useEffect, useRef } from "react";
import { useSortBy, useTable } from "react-table";
import styled from "styled-components";
import axios from "axios";
import { RotateCircleLoading } from "react-loadingg";
import { withTranslation } from "react-i18next";
/* Components */
import Footer from "../../Components/Desktop/Footer";
import WalletConnect from "../../../Component/Components/Common/WalletConnect";
/* Libraries */
import {
  getChargerList,
  createContractInstance,
  getChargerInfo,
} from "../../../lib/read_contract/Station";
/* State */
import { useRecoilState } from "recoil";
import { HashLink } from "react-router-hash-link";
import { accountState } from "../../../store/web3";
import { web3ReaderState } from "../../../store/read-web3";

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
  const NETWORKS = require("../../../lib/networks.json");
  const CHARGERLIST_ABI = require("../../../lib/read_contract/abi/chargerList.json");
  const CHARGER_ABI = require("../../../lib/read_contract/abi/charger.json");

  const [onLoading, setOnLoading] = useState(true);
  const [myPools, setMyPools] = useState(null);
  const [analytics, setAnalytics] = useState({
    ERC: {},
    HRC: {},
    BEP: {},
    general: {},
  });

  const data = React.useMemo(
    () => (myPools === null ? [] : myPools),
    [myPools]
  );
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data, initialState }, useSortBy);

  const loadMyPools = async () => {
    try {
      const NETWORK = NETWORKS[process.env.REACT_APP_VERSION];
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

      let ercPool = await Promise.all(ERC_CHARGER_INSTANCES.map(async (instance, i) => {
        let { name } = ERC_CHARGERS_INFO[i]

        let [balance, reward] = await Promise.all([
          await instance.methods.balanceOf(account).call(),
          await instance.methods.earned(account).call(),
        ]);

        return {
          type: (name.includes("Locked") || name.includes("Zero")) ? "Locked Staking" : "Flexible Staking",
          name: name,
          balance: makeNum(fromWei(balance, "ether")),
          reward: makeNum(fromWei(reward, "ether"))
        }
      }))

      let bepPool = await Promise.all(BEP_CHARGER_INSTANCES.map(async (instance, i) => {
        let { name } = BEP_CHARGERS_INFO[i]

        let [balance, reward] = await Promise.all([
          await instance.methods.balanceOf(account).call(),
          await instance.methods.earned(account).call(),
        ]);

        return {
          type: (name.includes("Locked") || name.includes("Zero")) ? "Locked Staking" : "Flexible Staking",
          name: name,
          balance: fromWei(balance, "ether"),
          reward: fromWei(reward, "ether")
        }
      }))

      let ALL_OF_CHARCERS_INFO = [...ercPool, ...bepPool].filter(pool => pool.balance > 0)

      // console.log("ALL_OF_CHARCERS_INFO", ALL_OF_CHARCERS_INFO)

      setMyPools(ALL_OF_CHARCERS_INFO);
    } catch (err) {
      console.log(err);
    }
  };

  const loadAnalytics = async () => {
    try {
      const [analData, priceData, tvlData] = await Promise.all([
        axios.get(`https://bridge.therecharge.io/analytics`),
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
      // console.log("TVL", tvlData);
      // console.log(analData.data);
      // console.log(token1Price);
      setAnalytics({
        ...analData.data,
        ERC: {
          ...analData.data.ERC,
          price: token0Price, // 이더리움 유니스왑 실시간 가격
        },
        general: { tvl: TVL },
      });
      // console.log(analytics);
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
    if (account) loadMyPools();
    loadAnalytics();
  }, 5000);

  useEffect(() => {
    if (account) loadMyPools();
  }, [account]);

  return (
    <Container>
      <Content>
        <div className="first" id="station" style={{ paddingTop: "100px" }}>
          <div className="theme Roboto_50pt_Black">Station</div>
          <div className="contents">
            <div className="content">
              <HashLink
                className="box"
                to={"/defi/station"}
              // onClick={() => handleModalPool()}
              >
                <img src="/ic_chargingstation.svg" />
                <div className="name Roboto_40pt_Black">Charging Station</div>
              </HashLink>
              <div className="text Roboto_20pt_Regular">
                {t("De-Fi/Station/charging-station")}
              </div>
            </div>
            <div className="content">
              <HashLink
                className="box"
                to={"/defi/swap"}
              // onClick={() => handleModalSwap()}
              >
                <img src="/ic_rechargingswap.svg" />
                <div className="name Roboto_40pt_Black">Recharge swap</div>
              </HashLink>
              <div className="text Roboto_20pt_Regular">
                {t("De-Fi/Station/recharge-swap")}
              </div>
            </div>
          </div>
        </div>
      </Content>
      <Content>
        <div className="second" id="mypools" style={{ paddingTop: "100px" }}>
          <div className="theme Roboto_50pt_Black">My pools</div>
          {!account ? (
            <div className="contents">
              <div className="content Roboto_30pt_Medium">
                {t("De-Fi/Station/MyPool/ask-connect")}
              </div>
              <WalletConnect
                need="2"
                notConnected="Connect Wallet"
                wrongNetwork="Change network"
                m="auto"
                w="366px"
                h="40px"
                fontsize="20px"
              />
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
                              to={`/defi/station#${myPools[row.index].type.split(" ")[0]
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
          <div className="theme Roboto_50pt_Black">Analytics</div>
          <div className="subTheme Roboto_30pt_Medium">
            Overview of Recharge Ecosystem
          </div>
          <div className="contents">
            <div className="container">
              <div className="center box exception">
                <div className="title Roboto_30pt_Black">
                  ${" "}
                  {analytics.general.tvl
                    ? convertNum(analytics.general.tvl, {
                      unitSeparator: true,
                    })
                    : 0}
                </div>
                <div className="text Roboto_16pt_Regular_Gray">
                  Total Value Locked
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box exception">
                <div className="title Roboto_30pt_Medium">
                  {/* {analytics.general.RedemptionRate
                    ? makeNum(analytics.general.RedemptionRate) / 100
                    : 0}{" "} */}
                  2 %
                </div>
                <div className="text Roboto_16pt_Regular_Gray">
                  Current Redemption Rate
                </div>
              </div>
              <div className="right box exception">
                <div className="item">
                  <div className="title Roboto_20pt_Black">
                    {analytics.general.ServicesPlugged
                      ? analytics.general.ServicesPlugged
                      : 0}
                  </div>
                  <div className="text Roboto_16pt_Regular_Gray">
                    Number of Services{<br />}Plugged
                  </div>
                </div>
                <div className="item">
                  <div className="title Roboto_20pt_Black">
                    {analytics.general.ChargersActivated
                      ? analytics.general.ChargersActivated
                      : 0}
                  </div>
                  <div className="text Roboto_16pt_Regular_Gray">
                    Number of Chargers{<br />}Activated
                  </div>
                </div>
                <div className="item">
                  <div className="title Roboto_20pt_Black">
                    {analytics.general.BridgesActivated
                      ? analytics.general.BridgesActivated
                      : 0}
                  </div>
                  <div className="text Roboto_16pt_Regular_Gray">
                    Number of Bridges{<br />}Activated
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box">
                <div
                  className="title Roboto_30pt_Medium"
                  style={{ zIndex: "2" }}
                >
                  {analytics.ERC.total
                    ? convertNum(weiToEther(convertNum(analytics.ERC.total)), {
                      unitSeparator: true,
                    })
                    : 0}{" "}
                  RCG
                </div>
                <div
                  className="text Roboto_16pt_Regular_Gray"
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
                        : 0} RCG */}
                      -
                    </div>
                    <div className="text Roboto_16pt_Regular_Gray">
                      Accumulated Carbon Redemption ERC20
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      $ {analytics.ERC.price ? makeNum(analytics.ERC.price) : 0}
                    </div>
                    <div className="text Roboto_16pt_Regular_Gray">
                      Current RCG Price($) ERC20 Uniswap
                    </div>
                  </div>
                </div>
                <div className="content">
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {analytics.ERC.swapped
                        ? makeNum(analytics.ERC.swapped)
                        : 0}
                    </div>
                    <div className="text Roboto_16pt_Regular_Gray">
                      RCG (ERC20) Swapped in
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {analytics.ERC.conversion
                        ? makeNum(analytics.ERC.conversion)
                        : 0}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_16pt_Regular_Gray">
                      Accumulated Conversion Fee(ERC20)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box">
                <div
                  className="title Roboto_30pt_Medium"
                  style={{ zIndex: "2" }}
                >
                  {analytics.BEP.total
                    ? convertNum(weiToEther(convertNum(analytics.BEP.total)), {
                      unitSeparator: true,
                    })
                    : 0}{" "}
                  RCG
                </div>
                <div
                  className="text Roboto_16pt_Regular_Gray"
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
                        : 0} RCG */}
                      -
                    </div>
                    <div className="text Roboto_16pt_Regular_Gray">
                      Accumulated Carbon Redemption BEP20
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      ${" "}
                      {analytics.BEP.price
                        ? analytics.BEP.price === "0"
                          ? "-"
                          : makeNum(analytics.BEP.price)
                        : 0}
                    </div>
                    <div className="text Roboto_16pt_Regular_Gray">
                      Current RCG Price($) BEP20 Pancakeswap
                    </div>
                  </div>
                </div>
                <div className="content">
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {analytics.BEP.swapped
                        ? makeNum(analytics.BEP.swapped)
                        : 0}
                    </div>
                    <div className="text Roboto_16pt_Regular_Gray">
                      RCG (BEP20) Swapped in
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {analytics.BEP.conversion
                        ? makeNum(analytics.BEP.conversion)
                        : 0}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_16pt_Regular_Gray">
                      Accumulated Conversion Fee(BEP20)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="left box">
                <div
                  className="title Roboto_30pt_Medium"
                  style={{ zIndex: "2" }}
                >
                  {analytics.HRC.total
                    ? convertNum(weiToEther(convertNum(analytics.HRC.total)), {
                      unitSeparator: true,
                    })
                    : 0}{" "}
                  RCG
                </div>
                <div
                  className="text Roboto_16pt_Regular_Gray"
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
                    <div className="text Roboto_16pt_Regular_Gray">
                      Accumulated Carbon Redemption HRC20
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      ${" "}
                      {analytics.HRC.price
                        ? analytics.HRC.price === "0"
                          ? "-"
                          : makeNum(analytics.HRC.price)
                        : 0}
                    </div>
                    <div className="text Roboto_16pt_Regular_Gray">
                      Current RCG Price($) HRC20-Mdex
                    </div>
                  </div>
                </div>
                <div className="content">
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {analytics.HRC.swapped
                        ? makeNum(analytics.HRC.swapped)
                        : 0}
                    </div>
                    <div className="text Roboto_16pt_Regular_Gray">
                      RCG (HRC20) Swapped in
                    </div>
                  </div>
                  <div className="item">
                    <div className="title Roboto_20pt_Black">
                      {analytics.HRC.conversion
                        ? makeNum(analytics.HRC.conversion)
                        : 0}{" "}
                      RCG
                    </div>
                    <div className="text Roboto_16pt_Regular_Gray">
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
  margin-top: 105px;
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
      text-shadow: 0 0 1px white, 0 0 15px white;
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
        cursor: pointer;

        .box {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-content: center;
          justify-content: center;
          align-items: center;
          padding: 40px 0;
          box-sizing: border-box;
          width: 534px;
          height: 229px;
          background-color: var(--black-30);
          box-shadow: 0 0 15px 0 var(--purple);
          border-radius: 8px;
          img {
            width: 68.4px;
            height: 80px;
          }
          .name {
            margin-top: 16px;
          }
        }
        .box:hover {
          background-color: var(--black-20);
        }
        .text {
          padding: 20px 20px 0 20px;
          text-align: center;
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

    .theme {
      margin: auto auto;
      text-shadow: 0 0 1px white, 0 0 15px white;
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
        margin-top: 40px;
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

    .theme {
      margin: auto;
      margin-bottom: 40px;
      text-shadow: 0 0 1px white, 0 0 15px white;
    }
    .subTheme {
      margin: auto;
      margin-bottom: 80px;
    }
    .contents {
      display: flex;
      flex-direction: column;
      gap: 20px 0;
      width: 100%;
      gap: 16px 0;
      margin-bottom: 120px;

      .container {
        display: flex;
        gap: 0 8px;

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
          width: 400px;
          height: 230px;
          display: flex;
          flex-direction: column;
          gap: 8px 0;
          box-sizing: border-box;
          padding: 20px;
          justify-content: center;
          align-items: center;

          .logo1 {
            position: absolute;
            bottom: 40px;
            right: 149.8px;
          }

          .logo2 {
            position: absolute;
            bottom: 40px;
            right: 147.5px;
          }

          .logo3 {
            position: absolute;
            bottom: 40px;
            right: 121.3px;
          }
        }

        .left.exception {
          height: 120px;
        }

        .right.exception {
          display: flex;
          height: 120px;
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
          height: 230px;

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
