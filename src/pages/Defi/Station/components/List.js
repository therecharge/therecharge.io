import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { ReactComponent as DropdownClose } from "./List/dropdown-close.svg";

function List({ type, list }) {
  const [t] = useTranslation();
  return (
    <Container>
      <Content>
        <Image type={type} />
        <p className="Roboto_40pt_Black">Charger List</p>
        <RowContainer>
          <Row status="Close" />
          <Row status="Inactive" />
          <Row status="Active" />
        </RowContainer>
      </Content>
    </Container>
  );
}
const Container = styled.div`
  margin-top: 40px;
  display: flex;
  width: 100%;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  mix-width: 620px;
  img {
    height: 60px;
    margin: auto;
  }
  p {
    color: white;
    margin: auto;
    margin-top: 20px;
  }
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 50px 0px 50px;
`;

export default React.memo(List);

function Image({ type }) {
  return (
    <img
      src={
        type === "locked" ? "/ic_lockedstaking.svg" : "/ic_flexiblestaking.svg"
      }
    />
  );
}

function Row({
  status = "Inactive",
  name = "Charger No.000000",
  apy = "10000.00",
  chargerAddress,
}) {
  const Container = styled.div`
    display: flex;
    mix-width: 620px;
    height: 120px;
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
      if (status != "Active") return "#7E7E7E";
    }
    return (
      <p className="Roboto_30pt_Black name" style={{ color: color() }}>
        {name}
      </p>
    );
  }

  function Apy({ apy }) {
    return <p className="Roboto_30pt_Black apy">{apy}</p>;
  }

  function Btn({ status, isOpen }) {
    return (
      <DropdownClose
        className="btn"
        fill={status == "Inactive" ? "#7E7E7E" : "#fff"}
      />
    );
  }

  return (
    <Container>
      <Status status={status} />
      <Name status={status} name={name} />
      <Apy status={status} apy={apy} />
      <Btn status={status} isOpen={false} />
    </Container>
  );
}
