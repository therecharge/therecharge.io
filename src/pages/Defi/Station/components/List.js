import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
//components
import Image from "./List/image.js";
import Row from "./List/row.js";
/* Libraries */
import {
  getChargerList,
  createContractInstance,
  getTokenInfo,
  getChargerInfo,
} from "../../../../lib/read_contract/Station";
/* Store */
import { web3ReaderState } from "../../../../store/read-web3";
import { ReactComponent as DropdownClose } from "./List/assets/dropdown-close.svg";
import { ReactComponent as DropdownOpen } from "./List/assets/dropdown-open.svg";
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
  },
];

function List({ /*type, list,*/ params, toast, network }) {
  const [t] = useTranslation();
  const [chList, setChList] = useState(loading_data);
  const [sel, setSelCharger] = useState(0);
  const [isOpen, setOpen] = useState(false);
  const [web3_R] = useRecoilState(web3ReaderState);
  const NETWORKS = require("../../../../lib/networks.json");

  const loadChargerList = async () => {
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
      },
    ];
    const priceData = await axios.post(
      `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`,
      {
        query:
          'query{pairs(where:{id:"0x9c20be0f142fb34f10e33338026fb1dd9e308da3"}) { token0Price token1Price }}',
      }
    );

    const RCG_PRICE = makeNum(priceData.data.data.pairs[0][0]);
    const NETWORK = NETWORKS[process.env.REACT_APP_VERSION];
    const WEB3 = web3_R[network];
    const TOKEN_ADDRESS = NETWORK.tokenAddress[network];
    const CHARGERLIST_ADDRESS = NETWORK.chargerListAddress[network];
    const TOKEN_ABI = require("../../../../lib/read_contract/abi/erc20.json");
    const CHARGERLIST_ABI = require("../../../../lib/read_contract/abi/chargerList.json");
    const CHARGER_ABI = require("../../../../lib/read_contract/abi/charger.json");

    const CHARGERLIST_INSTANCE = createContractInstance(
      WEB3,
      CHARGERLIST_ADDRESS,
      CHARGERLIST_ABI
    );

    const getList = async () => {
      const list = await getChargerList(CHARGERLIST_INSTANCE);
      // console.log("chargerInfo", chargerInfo);
      if (list.length == 0) return setChList(chargerInfo);
      let updatedList = [];
      const CHARGER_INSTANCES = list.map((CHARGER_ADDRESS) => {
        return createContractInstance(WEB3, CHARGER_ADDRESS, CHARGER_ABI);
      });
      const CHARGERS_INFO = await Promise.all(
        CHARGER_INSTANCES.map((CHARGER_INSTANCE) => {
          return getChargerInfo(CHARGER_INSTANCE);
        })
      );
      CHARGERS_INFO.map((INFO, i) => {
        updatedList[i] = INFO;
      });
      const REWARDS_AMOUNT = await Promise.all(
        list.map(async (CHARGER_ADDRESS, i) => {
          const REWARDTOKEN_INSTANCE = createContractInstance(
            WEB3,
            updatedList[i].rewardToken,
            TOKEN_ABI
          );
          return REWARDTOKEN_INSTANCE.methods.balanceOf(CHARGER_ADDRESS).call();
        })
      );
      const REWARDS_SYMBOL = await Promise.all(
        list.map(async (CHARGER_ADDRESS, i) => {
          const TOKEN_INSTANCE = createContractInstance(
            WEB3,
            updatedList[i].rewardToken,
            TOKEN_ABI
          );
          return TOKEN_INSTANCE.methods.symbol().call();
        })
      );
      const STAKES_SYMBOL = await Promise.all(
        list.map(async (CHARGER_ADDRESS, i) => {
          const TOKEN_INSTANCE = createContractInstance(
            WEB3,
            updatedList[i].stakeToken,
            TOKEN_ABI
          );
          return TOKEN_INSTANCE.methods.symbol().call();
        })
      );
      const STAKES_BASEPERCENT = await Promise.all(
        list.map(async (CHARGER_ADDRESS, i) => {
          const TOKEN_INSTANCE = createContractInstance(
            WEB3,
            updatedList[i].stakeToken,
            TOKEN_ABI
          );
          return TOKEN_INSTANCE.methods.basePercent().call();
        })
      );
      await list.map(async (CHARGER_ADDRESS, i) => {
        updatedList[i].address = CHARGER_ADDRESS;
        updatedList[i].status = loadActiveStatus(updatedList[i]);
        updatedList[i].rewardAmount = REWARDS_AMOUNT[i];
        updatedList[i].basePercent = STAKES_BASEPERCENT[i];
        updatedList[i].apy = getAPY(
          updatedList[i].totalSupply,
          updatedList[i].rewardAmount -
          (updatedList[i].rewardToken == updatedList[i].stakeToken
            ? updatedList[i].totalSupply
            : 0),
          updatedList[i].DURATION
        );
        updatedList[i].symbol = [REWARDS_SYMBOL[i], STAKES_SYMBOL[i]];
      });

      // console.log("updatedList", updatedList)

      // 1. pool type에 따라 필터링 진행
      let test = updatedList.filter((charger) =>
        charger.name.includes(params.type)
      );

      if (params.type === "Locked") {
        // 해당 풀타입이 없을 때
        let catchZeroPool = [];
        // bep Loced 예외처리 Zero 잡기
        catchZeroPool = updatedList.filter((charger) =>
          charger.name.includes("Zero")
        );
        if (catchZeroPool.length !== 0) {
          test.unshift(catchZeroPool[0]);
        }
      }

      if (test.length === 0) {
        setChList(chargerInfo);
      } else {
        setChList(test);
      }
    };
    getList();

    return;
  };

  // Whenever Staking type is changed, reload Pool list
  useEffect(async () => {
    // setOnLoading(true);
    setChList(loading_data);
    try {
      await loadChargerList();
    } catch (err) {
      console.log(err);
    }
  }, [params, network]);

  const updateChargerInfoList = () => {
    loadChargerList();
  };

  const getAPY = (totalSupply, rewardAmount, DURATION) => {
    const Year = 1 * 365 * 24 * 60 * 60;
    return (
      ((rewardAmount * (Year / DURATION)) / totalSupply) *
      100
    ).toString();
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

  // useInterval(() => updateChargerInfoList(), 10000);
  // function Btn({ status, isOpen }) {
  //   if (isOpen) return <DropdownOpen className="btn" />;
  //   else
  //     return (
  //       <DropdownClose
  //         className="btn"
  //         fill={status == "Inactive" ? "#7E7E7E" : "#fff"}
  //       />
  //     );
  // }

  // function Status({ status }) {
  //   function color() {
  //     switch (status) {
  //       case "Close":
  //         return "#D62828";
  //       case "Inactive":
  //         return "#7E7E7E";
  //       case "Active":
  //         return "#0EEF6D";
  //     }
  //   }
  //   return (
  //     <p
  //       className="Roboto_20pt_Black status"
  //       style={{ color: color(status), width: "71.5px", textAlign: "center" }}
  //     >
  //       {status}
  //     </p>
  //   );
  // }
  return (
    <Container>
      <Content>

        {/* <p
              className={
                window.innerWidth > 1088
                  ? "Roboto_30pt_Black"
                  : "Roboto_40pt_Black"
              }
            >
              Charger List
            </p>
            <TotalValue>
              <div>Total Value Locked</div>
              <div>$ 000,000,000,000.00</div>
            </TotalValue>
          </TitleWrapper>
        </Title> */}
        {/* <Line /> */}
        {/* <DropDownWrapper>
          <NetWork>
            <Text>Network</Text>
            <BoxContainer>
              <Box>ERC-20</Box>

              <Btn src="./dropdown-close.svg" />
            </BoxContainer>
          </NetWork>
          <Type>
            <Text>Type</Text>
            <BoxContainer>
              <Box></Box>
              <Button></Button>
            </BoxContainer>
          </Type>
          <Sortby>
            <Text>Sort by</Text>
            <BoxContainer>
              <Box></Box>
              <Button></Button>
            </BoxContainer>
          </Sortby>
        </DropDownWrapper > */}
        <RowContainer>
          {chList.map((charger, index) => {
            // console.log(charger);
            return (
              <div
                className={params.isLP ? "disable" : ""}
                style={
                  charger.name === "Loading List.."
                    ? { cursor: "not-allowed" }
                    : {}
                }
              >
                <Row
                  key={charger.name}
                  status={charger.status} // active or not
                  name={charger.name}
                  tvl={charger.totalSupply}
                  apy={charger.apy}
                  info={charger}
                  limit={charger.limit}
                  params={params} // 버튼에 대한 분기처리 때문에 필요
                  toast={toast}
                  period={loadPoolPeriod(charger.startTime, charger.DURATION)}
                  net={network}
                />
              </div>
            );
          })}
        </RowContainer>
      </Content >
    </Container >
  );
}

const loadPoolPeriod = (startTime, duration) => {
  let ret = "21.01.01 00:00:00 ~ 21.01.30 00:00:00((UTC+9)+9)";
  const endTime = Number(startTime) + Number(duration);

  const formatter = (timestamp) => {
    var d = new Date(Number(timestamp) * 1000);
    const z = (x) => {
      return x.toString().padStart(2, "0");
    };
    return `${new String(d.getFullYear()).substr(2, 3)}.${z(
      d.getMonth() + 1
    )}.${z(d.getDate())} ${z(d.getHours())}:${z(d.getMinutes())}:${z(
      d.getSeconds()
    )}`;
  };
  ret = `${formatter(startTime)} ~ ${formatter(endTime)}`;
  return ret;
};

const loadActiveStatus = ({ totalSupply, startTime, DURATION, limit }) => {
  startTime = Number(startTime);
  DURATION = Number(DURATION);
  let NOW = new Date().getTime() / 1000;
  // console.log(limit, totalSupply);
  if (NOW < startTime) return "Inactive";

  if (NOW > startTime + DURATION) return "Close";

  if (limit != "0" && totalSupply >= limit) return "Close";
  return "Active";
};
function makeNum(str = "0", decimal = 4) {
  let newStr = str;
  if (typeof newStr === "number") newStr = str.toString();
  let arr = newStr.split(".");
  if (arr.length == 1 || arr[0].length > 8) return arr[0];
  else {
    return arr[0] + "." + arr[1].substr(0, decimal);
  }
}

const Container = styled.div`
  margin-top: 40px;
  margin-bottom: 120px;
  display: flex;
  width: 100%;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 1088px;

  img {
    height: 60px;
    margin: auto;
    @media (min-width: 1088px) {
      margin: 0;
      align-items: flex-end
    }
  }
  div{
  }
  p {
    color: white;
    // margin: auto;
    margin-top: 20px;

    @media (min-width: 1088px) {
      margin: 0;
      margin-left: 10px;
      margin-bottom: 0px;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 1088px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between	;
    align-items: flex-end;
  }
`;
const TitleWrapper = styled.div`
display:flex;
justify-content: space-between	;
`
const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 30px 0px 30px;

  @media (min-width: 1088px) {
    margin: 0px;
    margin-top: 40px;
  }

  .disable {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const TotalValue = styled.div``;
const Line = styled.div`
  height: 2px;
  margin: 40px 10px 0px 10px;
  width: auto;
  background-color: #9314b2;
  box-shadow: 0px 0px 20px 0.5px white;
`;

// const DropDownWrapper = styled.div`
// display:flex;
// justify-content: flex-end;
// `;
// const NetWork = styled.div``;
// const Text = styled.div``;
// const Box = styled.div`
// width: 196px;
// height: 42px;
// // margin: 8px 0 0 302px;
// // padding: 0 0 0 2px;
// object-fit: contain;
// border-radius: 30px;
// background-color: var(--black-30);
// `;
// const Type = styled.div``;
// const Sortby = styled.div``;
// const BoxContainer = styled.div`
// display:flex;
// `;
// const Button = styled.div``;
// const Btn = styled.div``

export default List;
