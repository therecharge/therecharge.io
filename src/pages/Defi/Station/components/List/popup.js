import React from "react";
import styled from "styled-components";
import { ReactComponent as PopupClose } from "./assets/popup-close.svg";
import WalletConnect from "../../../../../Component/Components/Common/WalletConnect";

// 경고 경고!! Caution에서 2%로 되어 있는 수수료도 상태처리 대상입니다.
export default function Popup({ close = () => { } }) {
  return (
    <Container>
      <Content>
        <PopupClose onClick={close} className="popup-close" />
        <div className="group1">
          <span className="Roboto_40pt_Black popup-title">STAKING</span>
          <span className="Roboto_30pt_Regular popup-name">
            Charger No.000000
          </span>
          <span className="Roboto_30pt_Regular popup-apy">1000.00%</span>
          <span className="Roboto_20pt_Regular popup-available">
            Available: 100,000,000 RCG
          </span>
          <input className="popup-input" type="number" />
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
          Caution!: Recharge transaction, regardless of mainnet type <br />
          will incur 2% of carbon redemption.
        </span>
        <div className="wallet">
          <WalletConnect
            need="2"
            bgColor="#9314B2"
            border="3px solid #9314B2"
            w="540px"
            radius="20px"
            notConnected="Connect Wallet for PLUG-IN"
            wrongNetwork="Change network for PLUG-IN"
            text="PLUG-IN" //어프로브 안되어 있으면 APPROVE로 대체 필요함.
            onClick={() => console.log(1)}
          />
        </div>
        <InfoContainer>
          <Info left="Current Redemption Rate" right="00.00%" />
          <Info left="RCG to Stake" right="3,000,000 RCG" />
          <Info left="RCG to Redeem" right="3,000,000 RCG" />
          <Info left="Net RCG to Stake" right="3,000,000 RCG" />
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
  
  span {
    margin: 0 auto;
  }
  .popup-close {
    margin: 0 auto;
    margin-right: 0px;
  }
  .popup-title {
    margin-top: 50px;
  }
  .popup-name {
    margin-top: 40px;
  }
  .popup-apy {
    margin-top: 8px;
    color: #0eef6d;
  }
  .popup-available {
    margin-top: 80px;
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