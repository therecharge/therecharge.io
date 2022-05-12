import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { fromWei, toWei } from "web3-utils";
import { ReactComponent as DropdownClose } from "./assets/dropdown-close.svg";
import { ReactComponent as DropdownOpen } from "./assets/dropdown-open.svg";
import WalletConnect from "../../../../Components/Common/WalletConnect";
import Popup from "./popup";
import Info from "./infoRow";
import { createContractInstance } from "../../../../lib/read_contract/Station";
//store
import { useRecoilState } from "recoil";
import {
  web3State,
  accountState,
  networkState,
  requireNetworkState,
} from "../../../../store/web3";
import { web3ReaderState } from "../../../../store/read-web3";
import {getAllContracts} from "../../../../api/contract";
import moment from "moment";
const TOKEN_ABI = require("../../../../lib/read_contract/abi/erc20.json");
const ERC20_ABI = require("../../../abis/ERC20ABI.json");
const POOL_ABI = require("../../../abis/poolABI.json");
const CHARGER_ABI = require("../../../../lib/read_contract/abi/charger.json");
const NETWORKS = require("../../../../lib/networks.json");
const NETWORK = NETWORKS["mainnet"];
// Row Component structure
//  1)state
//  2)style
//  3)inner component
//  4)render component with 3)inner component + 2)styles + 1)state
function Row({
  status = "Inactive",
  name = "Charger No.000000",
  apy = "- %",
  info, // charger
  params, // params
  toast, // toast
  tvl, // charger.totalSupply
  limit, // charger.limit
  period, // loadPoolPeriod(-)
  poolNet,
  index,
  poolTVL,
    contractInfo
}) {


  const [web3] = useRecoilState(web3State);
  const [account] = useRecoilState(accountState);
  const [network] = useRecoilState(networkState);
  const [requireNetwork, setRequireNetwork] = useRecoilState(
    requireNetworkState
  );
  const [web3_R] = useRecoilState(web3ReaderState);
  const WEB3 = web3_R[poolNet];
  const [isOpen, setOpen] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [poolMethods, setPoolMethods] = useState({
    available: 0,
    approve: () => {
      return;
    },
    stake: () => {
      return;
    },
    earn: () => {
      return;
    },
    exit: () => {
      return;
    },
  });
  const [userInfo, setUserInfo] = useState({
    address: "0x00",
    available: "0",
    balance: "-",
    reward: "-",
    allowance: "0",
    share: "-",
    tvl: "-",
    apy: "-",
  });

  const loadUserInfo = async () => {
    let ret = {
      address: "0x00",
      available: "0",
      balance: "-",
      reward: "-",
      allowance: "0",
      share: "-",
      tvl: "-",
      apy: "-",
    };
    if (account && info) {
      try {
        const STAKE_INSTANCE = createContractInstance(
          WEB3,
          info.stakeToken,
          ERC20_ABI
        );
        const CHARGER_INSTANCE = createContractInstance(
          WEB3,
          info.address,
          CHARGER_ABI
        );
        // chargerInstance

        let [allowance, available, balance, reward] = await Promise.all([
          STAKE_INSTANCE.methods.allowance(account, info.address).call(),
          STAKE_INSTANCE.methods.balanceOf(account).call(),
          CHARGER_INSTANCE.methods.balanceOf(account).call(),
          CHARGER_INSTANCE.methods.earned(account).call(),
        ]);
        let share = (balance / tvl) * 100;
        // 1. 내가 스테이킹한 수량
        // 2. 내가 스테이킹한 수량의 전체 비중 (1/tvl %)
        // 3. 내가 받을 수량 (2 * 전체 reward) // charger earned(account)

        ret = {
          ...ret,
          address: info.address,
          available: fromWei(available, "ether"),
          allowance: allowance,
          balance: balance,
          share: share,
          reward: reward,
        };
      } catch (err) {
        console.log(err);
      }
    }
    setUserInfo(ret);
    return ret;
  };
  const loadMethods = async (
    stakeTokenAddress,
    rewardTokenAddress,
    chargerAddress
  ) => {
    let ret = {};
    const STAKE_INSTANCE = createContractInstance(
      web3,
      stakeTokenAddress,
      ERC20_ABI
    );
    const POOL_INSTANCE = createContractInstance(
      web3,
      chargerAddress,
      POOL_ABI
    );
    // const REWARD_INSTANCE = createContractInstance(web3, rewardTokenAddress, ERC20_ABI);

    // const [balance] = await stakeM.balanceOf(account).call();
    // let balance = await STAKE_INSTANCE.methods.balanceOf(account).call();

    const approve = (tokenM, to, amount, account) => {
      if (typeof amount != "string") amount = String(amount);
      return tokenM.approve(to, toWei(amount, "ether")).send({ from: account });
    };
    const stake = async (poolM, amount, account) => {
      if (typeof amount !== "string") amount = String(amount);
      await poolM.stake(toWei(amount, "ether")).send({ from: account });
    };
    const earn = (poolM, account) => {
      poolM.getReward().send({ from: account });
    };
    const exit = (poolM, account) => {
      poolM.exit().send({ from: account });
    };

    ret = {
      // available: fromWei(balance, "ether"),
      approve: async () =>
        await approve(
          STAKE_INSTANCE.methods,
          chargerAddress,
          "999999999",
          account
        ),
      stake: async (amount) =>
        await stake(POOL_INSTANCE.methods, amount, account),
      earn: async () => await earn(POOL_INSTANCE.methods, account),
      exit: async () => await exit(POOL_INSTANCE.methods, account),
    };

    setPoolMethods({
      ...poolMethods,
      ...ret,
    });
    return ret;
  };

  const updateChargerInfoList = async () => {
    if (info.address === "0x0") return;
    if (account && isOpen) {
      loadUserInfo();
      loadMethods(info.stakeToken, info.rewardToken, info.address);
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

  useInterval(updateChargerInfoList, 10000);

  // useEffect(() => {
  //   if (!account) return;
  //   if (isOpen) loadUserInfo();
  // }, [account, isOpen]);

  useEffect(() => {
    if (!account) return;
    if (isOpen && account) {
      loadMethods(info.stakeToken, info.rewardToken, info.address);
      loadUserInfo();
    }
  }, [account, isOpen]);


  return (
    <Container>
      {isPopupOpen && (
        <Popup
          close={() => {
            setPopupOpen(false);
          }}
          name={name}
          apy={apy}
          info={info}
          poolMethods={poolMethods}
          toast={toast}
          userInfo={userInfo}
        />
      )}
      <Title
        onClick={
          info.name == "Loading List.." ||
          info.name == "There is currently no Charger List available."
            ? () => {}
            : () => {
                setOpen(!isOpen);
                setRequireNetwork(NETWORK.network[poolNet].chainId);
              }
        }
        style={
          info.name === "Loading List.." ||
          info.name == "There is currently no Charger List available."
            ? { cursor: "not-allowed" }
            : { cursor: "pointer" }
        }
        style={
          window.innerWidth > 1088
            ? { width: "100%", height: "80px" }
            : { height: "119px" }
        }
      >
        <img
          className="chargerImage"
          src="/ic_locker.svg"
          style={
            window.innerWidth > 1088
              ? { width: "46.2px", height: "60px", margin: "7px 0 0 20px" }
              : { width: "46.2px", height: "60px", margin: "25px 0 0 20px" }
          }
        />
        <Status status={status} />
        <Name
          status={status}
          name={
            name === "EVO - 1"
              ? "Private Locker 1"
              : name === "EVO - 2"
              ? "Private Locker 2"
              : name === "EVO - 3"
              ? "Private Locker 3"
              : ""
          }
          index={index}
          isLP={info.isLP}
          isLocked={info.isLocked}
          contractInfo={contractInfo}
          info={info}
        />
        <Apy status={status} apy="11.12.21 ~ 05.12.10" name={name} contractInfo={contractInfo} info={info} />
        <Btn status={status} isOpen={isOpen} />
      </Title>
      {isOpen && (
        <Menu>
          <div className="part">
            <PoolInfo className="innerMenu">
              <Info
                left="APY"
                right={Number(makeNum(apy, 2)).toLocaleString() + " %"}
              />
              <Info
                left="TVL"
                right={`$ ${Number(poolTVL.toFixed(2)).toLocaleString()}`}
              />
              <Info
                left="LIMIT"
                right={
                  limit == 0
                    ? "UNLIMITED"
                    : Number(weiToEther(limit)).toFixed(2).toLocaleString() +
                      ` ${info.symbol[1]}`
                }
              />
            </PoolInfo>
            {account &&
            (typeof network === "string" ? parseInt(network, 16) : network) ==
              requireNetwork ? (
              <UserInfo account={account} className="innerMenu">
                <Info
                  className="hide"
                  left="MY BAL"
                  right={`${makeNum(weiToEther(userInfo.balance))} ${
                    info ? info.symbol[1] : ""
                  }`}
                />
                <Info left="Share" right={`${makeNum(userInfo.share)} %`} />
                <Info
                  left="Reward"
                  right={`${makeNum(weiToEther(userInfo.reward))} ${
                    info ? info.symbol[0] : ""
                  }`}
                />
              </UserInfo>
            ) : (
              <UserInfo
                className="innerMenu"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WalletConnect
                  need="2"
                  notConnected="Wallet Connect"
                  wrongNetwork="Change network for data"
                  // m="auto"
                  w="540px"
                  h="60px"
                  toast={toast}
                />
                {network &&
                  requireNetwork !=
                    (typeof network === "string"
                      ? parseInt(network, 16)
                      : network) && (
                    <div className="warning">Wrong, Network!</div>
                  )}
              </UserInfo>
            )}
          </div>
          <Pannel className="innerMenu">
            <Info direction="column" left="Period" right={period + "(UTC+9)"} />

            <Wallets>
              <WalletConnect
                need={userInfo.address == "0x00" ? "2" : "2"}
                // disable={userInfo.address == "0x00" ? false : false}
                bgColor={
                  status === "Active" ? "var(--purple)" : "var(--gray-30)"
                  // status === "Active" ? "var(--gray-30)" : "var(--gray-30)" // FIXME
                }
                border="locked"
                hcolor=""
                radius="20px"
                w="540px"
                fontsize={window.innerWidth > 1088 ? "20px" : "30px"}
                notConnected="Wallet Connect"
                wrongNetwork="Change network for PLUG-IN"
                text={
                  userInfo.allowance !== "0"
                    ? "PLUG-IN"
                    : userInfo.address == "0x00"
                    ? "Now Loading ..."
                    : "APPROVE"
                } //어프로브 안되어 있으면 APPROVE로 대체 필요함.
                onClick={() => {
                  if (status === "Inactive") {
                    toast("This pool is inactive");
                  } else if (status === "Active") {
                    if (
                      userInfo.allowance == "0" &&
                      userInfo.address != "0x00"
                    ) {
                      poolMethods.approve();
                    } else if (
                      userInfo.allowance != "0" &&
                      userInfo.address != "0x00"
                    ) {
                      // toast("PLUG-IN Not allowed"); // FIX ME
                      setPopupOpen(!isPopupOpen);
                    } else {
                      toast("Please wait for seconds");
                    }
                  } else {
                    toast("This pool is closed");
                  }
                }}
              />
              {/* 강제 출금 이용자들을 위해 한시적으로 적용합니다. */}
              {/* {name.includes("Flexible") ? ( */}

              {/* ) : (
                <></>
              )} */}
              {name.includes("Flexible") ? (
                <WalletConnect
                  need="0"
                  disable={true}
                  bgColor={
                    userInfo.balance > 0
                      ? "var(--ultramarine-blue)"
                      : "var(--gray-30)"
                  }
                  border=""
                  hcolor=""
                  radius="20px"
                  w="540px"
                  fontsize={window.innerWidth > 1088 ? "20px" : "30px"}
                  text="UNPLUG"
                  onClick={async () => {
                    if (!account) {
                      toast("Please connect to wallet");
                    } /* if (userInfo.balance > 0) 다음 풀 진행 전까지 강제출금자들을 위해 오픈 합니다.*/ else {
                      poolMethods.exit();
                      await toast(
                        'Please approve "UNPLUG" in your private wallet'
                      );
                    }
                    // 다음 풀 진행 전까지 강제출금자들을 위해 오픈 합니다.
                    // else {
                    //   toast("There is no withdrawable amount");
                    // }
                  }}
                />
              ) : (
                <WalletConnect
                  need="0"
                  disable={true}
                  bgColor={
                    status === "Close" && userInfo.balance > 0
                      ? "var(--ultramarine-blue)"
                      : "var(--gray-30)"
                  }
                  border="locked"
                  hcolor=""
                  radius="20px"
                  w="540px"
                  fontsize={window.innerWidth > 1088 ? "20px" : "30px"}
                  text="UNPLUG"
                  onClick={async () => {
                    // Locked인 경우에, period가 종료된 이후에 출금할 수 있음
                    if (!account) {
                      toast("Please connect to wallet");
                    } else if (status === "Close") {
                      // 다음 풀 진행 전까지 강제출금자들을 위해 오픈 합니다.
                      // if (userInfo.balance > 0) {
                      poolMethods.exit();
                      await toast(
                        'Please approve "UNPLUG" in your private wallet'
                      );
                      // } else toast("There is no withdrawable amount");
                    } else {
                      toast("Please try after the pool service period ends");
                    }
                  }}
                />
              )}
            </Wallets>
          </Pannel>
        </Menu>
      )}
    </Container>
  );
}

function Status({ name, status }) {
  return (
    <p
      className="Roboto_20pt_Black status"
      style={
        window.innerWidth > 1088
          ? {
              marginLeft: "50px",
              color: "#b21a14",
              width: "71.5px",
              textAlign: "center",
              zIndex: "1",
            }
          : {
              marginTop: "20px",
              marginLeft: "20px",
              marginRight: "25px",
              // backgroundColor: color(status),
              width: "15px",
              height: "15px",
              textAlign: "center",
              borderRadius: "100px",
            }
      }
    >
      {window.innerWidth > 1088 ? "Locked" : <div />}
    </p>
  );
}
function Name ({ status, name, index, isLP, isLocked, contractInfo, info }) {
  let lockerName = '';


  // console.log(contractInfo, 'Name', contractInfo.privateLocker.BSC.length, contractInfo)
  if(contractInfo && contractInfo.privateLocker.BSC.length) {
    const filteredName = contractInfo.privateLocker.BSC.filter((locker) => {
      return locker.address === info.address;
    })

    lockerName = filteredName.length ? filteredName[0].name : ''
  }


  function color() {
    if (status != "Active") return "var(--gray-30)";
  }
  const nameDiv = document.querySelectorAll(".tracingHeight");

  return (
    <div
      className="Roboto_25pt_Medium name"
      style={
        window.innerWidth > 1088
          ? {
              marginLeft: "47px",
              color: color(),
              zIndex: "1",
            }
          : {
              marginLeft: "5px",
              // marginRight: "2px",
              color: color(),
              zIndex: "1",
            }
      }
    >
      <div>
        <img
          src={
            name.includes("LP") ? "/img_station_rcgbnb.png" : "/swap_rcg.svg"
          }
          style={
            window.innerWidth > 1088
              ? name.includes("LP")
                ? { width: "70px", height: "40px" }
                : { width: "40px", height: "40px" }
              : name.includes("LP")
              ? { width: "88px", height: "50px" }
              : { width: "50px", height: "50px" }
          }
        />
      </div>
      {/* <div>{name}</div> */}
      <div className="tracingHeight">
        {/* {window.innerWidth > 1088 ? (
          <p />
        ) : (
          <div className="class Roboto_18pt_Regular_L">
            {isLP
              ? isLocked
                ? "LP Locked"
                : "LP Flexible"
              : isLocked
              ? "Locked"
              : "Flexible"}
          </div>
        )} */}

        <div>{lockerName}</div>
      </div>
    </div>
  );
}

function Apy({ status, apy, name, contractInfo,info }) {
  function color() {
    if (status != "Active") return "var(--gray-30)";
    if (apy == "+999999.99") return "var(--green)";
    if (apy >= 100) return "var(--green)";
    if (apy >= 50) return "var(--red)";
    return "var(--yellow)";
  }
  let filteredContractInfo;
  if(contractInfo && name !== 'Loading List..') {
     filteredContractInfo = contractInfo.privateLocker.BSC.filter((locker) => {
      return locker.address === info.address;
    })
    console.log(contractInfo, name, filteredContractInfo[0].start, moment(filteredContractInfo[0].start).format('YY.MM.DD'), moment(filteredContractInfo[0].finish).format('YY.MM.DD'))
    // console.log(filteredContractInfo[0], 'contractInfo',)
    // console.log(filteredContractInfo[0].start)

  }



  return (
    <p
      className="apy"
      style={{
        fontFamily: "Roboto",
        fontSize: "18px",
        fontWeight: "normal",
        fontStretch: "normal",
        fontStyle: "normal",
        lineHeight: "1.33",
        letterSpacing: "normal",
        textAlign: "left",
        color: "#fff",
      }}
    >
      {/* {status !== "Inactive"
        ? (apy === "+999999.99"
            ? "+999999.99"
            : Number(Number(apy).toFixed(2)).toLocaleString()) + "%"
        : "-"} */}
      {filteredContractInfo ?  `${moment(filteredContractInfo[0].start).format('YY.MM.DD')} ~  ${moment(filteredContractInfo[0].finish).format('YY.MM.DD')}`  : '21.11.12 ~ 22.05.12'}
    </p>
  );
}

function Btn({ status, isOpen }) {
  if (isOpen) return <DropdownOpen className="btn" />;
  else
    return (
      <DropdownClose
        className="btn"
        fill={status == "Inactive" ? "#7E7E7E" : "#fff"}
      />
    );
}

function makeNum(str = "0", decimal = 4) {
  let newStr = str;
  if (typeof newStr === "number") newStr = str.toString();
  let arr = newStr.split(".");
  if (arr.length == 1 || arr[0].length > 8) return arr[0];
  else {
    return arr[0] + "." + arr[1].substr(0, decimal);
  }
}
const weiToEther = (wei) => {
  return fromWei(wei, "ether");
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1088px;
  min-height: 80px;
  background-color: #1c1e35;

  margin-bottom: 20px;
  border-radius: 10px;
  .status {
    margin: auto auto;
    // margin-left: 67px;
    margin-right: 0px;
  }
  .name {
    display: flex;
    margin: auto auto;
    align-items: center;
    // margin-left: 47px;
    img {
      width: 40px;
      height: 40px;
      vertical-align: bottom;
      margin-right: 20px;
    }
  }
  .apy {
    margin: auto auto;
    margin-right: 20px;
  }
  .btn {
    margin: auto auto;
    margin-right: 40px;
    margin-left: 0px;
  }
  .disable {
    background-color: #484848;
    span {
      color: #7e7e7e;
    }
    border: ;
  }
`;
const Title = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  position: relative;

  .chargerImage {
    position: absolute;
    width: 100px;
    height: 80px;
  }

  &:hover {
    border-radius: 10px;
    background-color: var(--black-20);
  }
`;
const Menu = styled.div`
  // margin-top: -20px;
  display: flex;
  // display: none;
  width: 100%;
  flex-direction: column;
  .innerMenu {
    width: 100%;
    background-color: #262840;
    display: flex;
    flex-basis: auto;
    flex-direction: column;
    padding: 40px 60px 40px 60px;
  }
  .part {
    display: flex;
    flex-direction: column;

    @media (min-width: 1088px) {
      display: flex;
      flex-direction: row;
    }
  }
`;

const PoolInfo = styled.div`
  gap: 8px;

  @media (min-width: 1088px) {
    width: 540px;
  }
`;
const UserInfo = styled.div`
  display: flex;
  position: ${(props) => (props.account ? "inherit" : "relative")};
  gap: 8px;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 8px;
  .warning {
    position: absolute;
    top: 50%;
    transform: translate(0%, 50px);
    color: red;
  }

  @media (min-width: 1088px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 540px;
    margin-top: 0px;
    margin-left: 8px;
  }
`;
const Wallets = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  gap: 20px;
  @media (min-width: 1088px) {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
`;
const Pannel = styled.div`
  margin-top: 8px;
  gap: 16px;
  border-radius: 0 0 10px 10px;
`;

export default Row;
