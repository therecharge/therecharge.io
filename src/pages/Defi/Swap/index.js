import React, { useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
//components
import Asset from "./components/Asset";
import AssetSwap from "./components/AssetSwap";

function Swap({ }) {
  const [t] = useTranslation();

  return (
    <Container>
      <Content>
        <Asset />
        <Line />
        <span className="Roboto_40pt_Black swap-title">Swap</span>
        <AssetSwap />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  width: 100%;
  max-width: 1088px;
  height: 100%;
  a {
    color: white;
  }
  .swap-title {
    margin-top: 40px;
  }
`;
const Line = styled.div`
  height: 2px;
  margin: 40px 10px 0px 10px;
  width: auto;
  background-color: #9314b2;
  box-shadow: 0px 0px 20px 2px white;
`;
export default React.memo(Swap);
