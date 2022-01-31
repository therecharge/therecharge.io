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
const TOKEN_ABI = require("../../../../lib/read_contract/abi/erc20.json");
const ERC20_ABI = require("../../../abis/ERC20ABI.json");
const POOL_ABI = require("../../../abis/poolABI.json");
const NEW_CONTRACT_ABI = require("../../../abis/newContract.json");
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
  startTime,
  poolTVL,
}) {
  const [web3] = useRecoilState(web3State);
  const [account] = useRecoilState(accountState);
  const [network] = useRecoilState(networkState);
  const [requireNetwork, setRequireNetwork] =
    useRecoilState(requireNetworkState);
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

        // let EXCEPTIONS
        // EXCEPTIONS[info.address][account]

        let [allowance, available, balance, rewardNow] = await Promise.all([
          STAKE_INSTANCE.methods.allowance(account, info.address).call(),
          STAKE_INSTANCE.methods.balanceOf(account).call(),
          CHARGER_INSTANCE.methods.balanceOf(account).call(),
          CHARGER_INSTANCE.methods.earned(account).call(),
        ]);
        let share = (balance / tvl) * 100;
        // 1. 내가 스테이킹한 수량
        // 2. 내가 스테이킹한 수량의 전체 비중 (1/tvl %)
        // 3. 내가 받을 수량 (2 * 전체 reward) // charger earned(account)

        let reward;
        let reward_SNAPSHOT_FLEX = Number(toWei("111", "ether")); // FIX ME

        if (info.name === "11.2 Flexible Pool") {
          /* GET_REWARD_TOTAL를 위한 신규 인스턴스 생성 후 load */

          const NEW_CONTRACT_INSTANCE = createContractInstance(
            WEB3,
            "0x0fF80e548EbDaC17A6098c30b077D67C3Cf15D17",
            NEW_CONTRACT_ABI
          );

          let GET_REWARD = await NEW_CONTRACT_INSTANCE.methods
            .earned(account)
            .call(); // FIX ME

          console.log("GET_REWARD", GET_REWARD);
          reward = GET_REWARD;
        } else {
          reward = rewardNow;
        }

        ret = {
          ...ret,
          address: info.address,
          available: fromWei(available, "ether"),
          allowance: allowance,
          balance: balance,
          share: share,
          reward: reward.toString(),
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
    const NEW_CONTRACT_INSTANCE = createContractInstance(
      web3,
      "0x0fF80e548EbDaC17A6098c30b077D67C3Cf15D17",
      NEW_CONTRACT_ABI
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
    /* 신규 컨트랙트 배포 후 변경 */
    const earn = (name, poolM, account) => {
      if (info.name === "11.2 Flexible Pool") {
        poolM.getReward(account).send({ from: account });
      } else {
        poolM.getReward().send({ from: account });
      }
    }; // FIX ME
    const exit = (poolM, account, balance) => {
      // 보상 오류로 잠정 exit가 아닌 withdrwal로 변경합니다.
      // poolM.exit().send({ from: account });
      poolM.withdraw(balance).send({ from: account });
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
      earn: async () => {
        if (info.name === "11.2 Flexible Pool") {
          await earn(info.name, NEW_CONTRACT_INSTANCE.methods, account);
        } else {
          await earn(info.name, POOL_INSTANCE.methods, account);
        }
      },
      exit: async (balance) =>
        await exit(POOL_INSTANCE.methods, account, balance), // 보상오류로 잠정 balance 추가됩니다.
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
          src={
            name === "EVO - 1" || name === "EVO - 2" || name === "EVO - 3"
              ? "/ic_locker.svg"
              : `/img_station_${poolNet}.svg`
          }
          style={
            window.innerWidth > 1088
              ? { width: "100px", height: "80px", opacity: "0.55" }
              : { width: "150px", height: "119px", opacity: "0.55" }
          }
        />
        <Status status={status} />
        <Name
          status={status}
          name={
            name === "11.2 Premier Locked Pool 300"
              ? "11.12 Premier Locked Pool 300"
              : name === "11.2 Locked Pool 200"
              ? "11.12 Locked Pool 200"
              : name === "11.2 Flexible Pool"
              ? "11.12 Flexible Pool"
              : name
          }
          index={index}
          isLP={info.isLP}
          isLocked={info.isLocked}
          info={info}
        />
        <Apy status={status} apy={makeNum(apy, 2)} />
        <Btn status={status} isOpen={isOpen} />
      </Title>
      {isOpen && (
        <Menu>
          <div className="part">
            <PoolInfo className="innerMenu">
              <Info
                left="APY"
                right={
                  apy < 0
                    ? "- %"
                    : Number(makeNum(apy, 2)).toLocaleString() + " %"
                }
              />
              <Info
                left="TVL"
                right={`$ ${Number(poolTVL.toFixed(2)).toLocaleString()}`}
              />
              <Info
                left="LIMIT"
                right="UNLIMITED"

                //Fix Me, 리미트가 잘못 설정됨. 미니멈 값이 들어가 있음
                // limit == 0
                //   ? "UNLIMITED"
                //   : Number(weiToEther(limit)).toFixed(2).toLocaleString() +
                //     ` ${info.symbol[1]}`
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
                  status === "Active" /*&& startTime == "1636693200"*/
                    ? "var(--purple)"
                    : "var(--gray-30)"
                }
                border={
                  name.includes("Flexible") || name.includes("11.1 ")
                    ? ""
                    : "locked"
                }
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
                    // toast("This pool is closed");
                    if (
                      userInfo.allowance == "0" &&
                      userInfo.address != "0x00"
                    ) {
                      poolMethods.approve();
                    } else if (
                      userInfo.allowance != "0" &&
                      userInfo.address != "0x00"
                    ) {
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
              {name.includes("Flexible") || name.includes("11.1 ") ? (
                <WalletConnect
                  need="0"
                  disable={true}
                  bgColor={
                    account &&
                    userInfo.reward > 0 /*&& startTime == "1636693200"*/
                      ? "var(--yellow)"
                      : "var(--gray-30)"
                    // !account
                    //   ? "var(--gray-30)"
                    //   : status === "Inactive"
                    //   ? "var(--gray-30)"
                    //   : userInfo.reward > 0
                    //   ? "var(--yellow)"
                    //   : "var(--gray-30)"
                  }
                  border=""
                  hcolor=""
                  radius="20px"
                  w="540px"
                  fontsize={window.innerWidth > 1088 ? "20px" : "30px"}
                  text="GET FILLED"
                  onClick={async () => {
                    // if (
                    //   name === "11.16 Uniswap LP Flexible Pool 777" ||
                    //   name === "11.2 Flexible Pool"
                    // ) {
                    //   return toast("금일 18시까지 잠정 중단 됩니다.");
                    // }
                    if (!account) {
                      toast("Please connect to wallet");
                    } else if (userInfo.reward > 0) {
                      poolMethods.earn();
                      await toast(
                        'Please approve "GET FILLED" in your private wallet'
                      );
                    }
                    // 다음 풀 진행 전까지 강제출금자들을 위해 오픈 합니다.
                    else {
                      toast("There is no withdrawable amount");
                    }
                  }}
                />
              ) : (
                <></>
              )}
              {name.includes("Flexible") ? (
                <WalletConnect
                  need="0"
                  disable={true}
                  bgColor={
                    userInfo.balance > 0 /*&& startTime == "1636693200"*/
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
                    } else if (userInfo.balance > 0) {
                      // 보상 오류로 balance 추가 됩니다 FIX ME
                      poolMethods.exit(userInfo.balance);
                      await toast(
                        'Please approve "UNPLUG" in your private wallet'
                      );
                    }
                    // 다음 풀 진행 전까지 강제출금자들을 위해 오픈 합니다.
                    else {
                      toast("There is no withdrawable amount");
                    }
                  }}
                />
              ) : (
                <WalletConnect
                  need="0"
                  disable={true}
                  bgColor={
                    status === "Closed" && userInfo.balance > 0
                      ? /*&& startTime == "1636693200"*/
                        "var(--ultramarine-blue)"
                      : "var(--gray-30)"
                  }
                  border={
                    name.includes("Flexible") || name.includes("11.1 ")
                      ? ""
                      : "locked"
                  }
                  hcolor=""
                  radius="20px"
                  w="540px"
                  fontsize={window.innerWidth > 1088 ? "20px" : "30px"}
                  text="UNPLUG"
                  onClick={async () => {
                    // Locked인 경우에, period가 종료된 이후에 출금할 수 있음
                    if (!account) {
                      toast("Please connect to wallet");
                    }

                    // FIX ME
                    else if (status === "Close") {
                      if (userInfo.balance > 0) {
                        // 보상 오류로 balance 추가 됩니다 FIX ME
                        poolMethods.exit(userInfo.balance);
                        await toast(
                          'Please approve "UNPLUG" in your private wallet'
                        );
                      } else toast("There is no withdrawable amount");
                    } else {
                      toast("Please try after the pool service period ends");
                    }
                    // else {
                    //   toast(
                    //     "Your balance and reward will be sent to your wallet"
                    //   );
                    // }
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
  function color() {
    switch (name) {
      case "EVO - 1":
        return "#b21a14";
      case "EVO - 2":
        return "#b21a14";
      case "EVO - 3":
        return "#b21a14";
    }
    switch (status) {
      case "Closed":
        return "#b21a14";
      case "Inactive":
        return "#7E7E7E";
      case "Active":
        return "#0eef6d";
      case "Locked":
        return "#b21a14";
    }
  }
  return (
    <p
      className="Roboto_20pt_Black status"
      style={
        window.innerWidth > 1088
          ? {
              marginLeft: "50px",
              color:
                name === "11.12 Pancake LP Locked Pool 300" ||
                name === "11.12 Premier Locked Pool 200" ||
                name === "11.12 Locked Pool 100"
                  ? "#b21a14"
                  : color(status),
              width: "71.5px",
              textAlign: "center",
              zIndex: "1",
            }
          : {
              marginTop: "20px",
              marginLeft: "20px",
              marginRight: "25px",
              backgroundColor:
                name === "11.12 Pancake LP Locked Pool 300" ||
                name === "11.12 Premier Locked Pool 200" ||
                name === "11.12 Locked Pool 100"
                  ? "#b21a14"
                  : color(status),
              width: "15px",
              height: "15px",
              textAlign: "center",
              borderRadius: "100px",
            }
      }
    >
      {window.innerWidth > 1088 ? status : <div />}
    </p>
  );
}
function Name({ status, name, info, isLP, isLocked }) {
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
            isLP
              ? info.network === "ERC"
                ? "/img_rcgusdc.svg"
                : "/img_station_rcgbnb.png"
              : "/swap_rcg.svg"
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
        {window.innerWidth > 1088 ? (
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
        )}

        <div>{name}</div>
      </div>
    </div>
  );
}

function Apy({ status, apy }) {
  function color() {
    if (status != "Active") return "var(--gray-30)";
    if (apy == "+999999.99") return "var(--green)";
    // FIX ME
    if (apy >= 0) return "var(--green)";
    // if (apy >= 50) return "var(--yellow)";
    return "var(--red)";
  }
  return (
    <p
      className={`${
        window.innerWidth > 720 ? "Roboto_25pt_Black" : "Roboto_25pt_Black"
      } apy`}
      style={{ color: color() }}
    >
      {status !== "Inactive"
        ? (apy === "+999999.99"
            ? "+999999.99"
            : apy < 0
            ? "- "
            : Number(Number(apy).toFixed(2)).toLocaleString()) + "%"
        : "-"}
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
