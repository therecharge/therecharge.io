import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Balance from "./Balance";
import { ReactComponent as RCGeth } from "./assets/RCGETH.svg";
import { ReactComponent as RCGht } from "./assets/RCGHT.svg";
import { ReactComponent as RCGbnb } from "./assets/RCGBNB.svg";
import { ReactComponent as ETH } from "./assets/ETH.svg";
import { ReactComponent as HT } from "./assets/HT.svg";
import { ReactComponent as BNB } from "./assets/BNB.svg";
import { ReactComponent as FUP } from "./assets/FUP.svg";

function Asset({ setParams }) {
  const [t] = useTranslation();
  return (
    <Container>
      <Content>
        <span className="Roboto_40pt_Black">My Asset</span>
        <List>
          <Balance Image={RCGeth} symbol="RCG" balance="1,000.000" />
          <Balance Image={RCGht} symbol="RCG" balance="10,000.000" />
          <Balance Image={RCGbnb} symbol="RCG" balance="100,000.000" />
          <Balance Image={ETH} symbol="ETH" balance="100,000.000" />
          <Balance Image={HT} symbol="HT" balance="100,000.000" />
          <Balance Image={BNB} symbol="BNB" balance="100,000.000" />
          <Balance Image={FUP} symbol="FUP" balance="100,000.000" />
        </List>
      </Content>
    </Container>
  );
}
const Container = styled.div`
  margin: 60px 50px 0px 50px;
  border-radius: 10px;
  display: flex;
  height: 350px;
  background-color: #1c1e35;
  @media (min-width: 1088px) {
    justify-content: center;
  }
`;
const Content = styled.div`
  margin: 20px 60px 20px 60px;
  width: 100%;
  display: flex;
  gap: 20px;
  flex-direction: column;
  span {
    margin: 0 auto;
  }
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  // background-color: white;
  white-space: nowrap;
  overflow: auto;
  gap: 14px;
`;

export default React.memo(Asset);
