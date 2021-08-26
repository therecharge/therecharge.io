import React from "react";
import styled from "styled-components";
import { ReactComponent as PopupClose } from "./assets/popup-close.svg";
import { ReactComponent as PopupArrow } from "./assets/swap_popup_arrow.svg";
import WalletConnect from "../../../../Component/Components/Common/WalletConnect";

// 경고 경고!! Caution에서 2%로 되어 있는 수수료도 상태처리 대상입니다.
export default function Popup({ close = () => { }, recipe }) {
  let FromImg = recipe.from.image
  let ToImg = recipe.to.image
  return (
    <Container>
      <Content>
        <PopupClose onClick={close} className="popup-close" style={{ position: "absolute", right: "0" }} />
        <div className="group1">
          <span className="Roboto_40pt_Black popup-title">SWAP</span>
          <div className="popup-image">
            <FromImg style={{ height: "80px", width: "80px" }} />
            <PopupArrow style={{ height: "16px", width: "30px" }} />
            <ToImg style={{ height: "80px", width: "80px" }} />
          </div>
          <label>
            Available: 7,000,000.00 RCG
            <input className="popup-input" type="number" name="swapAmount" />
          </label>
        </div>
        <QuickSelect>
          <div style={{ cursor: "pointer" }}>
            <span className="Roboto_20pt_Regular">25%</span>
          </div>
          <div style={{ cursor: "pointer" }}>
            <span className="Roboto_20pt_Regular">50%</span>
          </div>
          <div style={{ cursor: "pointer" }}>
            <span className="Roboto_20pt_Regular">75%</span>
          </div>
          <div className="sel-max" style={{ cursor: "pointer" }}>
            <span className="Roboto_20pt_Regular">MAX</span>
          </div>
        </QuickSelect>
        <span className="Roboto_20pt_Regular popup-caution">
          Conversion Fee: xxxx RCG
        </span>
        <div className="wallet">
          <WalletConnect
            need="2"
            bgColor="#9314B2"
            border="3px solid #9314B2"
            w="540px"
            radius="20px"
            text="SWAP" //어프로브 안되어 있으면 APPROVE로 대체 필요함.
            onClick={() => console.log(1)}
          />
        </div>
        <InfoContainer>
          <Info left="Current Redemption Rate" right="00.00%" />
          <Info left="Current Conversion Fee" right="3,000,000 RCG" />
          <Info left="RCG to Swap" right="3,000,000 RCG" />
          <Info left="RCG to Redeem" right="3,000,000 RCG" />
          <Info left="Net RCG to Swap" right="3,000,000 RCG" />
        </InfoContainer>
      </Content>
    </Container>
  );
}

function Info({ left, right }) {
  const Container = styled.div`
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
  return (
    <Container>
      <div className="left Roboto_20pt_Light">{left}</div>
      <div className="right Roboto_20pt_Black">{right}</div>
    </Container>
  );
}
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

  @media (min-width: 1088px) {
    width: 1088px;
    heigh: 818px;
    top: 130px;
    left: auto;
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
    margin: 0 auto;
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
