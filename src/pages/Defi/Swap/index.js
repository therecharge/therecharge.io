import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
//components
import Asset from "./components/Asset";
import AssetSwap from "./components/AssetSwap";
// import Popup from "./components/popup";

function Swap(props) {

  // const [isPopupOpen, setPopupOpen] = useState(false);


  return (
    <Container>
      <Content>
        <span className="Roboto_50pt_Black swap-title1">Recharge Swap</span>
        <div className="content">
          <Asset />
          <Line />
          <span className="Roboto_40pt_Black swap-title">Swap</span>
          <AssetSwap toast={props.toast} />
        </div>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-width: fit-content;
  height: 100%;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  margin-bottom: 20vh;
  width: 100%;
  max-width: 1088px;
  height: 100%;
  a {
    color: white;
  }
  .swap-title1 {
    display: none;
    text-align: center;
    margin: 120px 0 80px 0;
    text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);

    @media (min-width: 1088px) {
      display: block;
    }
  }
  .swap-title {
    margin-top: 40px;

    @media (min-width: 1088px) {
      display: none;
    }
  }

  .content {
    display: flex;
    flex-direction: column;

    @media (min-width: 1088px) {
      flex-direction: row;
    }
  }
`;
const Line = styled.div`
  height: 2px;
  margin: 40px 10px 0px 10px;
  width: auto;
  background-color: #9314b2;
  box-shadow: 0px 0px 20px 2px white;

  @media (min-width: 1088px) {
    display: none;
  }
`;
export default React.memo(Swap);
