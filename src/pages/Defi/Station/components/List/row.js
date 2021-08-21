import { useState } from "react";
import styled from "styled-components";
import { ReactComponent as DropdownClose } from "./assets/dropdown-close.svg";
import { ReactComponent as DropdownOpen } from "./assets/dropdown-open.svg";
import WalletConnect from "../../../../../Component/Components/Common/WalletConnect";
//store
import { useRecoilState } from "recoil";
import { accountState } from "../../../../../store/web3";
// Row Component structure
//  1)state
//  2)style
//  3)inner component
//  4)render component with 3)inner component + 2)styles + 1)state
export default function Row({
  status = "Inactive",
  name = "Charger No.000000",
  apy = "10000.00",
}) {
  const [account] = useRecoilState(accountState);
  const [isOpen, setOpen] = useState(false);

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    mix-width: 620px;
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
  `;
  const Title = styled.div`
    display: flex;
    width: 100%;
    height: 120px;
  `;
  const Menu = styled.div`
    margin-top: -20px;
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
  `;
  const PoolInfo = styled.div`
    gap: 8px;
  `;
  const UserInfo = styled.div`
    margin-top: 8px;
  `;
  const Pannel = styled.div`
    margin-top: 8px;
    border-radius: 0 0 10px 10px;
  `;

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
      if (apy >= 100) return "var(--green)";
      if (apy >= 50) return "var(--red)";
      return "var(--yellow)";
    }
    return (
      <p className="Roboto_30pt_Black apy" style={{ color: color() }}>
        {status != "Inactive" ? apy + "%" : "-"}
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
        <div className="left Roboto_30pt_Light">{left}</div>
        <div className="right Roboto_30pt_Black">{right}</div>
      </Container>
    );
  }

  return (
    <Container>
      <Title onClick={() => setOpen(!isOpen)}>
        <Status status={status} />
        <Name status={status} name={name} />
        <Apy status={status} apy={apy} />
        <Btn status={status} isOpen={isOpen} />
      </Title>
      <Menu style={{ display: isOpen ? "flex" : "none" }}>
        <PoolInfo className="innerMenu">
          <Info left="APY" right="100%" />
          <Info left="TVL" right="$ 100,000,000" />
          <Info left="LIMIT" right="UNLIMITED" />
        </PoolInfo>
        {account ? (
          <UserInfo className="innerMenu">
            <Info className="hide" left="MY BAL" right="100%" />
            <Info left="Share" right="$ 100,000,000" />
            <Info left="Reward" right="UNLIMITED" />
          </UserInfo>
        ) : (
          <UserInfo className="innerMenu">
            <WalletConnect notConnected="plz Connect Wallet for Approve" />
          </UserInfo>
        )}
        <Pannel className="innerMenu">
          <Info left="APY" right="100%" />
          <Info left="TVL" right="$ 100,000,000" />
          <Info left="LIMIT" right="UNLIMITED" />
        </Pannel>
      </Menu>
    </Container>
  );
}
