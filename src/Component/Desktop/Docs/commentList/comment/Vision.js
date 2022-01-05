import styled from "styled-components";

function Vision() {
  return (
    <Container>
      <div className="theme Roboto_50pt_Black_L">Whitepaper</div>
      <div className="title Roboto_30pt_Black_L">5. Vision</div>
      <div className="subTitle Roboto_20pt_Black_L">5-1. Roadmap</div>
      <div className="semiTitle Roboto_20pt_Black_L">2021</div>
      <div className="subText Roboto_20pt_Regular_L">Q2</div>
      <div className="subText Roboto_20pt_Regular_L">
        - Rechage issued on Huobi Eco Chain
      </div>
      <div className="text Roboto_20pt_Regular_L">
        - Recharge issued on Ethereum Network and Binance Smart Chain
      </div>
      <div className="subText Roboto_20pt_Regular_L">Q3</div>
      <div className="subText Roboto_20pt_Regular_L">
            - Charging Station (De-Fi) launched
      </div>
      <div className="text Roboto_20pt_Regular_L">
            - Initial Liquidity Offering on DEX
      </div>
      <div className="subText Roboto_20pt_Regular_L">Q4</div>
      <div className="subText Roboto_20pt_Regular_L">
            - Integration of Point to Token system on PiggyCell
      </div>
      <div className="subText Roboto_20pt_Regular_L">
            - 1st Platform Subsidy Provided
      </div>
      <div className="subText Roboto_20pt_Regular_L">
            - Major Liquidity provided on DEX
      </div>
      <div className="text Roboto_20pt_Regular_L">
            - Solana Mainnet integration on Recharge Swap
      </div>
      <div className="semiTitle Roboto_20pt_Black_L">2022</div>
      <div className="subText Roboto_20pt_Regular_L">Q1</div>
      <div className="subText Roboto_20pt_Regular_L">
            - The Recharge – NFT
      </div>
      <div className="subText Roboto_20pt_Regular_L">
            - The Recharge NFT Minting activated
      </div>
      <div className="subText Roboto_20pt_Regular_L">
            - Solana Mainnet integration
      </div>
      <div className="text Roboto_20pt_Regular_L">
          - DEX integration Phase 1
      </div>
      <div className="subText Roboto_20pt_Regular_L">Q2 - Q3</div>
      <div className="subText Roboto_20pt_Regular_L">
          -  E-Bike Sharing Adoption
      </div>
      <div className="subText Roboto_20pt_Regular_L">
          - Point to Token Integration
      </div>
      <div className="subText Roboto_20pt_Regular_L">
          - De-Fi 2.0 Update
      </div>
      {/*<div className="subTitle Roboto_20pt_Black_L">5-2. Team members</div>*/}
      {/*<div className="subTitle Roboto_20pt_Black_L">*/}
      {/*  Jake Kim, Chief Technical Officer,*/}
      {/*</div>*/}
      {/*<div className="subText Roboto_20pt_Regular_L">- CTO at 100 Percent</div>*/}
      {/*<div className="subText Roboto_20pt_Regular_L">*/}
      {/*  - Software Developer at TMON*/}
      {/*</div>*/}
      {/*<div className="subText Roboto_20pt_Regular_L">*/}
      {/*  - Application Developer at Kakao Corp*/}
      {/*</div>*/}
      {/*<div className="text Roboto_20pt_Regular_L">*/}
      {/*  - Lead at Kakao Enterprise AI Development Team*/}
      {/*</div>*/}
      {/*<div className="subTitle Roboto_20pt_Black_L">*/}
      {/*  Ethan Kang, Chief Marketing Officer*/}
      {/*</div>*/}
      {/*<div className="subText Roboto_20pt_Regular_L">*/}
      {/*  - CSO/CMO at 100 Percent*/}
      {/*</div>*/}
      {/*<div className="subText Roboto_20pt_Regular_L">*/}
      {/*  - CSO at Thinkingwolf (Marketing Agency)*/}
      {/*</div>*/}
      {/*<div className="text Roboto_20pt_Regular_L">*/}
      {/*  - CMO at Zipdoc (Interior O2O Platform)*/}
      {/*</div>*/}
    </Container>
  );
}
const Container = styled.div`
  width: 750px;
  .theme {
    margin-bottom: 80px;
    text-shadow: 0 0 1px white, 0 0 15px white;
  }
  .title {
    margin-top: 60px;
    margin-bottom: 40px;
  }
  .subTitle {
    margin-top: 60px;
  }
  .semiTitle {
    margin-top: 40px;
  }
  .text {
    margin-bottom: 40px;
  }
`;
export default Vision;
