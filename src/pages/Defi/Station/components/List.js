import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
//components
// import Image from "./List/image.js";
import Row from "./List/row.js";
/* Libraries */
import {
  getChargerList,
  createContractInstance,
  // getTokenInfo,
  getChargerInfo,
} from "../../../../lib/read_contract/Station";
import { fromWei } from "web3-utils";
/* Store */
import { web3ReaderState } from "../../../../store/read-web3";
// import { ReactComponent as DropdownClose } from "./List/assets/dropdown-close.svg";
// import { ReactComponent as DropdownOpen } from "./List/assets/dropdown-open.svg";
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
    network: "ERC"
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
    network: "ERC"
  },
];

function List({ /*type, list,*/ params, toast, network, setTvl }) {

  const [t] = useTranslation();
  const [fullList, setFullList] = useState(loading_data);
  const [chList, setChList] = useState(loading_data);
  // const [isOpen, setOpen] = useState(false);
  const [web3_R] = useRecoilState(web3ReaderState);
  const NETWORKS = require("../../../../lib/networks.json");

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
    const ALL_WEB3 = [ETH_WEB3, BEP_WEB3, HRC_WEB3]

    const NETWORK = NETWORKS[process.env.REACT_APP_VERSION];
    // const TOKEN_ADDRESS = NETWORK.tokenAddress[network]; //
    const ETH_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress.ERC;
    const BEP_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress.BEP;
    const HRC_CHARGERLIST_ADDRESS = NETWORK.chargerListAddress.HRC; //

    const CHARGERLIST_ABI = require("../../../../lib/read_contract/abi/chargerList.json");
    const TOKEN_ABI = require("../../../../lib/read_contract/abi/erc20.json");
    const CHARGER_ABI = require("../../../../lib/read_contract/abi/charger.json");

    const ETH_CHARGERLIST_INSTANCE = createContractInstance(ETH_WEB3, ETH_CHARGERLIST_ADDRESS, CHARGERLIST_ABI);
    const BEP_CHARGERLIST_INSTANCE = createContractInstance(BEP_WEB3, BEP_CHARGERLIST_ADDRESS, CHARGERLIST_ABI);
    const HRC_CHARGERLIST_INSTANCE = createContractInstance(HRC_WEB3, HRC_CHARGERLIST_ADDRESS, CHARGERLIST_ABI); //

    const getList = async () => {
      const ETH_CHARGER_LIST = await getChargerList(ETH_CHARGERLIST_INSTANCE);
      const BEP_CHARGER_LIST = await getChargerList(BEP_CHARGERLIST_INSTANCE);
      const HRC_CHARGER_LIST = await getChargerList(HRC_CHARGERLIST_INSTANCE); //
      const ALL_NETWORK_CHARGERLIST = [ETH_CHARGER_LIST, BEP_CHARGER_LIST, HRC_CHARGER_LIST];

      if (ETH_CHARGER_LIST.length === 0 && BEP_CHARGER_LIST.length === 0) return setChList(chargerInfo);

      let ALL_RESULTS = {
        0: [],
        1: [],
        2: [], //
      }

      const ALL_CHARGER_INSTANCES = ALL_NETWORK_CHARGERLIST.map((CHARGERLIST, network) => {
        return CHARGERLIST.map((CHARGER_ADDRESS) => {
          return createContractInstance(ALL_WEB3[network], CHARGER_ADDRESS, CHARGER_ABI);
        })
      })
      const ALL_CHARGERS_INFO = await Promise.all(
        ALL_CHARGER_INSTANCES.map(async (CHARGER_INSTANCES) => {
          return Promise.all(CHARGER_INSTANCES.map((INSTANCE) => {
            return getChargerInfo(INSTANCE)
          }))
        }))
      ALL_CHARGERS_INFO.map((CHARGERS_INFO, network) => {
        CHARGERS_INFO.map((INFO, i) => {
          ALL_RESULTS[network][i] = INFO
        })
      })

      const ALL_REWARDS_AMOUNT = await Promise.all(
        ALL_NETWORK_CHARGERLIST.map(async (CHARGERLIST, network) => {
          return Promise.all(CHARGERLIST.map((CHARGER_ADDRESS, i) => {
            const REWARDTOKEN_INSTANCE = createContractInstance(ALL_WEB3[network], ALL_RESULTS[network][i].rewardToken, TOKEN_ABI);
            return REWARDTOKEN_INSTANCE.methods.balanceOf(CHARGER_ADDRESS).call();
          }))
        })
      )
      const ALL_REWARDS_SYMBOL = await Promise.all(
        ALL_NETWORK_CHARGERLIST.map((CHARGERLIST, network) => {
          return Promise.all(CHARGERLIST.map((CHARGER_ADDRESS, i) => {
            const TOKEN_INSTANCE = createContractInstance(ALL_WEB3[network], ALL_RESULTS[network][i].rewardToken, TOKEN_ABI);
            return TOKEN_INSTANCE.methods.symbol().call();
          }))
        })
      )
      const ALL_STAKES_SYMBOL = await Promise.all(
        ALL_NETWORK_CHARGERLIST.map((CHARERLIST, network) => {
          return Promise.all(CHARERLIST.map((CHARGER_ADDRESS, i) => {
            const TOKEN_INSTANCE = createContractInstance(ALL_WEB3[network], ALL_RESULTS[network][i].stakeToken, TOKEN_ABI);
            return TOKEN_INSTANCE.methods.symbol().call();
          }))
        })
      );
      const ALL_STAKES_BASEPERCENT = await Promise.all(
        ALL_NETWORK_CHARGERLIST.map((CHARGERLIST, network) => {
          return Promise.all(CHARGERLIST.map(async (CHARGER_ADDRESS, i) => {
            const TOKEN_INSTANCE = createContractInstance(ALL_WEB3[network], ALL_RESULTS[network][i].stakeToken, TOKEN_ABI);
            return TOKEN_INSTANCE.methods.basePercent().call();
          }))
        })
      );

      await ALL_NETWORK_CHARGERLIST.map(async (CHARGERLIST, network) => {
        let net;
        switch (network) {
          case 0:
            net = "ERC"
            break;
          case 1:
            net = "BEP"
            break;
          case 2:
            net = "HRC"
            break;
        }
        await CHARGERLIST.map((CHARGER_ADDRESS, i) => {
          ALL_RESULTS[network][i].address = CHARGER_ADDRESS;
          ALL_RESULTS[network][i].status = loadActiveStatus(ALL_RESULTS[network][i]);
          ALL_RESULTS[network][i].rewardAmount = ALL_REWARDS_AMOUNT[network][i];
          ALL_RESULTS[network][i].basePercent = ALL_STAKES_BASEPERCENT[network][i];
          ALL_RESULTS[network][i].apy = getAPY(
            ALL_RESULTS[network][i].totalSupply,
            ALL_RESULTS[network][i].rewardAmount -
            (ALL_RESULTS[network][i].rewardToken == ALL_RESULTS[network][i].stakeToken
              ? ALL_RESULTS[network][i].totalSupply
              : 0),
            ALL_RESULTS[network][i].DURATION
          );
          ALL_RESULTS[network][i].symbol = [ALL_REWARDS_SYMBOL[network][i], ALL_STAKES_SYMBOL[network][i]];
          ALL_RESULTS[network][i].network = net;
        })
      });

      // 1. pool type에 따라 필터링 진행
      // let test = updatedList.filter((charger) =>
      //   charger.name.includes(params.type)
      // ); //
      let ALL_LIST = [];
      for (let network in ALL_RESULTS) {
        ALL_RESULTS[network].map(charger => {
          if (charger.name === "9.3 Locked Pool 500" ||
            charger.name === "9.15 BSC Zero-Burning Pool 20") {

          } else {
            ALL_LIST.push(charger)
          }
        });
      }

      let tvl = 0;
      ALL_LIST.map(charger => tvl += Number(fromWei(charger.totalSupply, "ether")))
      setTvl(tvl * RCG_PRICE)
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

      if (ALL_LIST.length === 0) {
        setChList(chargerInfo);
        setFullList(chargerInfo)
      } else {
        setChList(ALL_LIST);
        setFullList(ALL_LIST)
      }
    };
    getList();

    return;
  };

  const filterByNetwork = (chargerList) => {
    return chargerList.filter(charger => charger.network === network)
  }
  const filterByType = (chargerList) => {
    return chargerList.filter(charger => charger.name.includes(params.type))
  }

  // Whenever Staking type is changed, reload Pool list
  useEffect(async () => {
    setChList(loading_data);
    try {
      await loadChargerList();
    } catch (err) {
      console.log(err);
    }
  }, [])
  useEffect(async () => {
    try {
      let list
      if (network === "ALL" && params.type === "ALL") {
        setChList(fullList)
      } else if (network !== "ALL" && params.type === "ALL") {
        list = await filterByNetwork(fullList);
      } else if (network === "ALL" && params.type !== "ALL") {
        list = await filterByType(fullList);
      } else {
        list = await filterByNetwork(fullList);
        list = await filterByType(list);
      }
      if (list.length === 0) {
        setChList(chargerInfo)
      } else {
        setChList(list)
      }
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
            return (
              <div
                className={params.isLP === true ? "disable" : ""}
                style={
                  charger.name === "Loading List.."
                    ? { cursor: "not-allowed" }
                    : {}
                }
              >
                <Row
                  key={charger.name}
                  index={index}
                  status={charger.status} // active or not
                  name={charger.name}
                  tvl={charger.totalSupply}
                  apy={charger.apy}
                  info={charger}
                  limit={charger.limit}
                  params={params} // 버튼에 대한 분기처리 때문에 필요
                  toast={toast}
                  period={loadPoolPeriod(charger.startTime, charger.DURATION)}
                  poolNet={charger.network}
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
