import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
//components
import Asset from './components/Asset';
import AssetSwap from './components/AssetSwap';
// import Popup from "./components/popup";

function Swap(props) {
  // const [isPopupOpen, setPopupOpen] = useState(false);

  return (
    <Container>
      <Content>
        <div className="Roboto_40pt_Black swap-title-change">
          How to swap <i className="mobile-br" /> KCC networks
        </div>
        <p className="Roboto_16pt_Regular swap-desc">
          The KCC network swap service will open soon. <br />
          The KCC Network Swap service is currently being renewed and KCC Network Swap will be done manually.
        </p>
        <span className="Roboto_40pt_Black swap-address">0xC9E6494B9e6e26cEA3e657966755e2cFf137274b</span>

        <div className="Roboto_16pt_Regular info-red">
          Please send the RCG to the above address. When you send the RCG, <i className="mobile-br" />
          please DOUBLE CHECK the above address is correct and send it.
        </div>
        <div className="Roboto_16pt_Regular_Line_Height info">
          - When sending RCG, the network should be a BSC or KCC network.
        </div>
        <div className="Roboto_16pt_Regular_Line_Height info">
          - BSC &lt;—> KCC swap only allowed, ETH networks are not eligible, so ETH networks cannot be sent to above
          address.
        </div>
        <div className="Roboto_16pt_Regular_Line_Height info">
          - Please send the RCG from your personal wallet where we can confirm the address (Metamask referral, Exchange
          X)
        </div>
        <div className="Roboto_16pt_Regular_Line_Height info">
          - The address cannot be confirmed when you send RCG from the exchange. So if you have RCG in exchange, please
          transfer the RCG to your personal wallet (Metamask referral) and send it to the address above.
        </div>
        <div className="Roboto_16pt_Regular_Line_Height info">
          - Once the RCG payment is confirmed, we will send a 1:1 ratio of RCG/KCC to the wallet address that you sent
          within 24 hours.
        </div>

        <span className="Roboto_16pt_Regular_Line_Height info-yellow">Things Need to Know</span>
        <div className="Roboto_16pt_Regular_Line_Height info">
          The swap will be done within 24 hours after the swap request.
        </div>
        <div className="Roboto_16pt_Regular_Line_Height info">
          Manual KCC swaps are temporary and will open at the Charging Station Swap Service after renewal.
        </div>
        <div className="Roboto_16pt_Regular_Line_Height info">
          If you participate the KCC Pool, a manual swap is required and you can join the pool.
        </div>
      </Content>
    </Container>
    // <Container>
    //   <Content>
    //     <span className="Roboto_50pt_Black swap-title1">Recharge Swap</span>
    //     <div className="content">
    //       <Asset />
    //       <Line />
    //       <span className="Roboto_40pt_Black swap-title">Swap</span>
    //       <AssetSwap toast={props.toast} />
    //     </div>
    //   </Content>
    // </Container>
  );
}

const Container2 = styled.div``;

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
  margin-top: 60px; // margin-top: 100px
  margin-bottom: 1vh; // margin-bottom: 20vh;
  width: 100%;
  max-width: 1088px;
  height: 100%;
  a {
    color: white;
  }

  .swap-title-change {
    text-align: center;
    margin: 80px 0 80px 0;
    text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
  }
  .swap-address {
    margin: 40px 0px;
  }

  .info-red {
    color: #d62828;
    font-weight: bold;
    margin-bottom: 30px;
  }

  .info-yellow {
    color: #ffb900;
    font-weight: bold;
    margin-top: 30px;
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

  @media (max-width: 1088px) {
    max-width: 714px;
    margin-bottom: 0px;
    margin-top: 100px;
    .mobile-br {
      display: block;
    }
    .swap-desc,
    .info-red,
    .info,
    .info-yellow {
      font-size: 20px;
    }
    .swap-address {
      font-size: 24px;
    }

    .swap-title-change {
      width: 714px;
    }
    .info {
      line-height: 1.9;
    }
  }
`;
const Line = styled.div`
  height: 2px;
  margin: 40px 10px 0px 10px;
  width: auto;
  background-color: #9314b2;
  box-shadow: 0 0 20px 0 #fff;

  @media (min-width: 1088px) {
    display: none;
  }
`;
export default React.memo(Swap);
