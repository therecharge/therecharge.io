import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ReactComponent as PopupClose } from "./assets/popup-close.svg";
import axios from "axios";
import { RotateCircleLoading } from "react-loadingg";

// 경고 경고!! Caution에서 2%로 되어 있는 수수료도 상태처리 대상입니다.
export default function Popup({
  close = () => {},
  recipe,
  recipeId,
  addresses,
}) {
  const [transactionId, setTransactionId] = useState("");
  const [onLoading, setOnLoading] = useState(false);

  const postSubmission = async () => {
    console.log("submissionAddresses", addresses);
    console.log("submissionTxId", transactionId);
    let result = setTimeout(async () => {
      await axios.post("https://sol-bridge.therecharge.io/submission", {
        id: recipeId,
        txid: transactionId,
      });
    }, 10000);
  };

  return (
    <Background>
      <Container>
        <Content>
          <PopupClose
            onClick={() => {
              close();
            }}
            className="popup-close"
            style={{ position: "absolute", right: "0", cursor: "pointer" }}
          />
          <div className="group1">
            <span
              className="Roboto_40pt_Black popup-title"
              style={{ marginBottom: "40px" }}
            >
              Redeem
            </span>
            <span className="Roboto_20pt_Yellow_C">
              {`If you have sent RCG from ${
                recipe.from.network === "(Solana Network)" ? "SOL" : "BSC"
              } network to ${
                recipe.to.network === "(Solana Network)" ? "SOL" : "BSC"
              } network,`}
            </span>
            <span
              className="Roboto_20pt_Yellow_C"
              style={{ marginBottom: "40px" }}
            >
              but have not received RCG, leave your TXID to resume your
              transfer.
            </span>

            <div className="Roboto_30pt_Medium">
              {`${recipe.to.network === "(Solana Network)" ? "Solana" : "BSC"}`}{" "}
              Wallet Address
            </div>
            <div className="addressToBeSent" style={{ marginBottom: "40px" }}>
              <div>{addresses[1].slice(0, 20) + "..."}</div>
            </div>
            <div className="Roboto_30pt_Medium">
              {`${
                recipe.from.network === "(Solana Network)" ? "SOL" : "BSC"
              } TXID`}
            </div>
            <input
              className="popup-input"
              placeholder="Leave here"
              value={
                transactionId.length < 20
                  ? transactionId
                  : transactionId.slice(0, 10) + "..." + transactionId.slice(80)
              }
              style={{ marginBottom: "16px", color: "white" }}
              onChange={(e) => {
                setTransactionId(e.target.value);
                console.log("transactionId", transactionId);
              }}
            />
          </div>

          <span className="Roboto_20pt_Regular popup-caution">
            {`Paste your transaction hash(TXID) on ${
              recipe.from.network === "(Solana Network)" ? "SOL" : "BSC"
            } Scan`}
          </span>
          <Redeem
            // onClick={() => setRedeemPopupOpen(!isRedeemPopupOpen)}
            onClick={async () => {
              await setOnLoading(true);
              await postSubmission();
              await setOnLoading(false);
              await close();
            }}
          >
            Confirm Redemption
          </Redeem>
          <Detail>More details</Detail>
        </Content>
        <div
          className="background"
          style={{ display: onLoading ? "block" : "none" }}
        />
        <Loading style={{ display: onLoading ? "block" : "none" }}>
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

  .background {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1;
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

  .addressToBeSent {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    width: 540px;
    height: 80px;
    border-radius: 10px;
    background-color: #35374b;
    border: 0px;

    text-align: center;
    font: Roboto, sans-serif;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: center;
    font-size: 25pt;
    color: white;
  }
  .popup-input {
    margin-top: 16px;
    width: 540px;
    height: 80px;
    border-radius: 10px;
    background-color: #35374b;
    border: 0px;

    text-align: center;
    font: Roboto, sans-serif;
    // font-weight: bold;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.32;
    letter-spacing: normal;
    text-align: center;
    font-size: 25pt;
    color: white;
  }
  input::-webkit-input-placeholder {
    text-align: center;
    font: Roboto, sans-serif;
    // font-weight: bold;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.32;
    letter-spacing: normal;
    text-align: center;
    font-size: 25pt;
    color: white;
    opacity: 0.5;
  }
  input:-ms-input-placeholder {
    text-align: center;
    font: Roboto, sans-serif;
    // font-weight: bold;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.32;
    letter-spacing: normal;
    text-align: center;
    font-size: 25pt;
    color: white;
    opacity: 0.5;
  }
  input::placeholder {
    text-align: center;
    font: Roboto, sans-serif;
    // font-weight: bold;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.32;
    letter-spacing: normal;
    text-align: center;
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
  z-index: 2;
  position: fixed;
  left: 60px;
  top: 400px;

  // -webkit-transform: translate(-50%, -50%);
  // -ms-transform: translate(-50%, -50%);
  // -moz-transform: translate(-50%, -50%);
  // -o-transform: translate(-50%, -50%);
  // transform: translate(-50%, -50%);
  // right: 0;
  // bottom: 0;
  // background-color: rgba(0, 0, 0, 0.5);

  .box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
    width: 600px;
    height: 255px;
    background-color: var(--midnight);
    // background-color: rgba(0, 0, 0, 1);
    border-radius: 20px;
    z-index: 3;

    .text {
      margin: auto;
      margin-bottom: 67.6px;
    }
  }
`;

const Redeem = styled.div`
  width: 540px;
  height: 80px;
  margin: 0 auto;
  padding: 20px 0;
  border-radius: 20px;
  background-color: var(--ultramarine-blue);
  font-family: Roboto;
  font-size: 30px;
  font-weight: 900;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.5);
  }

  // @media (min-width: 1088px) {
  //   width: 474px;
  //   height: 60px;
  //   padding: 18px 0;
  //   font-size: 20px;
  // }
`;

const Detail = styled.div`
  margin-top: 40px;
  font-family: Roboto;
  font-size: 20px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: center;
  color: #fff;
`;
