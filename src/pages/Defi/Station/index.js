import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
// Components
import Slider from "./components/Slider";
import List from "./components/List";

function Station(props) {
  const [t] = useTranslation();
  const [params, setParams] = useState({
    type: "Locked",
    isLP: false,
    address: "0x", // useless?
  });

  const loadFromMypools = () => {
    let type = window.location.href.split("#")[1];
    setParams({
      ...params,
      type: type,
    });
  };

  useEffect(() => {
    loadFromMypools();
  }, []);

  return (
    <Container>
      <Content>
        <span className="Roboto_50pt_Black pool-title1">Charging Station</span>
        <Slider setParams={setParams} params={params} />
        <Line />
        <List params={params} toast={props.toast} />
      </Content>
    </Container>
  );
}
const Container = styled.div`
  margin-top: 200px;
  display: flex;
  justify-content: center;
  width: 100vw;
  height: fit-content;

  @media (min-width: 1088px) {
    margin-top: 100px;
  }
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

  .pool-title1 {
    display: none;
    text-align: center;
    margin: 120px 0 80px 0;
    text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);

    @media (min-width: 1088px) {
      display: block;
    }
  }
`;
const Line = styled.div`
  height: 2px;
  margin: 40px 10px 0px 10px;
  width: auto;
  background-color: #9314b2;
  box-shadow: 0px 0px 20px 0.5px white;
`;

export default React.memo(Station);
