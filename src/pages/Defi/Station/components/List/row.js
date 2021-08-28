import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { fromWei, toWei, toBN } from "web3-utils";
import { ReactComponent as DropdownClose } from "./assets/dropdown-close.svg";
import { ReactComponent as DropdownOpen } from "./assets/dropdown-open.svg";
import WalletConnect from "../../../../../Component/Components/Common/WalletConnect";
import Popup from "./popup";
//store
import { useRecoilState } from "recoil";
import {
  poolInfoState,
  selState,
  periodState,
} from "../../../../../store/pool";
import {
  web3State,
  accountState,
  networkState,
  requireNetworkState,
} from "../../../../../store/web3";
const ERC20_ABI = require("../../../../../Component/Desktop/Defi/abis/ERC20ABI.json");
const POOL_ABI = require("../../../../../Component/Desktop/Defi/abis/poolABI.json");
// Row Component structure
//  1)state
//  2)style
//  3)inner component
//  4)render component with 3)inner component + 2)styles + 1)state
export default function Row({
  status = "Inactive",
  name = "Charger No.000000",
  apy = "10000.00",
  info,
  params,
}) {
  const [web3] = useRecoilState(web3State);
  const [account] = useRecoilState(accountState);
  const [network] = useRecoilState(networkState);
  const [requireNetwork] = useRecoilState(requireNetworkState);
  const [poolInfo, setPoolInfo] = useRecoilState(poolInfoState);
  // const [period, setPeriod] = useRecoilState(periodState);
  const [onLoading, setOnLoading] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [plAmount, setPlAmount] = useState("");
  const [btnInfo, setBtnInfo] = useState("");
  // const [sel, setSelCharger] = useState(0);
  // const [chList, setChList] = useState([
  //   {
  //     address: "0x00",
  //     name: "Now Loading",
  //     apy: "000",
  //   },
  //   {
  //     address: "0x00",
  //     name: "",
  //     apy: "",
  //   },
  // ]);
  // const [selChList, setSelChList] = useState([
  //   {
  //     address: "0x00",
  //     name: "Now Loading",
  //     apy: "000",
  //   },
  //   {
  //     address: "0x00",
  //     name: "",
  //     apy: "",
  //   },
  // ]);
  const [poolMethods, setPoolMethods] = useState({
    isSet: true,
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
    balance: "0",
    reward: "0",
    allowance: "0",
    share: 0,
  });

  const loadMethods = async (
    stakeTokenAddress,
    rewardTokenAddress,
    chargerAddress
  ) => {
    let ret = {};
    const stakeI = new web3.eth.Contract(ERC20_ABI, stakeTokenAddress);
    const stakeM = stakeI.methods;
    const rewardI = new web3.eth.Contract(ERC20_ABI, rewardTokenAddress);
    const rewardM = rewardI.methods;
    const poolI = new web3.eth.Contract(POOL_ABI, chargerAddress);
    const poolM = poolI.methods;

    // const [balance] = await stakeM.balanceOf(account).call();
    let balance = await stakeM.balanceOf(account).call();
    const approve = (tokenM, to, amount, account) => {
      if (typeof amount != "string") amount = String(amount);
      tokenM.approve(to, toWei(amount, "ether")).send({ from: account });
    };
    const stake = (poolM, amount, account) => {
      if (typeof amount != "string") amount = String(amount);
      poolM.stake(toWei(amount, "ether")).send({ from: account });
    };
    const earn = (poolM, account) => {
      poolM.getReward().send({ from: account });
    };
    const exit = (poolM, account) => {
      poolM.exit().send({ from: account });
    };
    // fromWei(balance, "ether")
    ret = {
      available: fromWei(balance, "ether"),
      approve: async () =>
        await approve(stakeM, chargerAddress, "999999999", account),
      stake: async (amount) =>
        userInfo.allowance > 0
          ? await stake(poolM, amount, account)
          : await approve(stakeM, chargerAddress, "999999999", account),
      earn: async () => await earn(poolM, account),
      exit: async () => await exit(poolM, account),
    };

    setPoolMethods(ret);
    return ret;
  };

  const weiToEther = (wei) => {
    return fromWei(wei, "ether");
  };

  const SetPercent = (x) => {
    setPlAmount((poolMethods.available / 100) * x);
  };

  const loadUserInfo = async () => {
    let ret = {
      address: "0x00",
      balance: "0",
      reward: "0",
      allowance: "0",
      share: 0,
    };
    if (account && info) {
      try {
        let { data } = await axios.get(
          `https://bridge.therecharge.io/charger/info/${info.address}/${account}`
        );
        setUserInfo(data.account);
        ret = data.account;
      } catch (err) {
        console.log(err);
      }
    }
    console.log(ret);
    return ret;
  };

  // const updateChargerInfoList = () => {
  //   // loadChargerList();
  //   // loadPoolInfo();
  //   // if (account) {
  //   //   loadUserInfo();
  //   //   loadMethods(poolInfo.token[0], poolInfo.token[1], chList[sel].address);
  //   // }
  // };

  // const useInterval = (callback, delay) => {
  //   const savedCallback = useRef();

  //   // Remember the latest callback.
  //   useEffect(() => {
  //     savedCallback.current = callback;
  //   }, [callback]);

  //   // Set up the interval.
  //   useEffect(() => {
  //     function tick() {
  //       savedCallback.current();
  //     }
  //     if (delay !== null) {
  //       let id = setInterval(tick, delay);
  //       return () => clearInterval(id);
  //     }
  //   }, [delay]);
  // };

  // useInterval(() => updateChargerInfoList(), 5000);

  useEffect(() => {
    if (!account) return;
    loadUserInfo();
  }, [account]);

  // useEffect(() => {
  //   if (!account) return;
  //   if (chList[sel].address === "0x00") return;
  //   loadUserInfo();
  //   loadMethods(poolInfo.token[0], poolInfo.token[1], chList[sel].address);
  // }, [account]);

  // useEffect(async () => {
  //   try {
  //     if (!account && chList[0].name !== "Now Loading") {
  //       await loadPoolInfo();
  //     } else if (account && chList[sel].address !== "0x00") {
  //       let ret = await Promise.all([loadPoolInfo(), loadUserInfo()]);
  //       console.log("test ret :", ret);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [chList]);

  // useEffect(async () => {
  //   setOnLoading(true);
  //   try {
  //     if (!account) {
  //       await loadPoolInfo();
  //     } else if (chList[sel].address !== "0x00") {
  //       await Promise.all([loadPoolInfo(), loadUserInfo()]);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [sel]);

  // useEffect(async () => {
  //   setOnLoading(true);
  //   try {
  //     if (chList[0].name === "Now Loading") await loadChargerList();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, [params]);

  return (
    <Container>
      {isPopupOpen && (
        <Popup
          close={() => {
            setPopupOpen(false);
          }}
        />
      )}
      <Title onClick={() => setOpen(!isOpen)} style={{ cursor: "pointer" }}>
        <Status status={status} />
        <Name status={status} name={name} />
        <Apy status={status} apy={apy} />
        <Btn status={status} isOpen={isOpen} />
      </Title>
      <Menu style={{ display: isOpen ? "flex" : "none" }}>
        <div className="part">
          <PoolInfo className="innerMenu">
            <Info left="APY" right={apy} />
            <Info left="TVL" right={`${info.tvl} ${info.symbol[0]}`} />
            <Info left="LIMIT" right="UNLIMITED" />
          </PoolInfo>
          {account && network == requireNetwork ? (
            <UserInfo className="innerMenu">
              <Info
                className="hide"
                left="MY BAL"
                right={`${makeNum(userInfo.balance)} ${info ? info.symbol[0] : ""
                  }`}
              />
              <Info left="Share" right={`${makeNum(userInfo.share)}%`} />
              <Info
                left="Reward"
                right={`${userInfo.reward} ${info ? info.symbol[1] : ""}`}
              />
            </UserInfo>
          ) : (
            <UserInfo className="innerMenu">
              <WalletConnect
                need="2"
                notConnected="Connect Wallet for data"
                wrongNetwork="Change network for data"
                m="auto"
                w="540px"
              />
            </UserInfo>
          )}
        </div>
        <Pannel className="innerMenu">
          <Info
            direction="column"
            left="Period"
            right={info ? info.timeStamp : ""}
          />
          {params.type === "Flexible" ? (
            <Wallets>
              <WalletConnect
                need="2"
                bgColor={
                  (poolInfo.period[0] > new Date().getTime() / 1000) |
                    (poolInfo.period[0] + poolInfo.period[1] <
                      new Date().getTime() / 1000)
                    ? "var(--gray-30)"
                    : !poolInfo.limit || poolInfo.limit > poolInfo.tvl
                      ? "var(--purple)"
                      : "var(--gray-30)"
                }
                border=""
                radius="20px"
                w="540px"
                fontsize="30px"
                notConnected="Connect Wallet for PLUG-IN"
                wrongNetwork="Change network for PLUG-IN"
                text={userInfo.allowance !== "0" ? "PLUG-IN" : "APPROVE"} //어프로브 안되어 있으면 APPROVE로 대체 필요함.
                onClick={async () => {
                  //if out of period => inactive
                  if (
                    poolInfo.period[0] > new Date().getTime() / 1000 ||
                    poolInfo.period[0] + poolInfo.period[1] <
                    new Date().getTime() / 1000
                  ) {
                    alert("This pool is inactive");
                    // toast("This pool is inactive");
                  }
                  // else if (!account) {
                  //   alert("Please connect to wallet")
                  //   // toast("Please connect to wallet");
                  // }
                  //if in period => active || close
                  else {
                    // if active
                    if (!poolInfo.limit || poolInfo.limit > poolInfo.tvl) {
                      if (userInfo.allowance == "0") {
                        await poolMethods.approve();
                      } else {
                        // if (plAmount) {
                        setPopupOpen(!isPopupOpen);
                        setBtnInfo("Deposit");
                        // await poolMethods.stake(plAmount);
                        // await toast(
                        //   userInfo.allowance > 0
                        //     ? 'Please approve "PLUG-IN" in your private wallet'
                        //     : 'Please approve "Transfer Limit" in your private wallet'
                        // );
                        // } else alert("Please enter the amount of Staking")
                        // toast("Please enter the amount of Staking");
                      }
                    }
                    //if close
                    else {
                      alert("This pool is closed");
                      // toast("This pool is closed");
                    }
                  }
                }}
              />
              <WalletConnect
                need="0"
                disable={true}
                bgColor={
                  poolInfo.period[0] > new Date().getTime() / 1000 ||
                    poolInfo.period[0] + poolInfo.period[1] <
                    new Date().getTime() / 1000
                    ? "var(--gray-30)"
                    : "var(--yellow)"
                }
                border=""
                radius="20px"
                w="540px"
                fontsize="30px"
                text="GET FILLED"
                onClick={async () => {
                  //if out of period => inactive
                  if (
                    poolInfo.period[0] > new Date().getTime() / 1000 ||
                    poolInfo.period[0] + poolInfo.period[1] <
                    new Date().getTime() / 1000
                  ) {
                    alert("This pool is inactive");
                    // toast("This pool is inactive");
                  } else if (!account) {
                    alert("Please connect to wallet");
                    // toast("Please connect to wallet");
                  }
                  //if in period => active || close
                  else {
                    setPopupOpen(!isPopupOpen);
                    setBtnInfo("Get Reward");
                    // await poolMethods.earn();
                    // await toast(
                    //   'Please approve "GET FILLED" in your private wallet'
                    // );
                  }
                }}
              />
              <WalletConnect
                need="0"
                disable={true}
                bgColor={
                  userInfo.balance > 0
                    ? "var(--ultramarine-blue)"
                    : "var(--gray-30)"
                }
                border=""
                radius="20px"
                w="540px"
                fontsize="30px"
                text="UNPLUG"
                onClick={async () => {
                  if (!account) {
                    alert("Please connect to wallet");
                    // toast("Please connect to wallet");
                  }
                  //if user Balance > 0
                  else if (userInfo.balance > 0) {
                    setPopupOpen(!isPopupOpen);
                    setBtnInfo("Withdrawal");
                    // await poolMethods.exit();
                    // await toast(
                    //   'Please approve "UNPLUG" in your private wallet'
                    // );
                  }
                  //if user Balance <= 0
                  else {
                    alert("There is no withdrawable amount");
                    // toast("There is no withdrawable amount");
                  }
                }}
              />
            </Wallets>
          ) : (
            <Wallets>
              <WalletConnect
                need="2"
                bgColor={
                  (poolInfo.period[0] > new Date().getTime() / 1000) |
                    (poolInfo.period[0] + poolInfo.period[1] <
                      new Date().getTime() / 1000)
                    ? "var(--gray-30)"
                    : !poolInfo.limit || poolInfo.limit > poolInfo.tvl
                      ? "var(--purple)"
                      : "var(--gray-30)"
                }
                border=""
                radius="20px"
                w="540px"
                fontsize="30px"
                notConnected="Connect Wallet for PLUG-IN"
                wrongNetwork="Change network for PLUG-IN"
                text={userInfo.allowance !== "0" ? "PLUG-IN" : "APPROVE"} //어프로브 안되어 있으면 APPROVE로 대체 필요함.
                onClick={async () => {
                  //if out of period => inactive
                  if (
                    poolInfo.period[0] > new Date().getTime() / 1000 ||
                    poolInfo.period[0] + poolInfo.period[1] <
                    new Date().getTime() / 1000
                  ) {
                    alert("This pool is inactive");
                    // toast("This pool is inactive");
                  }
                  // else if (!account) {
                  //   alert("Please connect to wallet")
                  //   // toast("Please connect to wallet");
                  // }
                  //if in period => active || close
                  else {
                    // if active
                    if (!poolInfo.limit || poolInfo.limit > poolInfo.tvl) {
                      if (userInfo.allowance == "0") {
                        await poolMethods.approve();
                      } else {
                        // if (plAmount) {
                        setPopupOpen(!isPopupOpen);
                        setBtnInfo("Deposit");
                        // await poolMethods.stake(plAmount);
                        // await toast(
                        //   userInfo.allowance > 0
                        //     ? 'Please approve "PLUG-IN" in your private wallet'
                        //     : 'Please approve "Transfer Limit" in your private wallet'
                        // );
                        // } else alert("Please enter the amount of Staking")
                        // toast("Please enter the amount of Staking");
                      }
                    }
                    //if close
                    else {
                      alert("This pool is closed");
                      // toast("This pool is closed");
                    }
                  }
                }}
              />
              <WalletConnect
                need="0"
                disable={true}
                bgColor={
                  userInfo.balance > 0
                    ? "var(--ultramarine-blue)"
                    : "var(--gray-30)"
                }
                border=""
                radius="20px"
                w="540px"
                fontsize="30px"
                text="UNPLUG"
                onClick={async () => {
                  if (!account) {
                    alert("Please connect to wallet");
                    // toast("Please connect to wallet");
                  }
                  //if user Balance > 0
                  else if (userInfo.balance > 0) {
                    setPopupOpen(!isPopupOpen);
                    setBtnInfo("Withdrawal");
                    // await poolMethods.exit();
                    // await toast(
                    //   'Please approve "UNPLUG" in your private wallet'
                    // );
                  }
                  //if user Balance <= 0
                  else {
                    alert("There is no withdrawable amount");
                    // toast("There is no withdrawable amount");
                  }
                }}
              />
            </Wallets>
          )}
        </Pannel>
      </Menu>
    </Container>
  );
}

function Status({ status }) {
  function color() {
    switch (status) {
      case "Close":
        return "#D62828";
      case "Inactive":
        return "#7E7E7E";
      case "Active":
        return "#0EEF6D";
    }
  }
  return (
    <p
      className="Roboto_20pt_Black status"
      style={{ color: color(status), width: "71.5px", textAlign: "center" }}
    >
      {status}
    </p>
  );
}
function Name({ status, name }) {
  function color() {
    if (status != "Active") return "var(--gray-30)";
  }
  return (
    <p className="Roboto_30pt_Black name" style={{ color: color() }}>
      {name}
    </p>
  );
}

function Apy({ status, apy }) {
  function color() {
    if (status != "Active") return "var(--gray-30)";
    if (apy == "999+") return "var(--green)";
    if (apy >= 100) return "var(--green)";
    if (apy >= 50) return "var(--red)";
    return "var(--yellow)";
  }
  return (
    <p className="Roboto_30pt_Black apy" style={{ color: color() }}>
      {status != "Inactive" ? (apy == "999+" ? "999+" : apy + "%") : "-"}
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

function Info({ left, right, direction = "" }) {
  const Container = styled.div`
    display: flex;
    color: white;
    flex-direction: ${direction};
    margin-bottom: ${direction ? "64px" : ""};
    .left {
      margin: auto auto;
      margin-left: ${direction ? "" : 0};
      margin-bottom: ${direction ? "16px" : ""};

      @media (min-width: 1088px) {
        margin-left: 0px;
        margin-bottom: 0px;
      }
    }
    .right {
      margin: auto auto;
      margin-right: ${direction ? "" : 0};

      @media (min-width: 1088px) {
        margin-right: 0px;
      }
    }

    @media (min-width: 1088px) {
      display: flex;
      flex-direction: row;
    }
  `;
  return (
    <Container>
      <div className="left Roboto_30pt_Light">{left}</div>
      <div className="right Roboto_30pt_Black">{right}</div>
    </Container>
  );
}

function makeNum(str, decimal = 4) {
  let newStr = str;
  if (typeof newStr === "number") newStr = str.toString();
  let arr = newStr.split(".");
  if (arr.length == 1 || arr[0].length > 8) return arr[0];
  else {
    return arr[0] + "." + arr[1].substr(0, decimal);
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1088px;
  min-height: 120px;
  background-color: #1c1e35;
  margin-bottom: 20px;
  border-radius: 10px;
  .status {
    margin: auto auto;
    margin-left: 20px;
    margin-right: 0px;
  }
  .name {
    margin: auto auto;
    margin-left: 8px;
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
  height: 120px;
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
  gap: 8px;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 8px;

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
