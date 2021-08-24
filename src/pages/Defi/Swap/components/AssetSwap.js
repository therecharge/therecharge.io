import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Dropdown from "./Dropdown";

function AssetSwap({ setParams }) {
  const [t] = useTranslation();

  return (
    <Container>
      <Content>
        {/* from 
            Image -> token image
            symbol -> token symbol
            network -> swap에 필요한 네트워크 연결
            */}
        <Dropdown /*Image={ } symbol={ } network={ }*/ title={"FROM"} />
        {/* to */}
        <Dropdown /*Image={ } symbol={ } network={ }*/ title={"TO"} />
      </Content>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  margin: 40px 50px 50px 50px;
  height: 886px;
  background-color: #1c1e35;
  border-radius: 10px;

  @media (min-width: 1088px) {
    justify-content: center;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 40px 40px 40px 40px;
`;
const UserInfo = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 8px;

  @media (min-width: 1088px) {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 540px;
    margin-top: 0px;
    margin-left: 8px;
  }
`;

export default React.memo(AssetSwap);
