import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ReactComponent as PopupClose } from "./assets/popup-close.svg";
import { ReactComponent as PopupArrow } from "./assets/swap_popup_arrow.svg";
import WalletConnect from "../../../../Component/Components/Common/WalletConnect";
import { fromWei, toWei } from "web3-utils";
//store
import { useRecoilState } from "recoil";
import {
  web3State,
  accountState,
} from "../../../../store/web3";

const ERC20_ABI = require("../../../../Component/Desktop/Defi/abis/ERC20ABI.json");

// 경고 경고!! Caution에서 2%로 되어 있는 수수료도 상태처리 대상입니다.
export default function Popup({ close = () => { }, recipe, setRecipe, toast }) {
  const [web3, setWeb3] = useRecoilState(web3State);
  const [account, setAccount] = useRecoilState(accountState);
  const [poolMethods, setPoolMethods] = useState({
    redemption: 2,
    available: 0,
    allowance: 0,
    approve: () => {
      return;
    },
    swap: () => {
      return;
    },
  });

  const SetPercent = (x) => {
    setRecipe({
      ...recipe,
      swapAmount: makeNum((poolMethods.available / 100) * Number(x)),
    });
  };

  const loadMethods = async (
    swapTokenAddress,
    bridgeAddress = "0xaBC71F46FA0D80bCC7D36D662Edbe9930271B414"
  ) => {
    if (!account) return;
    try {
      let ret = {};
      const swapI = new web3.eth.Contract(ERC20_ABI, swapTokenAddress);
      const swapM = swapI.methods;

      let [balance, allowed] = await Promise.all([
        await swapM.balanceOf(account).call(),
        await swapM.allowance(account, bridgeAddress).call()
      ]);
      // let balance = await swapM.balanceOf(account).call();
      // let allowed = await swapM.allowance(account, bridgeAddress).call();

      allowed = Number(allowed);

      const approve = (tokenM, to, amount, account) => {
        if (typeof amount != "string") amount = String(amount);
        tokenM.approve(to, toWei(amount, "ether")).send({ from: account });
      };
      const swap = async (swapAmount) => {
        try {
          await swapM
            .transfer(bridgeAddress, toWei(swapAmount, "ether"))
            .send({ from: account });
        } catch (err) {
          console.log(err);
        }
      };

      ret = {
        available: fromWei(balance, "ether"),
        allowance: allowed,
        approve: async () =>
          await approve(swapM, bridgeAddress, "999999999", account),
        swap: async (swapAmount) => {
          // methods.allowance !== 0
          await swap(swapAmount);
          // : await approve(swapM, bridgeAddress, "999999999", account);
        },
      };

      setPoolMethods({
        ...poolMethods,
        ...ret,
      });
      console.log(ret)
    } catch (err) {
      console.log(err);
      setPoolMethods({
        ...poolMethods,
        available: 0,
        allowance: 0,
      });
    }
  };

  let FromImg = recipe.from.image;
  let ToImg = recipe.to.image;

  useEffect(() => {
    if (recipe.to.network === "(Binance Smart Chain Network)") {
      loadMethods(
        recipe.tokenAddress[recipe.chainId[recipe.from.network]],
        "0x05A21AECa80634097e4acE7D4E589bdA0EE30b25"
      );
    } else {
      loadMethods(recipe.tokenAddress[recipe.chainId[recipe.from.network]]);
    }
  }, [account, recipe.to.network]);

  return (
    <Container>
      <Content>
        <PopupClose
          onClick={() => {
            close();
            setRecipe({
              ...recipe,
              swapAmount: ""
            })
          }}
          className="popup-close"
          style={{ position: "absolute", right: "0" }}
        />
        <div className="group1">
          <span className="Roboto_40pt_Black popup-title">SWAP</span>
          <div className="popup-image">
            <FromImg style={{ height: "80px", width: "80px" }} />
            <PopupArrow style={{ height: "16px", width: "30px" }} />
            <ToImg style={{ height: "80px", width: "80px" }} />
          </div>
          <label>
            Available:
            {` ${makeNum(
              (poolMethods.available - Number(recipe.swapAmount)).toString()
            )} ${recipe.from.token}`}
          </label>
          <input
            className="popup-input"
            type="number"
            placeholder="Enter the amount of swap"
            value={recipe.swapAmount}
            onChange={(e) => {
              if (Number(e.target.value) < 0) {
                return setRecipe({
                  ...recipe,
                  swapAmount: "0",
                });
              }
              if (poolMethods.available - Number(e.target.value) >= 0) {
                return setRecipe({
                  ...recipe,
                  swapAmount: makeNum(e.target.value),
                });
              }
              setRecipe({
                ...recipe,
                swapAmount: makeNum(poolMethods.available),
              });
            }}
          />
        </div>
        <QuickSelect>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              SetPercent(25);
            }}
          >
            <span className="Roboto_20pt_Regular">25%</span>
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              SetPercent(50);
            }}
          >
            <span className="Roboto_20pt_Regular">50%</span>
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              SetPercent(75);
            }}
          >
            <span className="Roboto_20pt_Regular">75%</span>
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              SetPercent(100);
            }}
          >
            <span className="Roboto_20pt_Regular">MAX</span>
          </div>
        </QuickSelect>
        <span className="Roboto_20pt_Regular popup-caution">
          {`Conversion Fee: ${recipe.conversionFee[recipe.chainId[recipe.to.network]]} ${recipe.from.token}`}
        </span>
        <div className="wallet">
          <WalletConnect
            need="2"
            bgColor="#9314B2"
            hcolor=""
            border="3px solid #9314B2"
            w="540px"
            radius="20px"
            text="SWAP" //어프로브 안되어 있으면 APPROVE로 대체 필요함.
            onClick={async () => {
              if (recipe.swapAmount > 0) {
                await close();
                await toast('Please approve "SWAP" in your private wallet');
                await poolMethods.swap(recipe.swapAmount)
              } else {
                toast("Please enter the amount of Swap");
              }
            }}
          />
        </div>
        <InfoContainer>
          <Info left="Current Redemption Rate" right={`${poolMethods.redemption}%`} />
          <Info left="Current Conversion Fee" right={`${recipe.conversionFee[recipe.chainId[recipe.to.network]]} ${recipe.from.token}`} />
          <Info left={`${recipe.from.token} to Swap`} right={`${makeNum(recipe.swapAmount ? recipe.swapAmount : 0)} ${recipe.from.token}`} />
          <Info left={`${recipe.from.token} to Redeem`} right={`${makeNum(((recipe.swapAmount / 100) * (poolMethods.redemption ? poolMethods.redemption / 100 : 1)).toString())} ${recipe.from.token}`} />
          <Info
            left={`Net ${recipe.from.token} to Swap`}
            right={`${makeNum(
              (
                recipe.swapAmount -
                (recipe.swapAmount / 100) *
                (poolMethods.redemption ? poolMethods.redemption / 100 : 1) -
                (recipe.conversionFee[recipe.chainId[recipe.to.network]])
              ).toString()
            )} ${recipe.from.token}`} />
        </InfoContainer>
      </Content>
    </Container>
  );
}

function Info({ left, right }) {
  return (
    <ContainerInfo>
      <div className="left Roboto_20pt_Light">{left}</div>
      <div className="right Roboto_20pt_Black">{right}</div>
    </ContainerInfo>
  );
};
const ContainerInfo = styled.div`
  display: flex;
  color: white;
  .left {
    margin: auto auto;
    margin-left: 0;
  }
  .right {
    margin: auto auto;
    margin-right: 0;
  }
`;
function makeNum(str, decimal = 4) {
  let newStr = str;
  if (typeof newStr === "number") newStr = str.toString();
  let arr = newStr.split(".");
  if (arr.length == 1 || arr[0].length > 8) return arr[0];
  else {
    return arr[0] + "." + arr[1].substr(0, decimal);
  }
};
const Container = styled.div`
  position: fixed;
  display: flex;
  width: 100%;
  height: 100vh;
  left: 0px;
  top: 100px;
  padding: 80px;
  overflow: auto;
  padding-bottom: 180px;
  background-color: black;
  z-index: 5;

  @media (min-width: 1088px) {
    position: absolute;
    width: 1088px;
    heigh: 818px;
    top: 100px;
    left: 50%;
    transform: translate(-50%, 0%);
  }

  .group1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 75px;
  }

  .wallet {
    width: 540px;
    margin: auto;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: 100%;
  position: relative;

  span {
    margin: auto;
  }
  .popup-image {
    display: flex;
    margin: 40px;
    align-items: center;
    width: 100%;
    justify-content: space-evenly;
  }
  label {
    color: white;
    text-align: center;
    margin-top: 40px;
    font-size: 20pt;
  }
  .popup-input {
    margin-top: 16px;
    width: 540px;
    height: 80px;
    border-radius: 20px;
    background-color: #35374b;
    border: 0px;
    text-align: center;
    font: Roboto, sans-serif;
    font-weight: bold;
    font-size: 30pt;
    color: white;

  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .popup-caution {
    color: #d62828;
    line-height: 26px;
    margin-bottom: 80px;
  }
`;
const QuickSelect = styled.div`
  display: flex;
  margin: 16px auto;
  gap: 20px;
  .sel-max {
    background-color: white;
    span {
      color: black;
    }
  }
  div {
    display: flex;
    width: 100px;
    height: 50px;
    border: 1px solid white;
    border-radius: 10px;
    span {
      margin: auto auto;
    }
  }
  div:hover {
    background-color: #ffffff;
    span{
      color: var(--black-30);
    }
  }
`;
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 540px;
  margin: 0 auto;
  margin-top: 40px;
  gap: 12px;

  @media (min-width: 1088px) {
    width: 540px;
    margin: 80px auto;
  }
`;
