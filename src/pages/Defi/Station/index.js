import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
// Components
import Slider from "./components/Slider";
import List from "./components/List";

function Station({}) {
  const [t] = useTranslation();
  return (
    <Container>
      <Content>
        <Slider />
        <Line />
        <List />
      </Content>
    </Container>
  );
}
const Container = styled.div`
  margin-top: 100px;
  display: flex;
  width: 100vw;
  height: 100vh;
`;
const Content = styled.div`
  display: flex;
  width: 100%;
  max-width: 1188px;
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
