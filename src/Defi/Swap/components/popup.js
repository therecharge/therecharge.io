import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ReactComponent as PopupClose } from "./assets/popup-close.svg";
import { ReactComponent as PopupArrow } from "./assets/swap_popup_arrow.svg";
import WalletConnect from "../../../Components/Common/WalletConnect";
import { fromWei, toWei } from "web3-utils";
import axios from "axios";
import { RotateCircleLoading } from "react-loadingg";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
//store
import { useRecoilState } from "recoil";
import { web3State, accountState } from "../../../store/web3";
import { web3ReaderState } from "../../../store/read-web3";
//functions
import {
  createContractInstance,
  getSwapAvailableTokenAmount,
  getAssociatedTokenAddress,
  createTransferInstruction,
} from "../../../lib/read_contract/Swap.js";
import BN from "bn.js";

const ERC20_ABI = require("../../abis/ERC20ABI.json");

class TokenAmount extends BN {
  /**
   * Convert to Buffer representation
   */
  toBuffer() {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);
    if (b.length === 8) {
      return b;
    }

    if (b.length >= 8) {
      throw new Error("TokenAmount too large");
    }

    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    return zeroPad;
  }

  /**
   * Construct a TokenAmount from Buffer representation
   */
  static fromBuffer(buffer) {
    if (buffer.length !== 8) {
      throw new Error(`Invalid buffer length: ${buffer.length}`);
    }

    return new BN(
      [...buffer]
        .reverse()
        .map((i) => `00${i.toString(16)}`.slice(-2))
        .join(""),
      16
    );
  }
}
const web3_sol = require("@solana/web3.js");
const splToken = require("@solana/spl-token");
// 경고 경고!! Caution에서 2%로 되어 있는 수수료도 상태처리 대상입니다.
export default function Popup({
  close = () => {},
  recipe,
  setRecipe,
  toast,
  isPopupOpen,
  recipeId,
  bridgeAddress,
  addresses,
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
  const [transactionId, setTransactionId] = useState("");
  const [onLoading, setOnLoading] = useState(false);

  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();

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
      let Token_reader, swapI, available;
      console.log("bridgeAddress", bridgeAddress);

      if (recipe.from.network !== "(Solana Network)") {
        Token_reader = createContractInstance(
          web3_r[recipe.network[recipe.from.network]],
          swapTokenAddress,
          ERC20_ABI
        );

        swapI = createContractInstance(web3, swapTokenAddress, ERC20_ABI);

        available = await getSwapAvailableTokenAmount(Token_reader, account);
      } else {
        let result = await axios({
          url: `https://api.mainnet-beta.solana.com`,
          method: "post",
          headers: { "Content-Type": "application/json" },
          data: [
            {
              jsonrpc: "2.0",
              id: 1,
              method: "getTokenAccountsByOwner",
              params: [
                addresses[0],
                {
                  mint: "3TM1bok2dpqR674ubX5FDQZtkyycnx1GegRcd13pQgko",
                },
                {
                  encoding: "jsonParsed",
                },
              ],
            },
          ],
        });
        console.log(result);
        available =
          result.data[0].result.value[0].account.data.parsed.info.tokenAmount
            .amount / 1000000000;
      }
      const swap = async (swapAmount) => {
        try {
          /* loading start */
          // setOnLoading(true);
          let txid;

          if (recipe.from.network === "(Solana Network)") {
            try {
              console.log("started solana transaction");

              const fromPublicKey = new web3_sol.PublicKey(addresses[0]);
              const toPublicKey = new web3_sol.PublicKey(bridgeAddress);
              const mint = new web3_sol.PublicKey(
                "3TM1bok2dpqR674ubX5FDQZtkyycnx1GegRcd13pQgko"
              );

              const fromTokenAccount = await getAssociatedTokenAddress(
                mint,
                fromPublicKey
              );

              const toTokenAccount = await getAssociatedTokenAddress(
                mint,
                toPublicKey
              );
              console.log("toTokenAccount", toTokenAccount);
              const transaction = new web3_sol.Transaction().add(
                // createTransferInstruction(
                //   fromTokenAccount, // source
                //   toTokenAccount, // dest
                //   publicKey,
                //   swapAmount * 1000000000,
                //   [],
                //   splToken.TOKEN_PROGRAM_ID
                // )
                splToken.Token.createTransferInstruction(
                  splToken.TOKEN_PROGRAM_ID,
                  fromTokenAccount,
                  toTokenAccount,
                  publicKey,
                  [],
                  1000
                  // new TokenAmount(1000)
                  // BigInt.asUintN(64, 1000000000)
                )
                // splToken.Token.createTransferInstruction(
                //   splToken.TOKEN_PROGRAM_ID,
                //   fromTokenAccount,
                //   toTokenAccount,
                //   publicKey,
                //   [],
                //   1001
                //   // new TokenAmount(1000)
                //   // BigInt.asUintN(64, 1000000000)
                // )
              );

              console.log(swapAmount);

              const blockHash = await connection.getRecentBlockhash();
              console.log("blockHash", blockHash);
              transaction.feePayer = await publicKey;
              transaction.recentBlockhash = await blockHash.blockhash;
              // transaction.keys = Array();

              console.log("before sigdn", transaction);
              let signed = await signTransaction(transaction);
              console.log("signed", signed);
              await connection.sendRawTransaction(signed.serialize());

              console.log("finished send");
              txid = signed;
              console.log("sol_from_txid", txid);
            } catch (err) {
              console.log(err);
            }
          } else {
            txid = await swapI.methods
              .transfer(bridgeAddress, swapAmount.toString())
              .send({ from: account, value: "0" });
          }

          if (
            recipe.from.network === "(Solana Network)" ||
            recipe.to.network === "(Solana Network)"
          ) {
            console.log("started submission");
            let result = await axios.post(
              "https://sol-bridge.therecharge.io/submission",
              {
                id: recipeId,
                txid: txid.transactionHash,
              }
            );
            console.log("result of swap bridge method :", result);
            console.log("finished submission");
            /* loading finished */
            /* finish standard : result status */
            // if (result.status == 200) setOnLoading(false);
          }
        } catch (err) {
          console.log(err);
          setOnLoading(false);
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

  const getFupBalance = async () => {
    let balanceFUP = await axios.get(
      `https://fup.bridge.therecharge.io/point/${account}`
    );
    balanceFUP = balanceFUP.data.balance;
    setPoolMethods({
      ...poolMethods,
      available: balanceFUP,
    });
    setRecipe({
      ...recipe,
      swapAmount: balanceFUP,
    });
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
        recipe.from.network === "(Binance Smart Chain Network)") ||
      (recipe.from.network === "(Huobi ECO Chain Network)" &&
        recipe.to.network === "(Binance Smart Chain Network)")
    ) {
      loadMethods(
        recipe.tokenAddress[recipe.chainId[recipe.from.network]],
        "0x05A21AECa80634097e4acE7D4E589bdA0EE30b25"
      );
    } else if (
      (recipe.to.network === "(Solana Network)" &&
        recipe.from.network === "(Binance Smart Chain Network)") ||
      (recipe.from.network === "(Solana Network)" &&
        recipe.to.network === "(Binance Smart Chain Network)")
    ) {
      loadMethods(
        recipe.tokenAddress[recipe.chainId[recipe.from.network]],
        bridgeAddress
      );
    } else if (
      (recipe.to.network === "(Solana Network)" &&
        recipe.from.network === "(Ethereum Network)") ||
      (recipe.from.network === "(Solana Network)" &&
        recipe.to.network === "(Ethereum Network)")
    ) {
      loadMethods(
        recipe.tokenAddress[recipe.chainId[recipe.from.network]],
        bridgeAddress
      );
    }
    if (isPopupOpen && recipe.from.token === "PiggyCell Point") getFupBalance();
  }, [account, recipe.to.network, isPopupOpen]);

  useEffect(() => {
    if (recipe.from.token === "PiggyCell Point") {
      setRecipe({
        ...recipe,
        swapAmount: "",
      });
    }
  }, []);

  console.log(poolMethods);
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
              disabled={
                recipe.from.token === "PiggyCell Point" ? "disabled" : ""
              }
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
              style={{
                cursor:
                  recipe.from.token === "PiggyCell Point"
                    ? "not-allowed"
                    : "pointer",
              }}
              onClick={
                recipe.from.token === "PiggyCell Point"
                  ? () => {}
                  : () => SetPercent(25)
              }
            >
              <span className="Roboto_20pt_Regular">25%</span>
            </div>
            <div
              style={{
                cursor:
                  recipe.from.token === "PiggyCell Point"
                    ? "not-allowed"
                    : "pointer",
              }}
              onClick={
                recipe.from.token === "PiggyCell Point"
                  ? () => {}
                  : () => SetPercent(50)
              }
            >
              <span className="Roboto_20pt_Regular">50%</span>
            </div>
            <div
              style={{
                cursor:
                  recipe.from.token === "PiggyCell Point"
                    ? "not-allowed"
                    : "pointer",
              }}
              onClick={
                recipe.from.token === "PiggyCell Point"
                  ? () => {}
                  : () => SetPercent(75)
              }
            >
              <span className="Roboto_20pt_Regular">75%</span>
            </div>
            <div
              style={{
                cursor:
                  recipe.from.token === "PiggyCell Point"
                    ? "not-allowed"
                    : "pointer",
              }}
              onClick={
                recipe.from.token === "PiggyCell Point"
                  ? () => {}
                  : () => SetPercent(100)
              }
            >
              <span className="Roboto_20pt_Regular">MAX</span>
            </div>
          </QuickSelect>
          <span className="Roboto_20pt_Regular popup-caution">
            {`Conversion Fee: ${
              recipe.from.token === "PiggyCell Point"
                ? 0
                : recipe.to.network === "(Solana Network)"
                ? 0.3
                : recipe.conversionFee[recipe.chainId[recipe.to.network]]
            } ${recipe.from.token}`}
          </span>
          <div className="wallet">
            <WalletConnect
              need={
                recipe.from.network === "(Solana Network)" ||
                recipe.to.network === "(Solana Network)"
                  ? "1"
                  : "2"
              }
              bgColor="#9314B2"
              hcolor=""
              border="3px solid #9314B2"
              w="540px"
              radius="20px"
              text="SWAP" //어프로브 안되어 있으면 APPROVE로 대체 필요함.
              onClick={async () => {
                if (recipe.swapAmount > 0) {
                  if (recipe.from.token === "PiggyCell Point") {
                    let completed = await axios.post(
                      `https://fup.bridge.therecharge.io/swap/${account}`
                    );
                    close();
                  } else {
                    await close();
                    await toast('Please approve "SWAP" in your private wallet');
                    await poolMethods.swap(recipe.swapAmount);
                  }
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
              right={`${
                recipe.from.token === "PiggyCell Point"
                  ? 0
                  : recipe.to.network === "(Solana Network)"
                  ? 0
                  : recipe.conversionFee[recipe.chainId[recipe.to.network]]
              } ${recipe.from.token}`}
            />
            <Info
              left={`${recipe.from.token} to Swap`}
              right={`${makeNum(recipe.swapAmount ? recipe.swapAmount : 0)} ${
                recipe.from.token
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
                recipe.from.token === "PiggyCell Point"
                  ? recipe.swapAmount - 0
                  : (recipe.swapAmount -
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
        <Loading style={{ display: onLoading ? "" : "none" }}>
          <div className="box">
            <RotateCircleLoading
              color="#9314b2"
              style={{ margin: "auto", marginTop: "67.6px" }}
            />
            <div className="text Roboto_30pt_Black">Loading…</div>
          </div>
        </Loading>
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
    background-color: var(--midnight);
    // background-color: rgba(0, 0, 0, 1);
    border-radius: 20px;

    .text {
      margin: auto;
      margin-bottom: 67.6px;
    }
  }
`;
