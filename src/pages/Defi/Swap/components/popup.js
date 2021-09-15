import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ReactComponent as PopupClose } from "./assets/popup-close.svg";
import { ReactComponent as PopupArrow } from "./assets/swap_popup_arrow.svg";
import WalletConnect from "../../../../Component/Components/Common/WalletConnect";
import { fromWei, toWei } from "web3-utils";
//store
import { useRecoilState } from "recoil";
import { web3State, accountState } from "../../../../store/web3";
import { web3ReaderState } from "../../../../store/read-web3";
//functions
import {
  createContractInstance,
  getSwapAvailableTokenAmount,
} from "../../../../lib/read_contract/Swap.js";

const ERC20_ABI = require("../../../../Component/Desktop/Defi/abis/ERC20ABI.json");

// 경고 경고!! Caution에서 2%로 되어 있는 수수료도 상태처리 대상입니다.
export default function Popup({
  close = () => { },
  recipe,
  setRecipe,
  toast,
  isPopupOpen,
}) {
  const [web3, setWeb3] = useRecoilState(web3State);
  const [web3_r] = useRecoilState(web3ReaderState);
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

      const Token_reader = createContractInstance(
        web3_r[recipe.network[recipe.from.network]],
        swapTokenAddress,
        ERC20_ABI
      );
      const swapI = createContractInstance(web3, swapTokenAddress, ERC20_ABI);
      let available = await getSwapAvailableTokenAmount(Token_reader, account);
      const swap = async (swapAmount) => {
        try {
          await swapI.methods
            .transfer(bridgeAddress, toWei(swapAmount, "ether"))
            .send({ from: account, value: "0" });
        } catch (err) {
          console.log(err);
        }
      };

      ret = {
        available: available,
        swap: async (swapAmount) => {
          await swap(swapAmount);
        },
      };

      // console.log("console from swap popup", ret);

      setPoolMethods({
        ...poolMethods,
        ...ret,
      });
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
    if (
      (recipe.to.network === "(Binance Smart Chain Network)" &&
        recipe.from.network === "(Ethereum Network)") ||
      (recipe.from.network === "(Binance Smart Chain Network)" &&
        recipe.to.network === "(Ethereum Network)")
    ) {
      loadMethods(
        recipe.tokenAddress[recipe.chainId[recipe.from.network]],
        "0x45c0b31Bc83D4C5E430b15D790596878dF31c30e"
      );
    } else if (
      (recipe.to.network === "(Huobi ECO Chain Network)" &&
        recipe.from.network === "(Ethereum Network)") ||
      (recipe.from.network === "(Huobi ECO Chain Network)" &&
        recipe.to.network === "(Ethereum Network)")
    ) {
      loadMethods(
        recipe.tokenAddress[recipe.chainId[recipe.from.network]],
        "0xaBC71F46FA0D80bCC7D36D662Edbe9930271B414"
      );
    } else if (
      (recipe.to.network === "(Huobi ECO Chain Network)" &&
        recipe.from.network === "((Binance Smart Chain Network)") ||
      (recipe.from.network === "(Huobi ECO Chain Network)" &&
        recipe.to.network === "(Binance Smart Chain Network)")
    ) {
      loadMethods(
        recipe.tokenAddress[recipe.chainId[recipe.from.network]],
        "0x05A21AECa80634097e4acE7D4E589bdA0EE30b25"
      );
    }
  }, [account, recipe.to.network]);

  useEffect(() => {
    if (isPopupOpen) loadMethods();
  }, [isPopupOpen]);

  return (
    <Background>
      <Container>
        <Content>
          <PopupClose
            onClick={() => {
              close();
              setRecipe({
                ...recipe,
                swapAmount: "",
              });
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
            {`Conversion Fee: ${recipe.conversionFee[recipe.chainId[recipe.to.network]]
              } ${recipe.from.token}`}
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
                  await poolMethods.swap(recipe.swapAmount);
                } else {
                  toast("Please enter the amount of Swap");
                }
              }}
            />
          </div>
          <InfoContainer>
            {/* <Info
              left="Current Redemption Rate"
              right={`${poolMethods.redemption}%`}
            /> */}
            <Info
              left="Current Conversion Fee"
              right={`${recipe.conversionFee[recipe.chainId[recipe.to.network]]
                } ${recipe.from.token}`}
            />
            <Info
              left={`${recipe.from.token} to Swap`}
              right={`${makeNum(recipe.swapAmount ? recipe.swapAmount : 0)} ${recipe.from.token
                }`}
            />
            {/* <Info
              left={`${recipe.from.token} to Redeem`}
              right={`${makeNum(
                (
                  (recipe.swapAmount) *
                  (poolMethods.redemption ? poolMethods.redemption / 100 : 1)
                ).toString()
              )} ${recipe.from.token}`}
            /> */}
            <Info
              left={`Net ${recipe.from.token} to Swap`}
              right={`${makeNum(
                (recipe.swapAmount -
                  0.000000000000001 -
                  recipe.conversionFee[recipe.chainId[recipe.to.network]] >
                  0
                  ? recipe.swapAmount -
                  0.000000000000001 -
                  recipe.conversionFee[recipe.chainId[recipe.to.network]]
                  : 0
                ).toString()
              )} ${recipe.from.token}`}
            />
          </InfoContainer>
        </Content>
      </Container>
    </Background>
  );
}

function Info({ left, right }) {
  return (
    <ContainerInfo>
      <div className="left Roboto_20pt_Light">{left}</div>
      <div className="right Roboto_20pt_Black">{right}</div>
    </ContainerInfo>
  );
}
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
}
const Background = styled.div`
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100vw;
  height: 100%;
  overflow: auto;
  background-color: var(--midnight);
  z-index: 2;
`;

const Container = styled.div`
  position: fixed;
  display: flex;
  width: 100%;
  height: 100vh;
  left: 0px;
  top: 100px;
  padding: 80px;
  overflow: auto;
  padding-bottom: 20px;
  background-color: black;
  z-index: 5;

  @media (min-width: 1088px) {
    position: absolute;
    border: 1px solid var(--black-20);
    border-radius: 20px;
    width: 714px;
    height: fit-content;
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
  input::-webkit-input-placeholder {
    text-align: center;
    font: Roboto, sans-serif;
    // font-weight: bold;
    font-size: 25pt;
    color: white;
    opacity: 0.5;
  }
  input:-ms-input-placeholder {
    text-align: center;
    font: Roboto, sans-serif;
    // font-weight: bold;
    font-size: 25pt;
    color: white;
    opacity: 0.5;
  }
  input::placeholder {
    text-align: center;
    font: Roboto, sans-serif;
    // font-weight: bold;
    font-size: 25pt;
    color: white;
    opacity: 0.5;
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
    span {
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
    margin: 20px auto;
  }
`;
