import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
// Components
import Slider from "./components/Slider";
import List from "./components/List";

function Station({}) {
  const [t] = useTranslation();
  const [params, setParams] = useState({
    type: "Flexible",
    isLP: false,
    address: "0x", // useless?
  });

  return (
    <Container>
      <Content>
        <Slider setParams={setParams} />
        <Line />
        <List params={params} />
      </Content>
    </Container>
  );
}
const Container = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 100vh;
`;
const Content = styled.div`
  display: flex;
  width: 100%;
  max-width: 1088px;
  height: 100%;
  flex-direction: column;
  a {
    color: white;
  }
`;
const Line = styled.div`
  height: 2px;
  margin: 40px 10px 0px 10px;
  width: auto;
  background-color: #9314b2;
  box-shadow: 0px 0px 20px 2px white;
`;

export default React.memo(Station);
