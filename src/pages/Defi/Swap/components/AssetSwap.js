import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Dropdown from "./Dropdown";

function AssetSwap({ setParams }) {
  const [t] = useTranslation();
  return (
    <Container>
      <Content>
        <Dropdown />
        <Dropdown />
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

export default React.memo(AssetSwap);
