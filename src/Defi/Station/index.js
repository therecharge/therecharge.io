import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
// Components
// import Networks from "./components/Networks";
// import Slider from "./components/Slider";
import List from './components/List';
import Header from './components/Header';
// import Header_Private from './components/Header_Private';
// import List_Private from './components/List_Private';
function Station(props) {
  const [t] = useTranslation();
  const [params, setParams] = useState({
    type: 'ALL',
    isLP: 'ALL',
    address: '0x', // useless?
  });
  const [network, setNetwork] = useState('ALL');
  const [tvl, setTvl] = useState(0);
  const [privateTvl, setPrivateTvl] = useState(0);

  // useEffect(() => {
  //   setParams({
  //     ...params,
  //     type: "Locked",
  //   });
  // }, [network]);

  return (
    <Container style={window.innerWidth > 1088 ? { marginTop: '80px' } : { marginTop: '100.5px' }}>
      <Content>
        <span className="Roboto_50pt_Black pool-title1">Charging Station</span>
        <Header
          setNetwork={setNetwork}
          network={network}
          setParams={setParams}
          params={params}
          tvl={tvl}
          privateTvl={privateTvl}
        />
        {/* <Networks setNetwork={setNetwork} network={network} /> */}
        {/* <Slider setParams={setParams} params={params} /> */}
        <List params={params} toast={props.toast} network={network} setTvl={setTvl} />
        {/* <Header_Private />
        <List_Private params={params} toast={props.toast} network={network} setPrivateTvl={setPrivateTvl} /> */}
      </Content>
    </Container>
  );
}
const Container = styled.div`
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
  margin: 8px 10px 0px 10px;
  width: auto;
  background-color: #9314b2;
  box-shadow: 0 0 20px 0 #fff;
`;

export default /*React.memo(Station);*/ Station;
