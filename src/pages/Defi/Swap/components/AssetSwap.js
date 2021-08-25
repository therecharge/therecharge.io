import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Dropdown from "./Dropdown";
import WalletConnect from "../../../../Component/Components/Common/WalletConnect";
import { ReactComponent as RCGeth } from "./assets/RCGETH.svg";
import { ReactComponent as RCGbnb } from "./assets/RCGBNB.svg";
import { ReactComponent as RCGht } from "./assets/RCGHT.svg";
import { ReactComponent as FUP } from "./assets/FUP.svg";
import { ReactComponent as Active } from "./assets/swap_arrow.svg";
import { ReactComponent as Inactive } from "./assets/swap_arrow_deactive.svg";

function AssetSwap({ setParams }) {
  const [t] = useTranslation();
  const [recipe, setRecipe] = useState({
    from: {
      token: "RCG",
      network: "(Huobi ECO Chain Network)",
      image: RCGht,
      index: 0,
    },
    to: {
      token: "RCG",
      network: "(Ethereum Network)",
      image: RCGeth,
      index: 0,
    },
    swapAmount: "",
  });

  const fromList = [
    ["RCG", "(Huobi ECO Chain Network)", RCGht],
    ["RCG", "(Ethereum Network)", RCGeth],
    ["RCG", "(Binance Smart Chain Network)", RCGbnb],
    ["PiggyCell Point", "", FUP],
  ];
  const toList1 = [
    ["RCG", "(Ethereum Network)", RCGeth],
    ["RCG", "(Binance Smart Chain Network)", RCGbnb],
  ];
  const toList2 = [
    ["RCG", "(Huobi ECO Chain Network)", RCGht],
    ["RCG", "(Binance Smart Chain Network)", RCGbnb],
  ];
  const toList3 = [
    ["RCG", "(Huobi ECO Chain Network)", RCGht],
    ["RCG", "(Ethereum Network)", RCGeth],
  ];
  const toList4 = [["RCG", "(Huobi ECO Chain Network)", RCGht]];

  const [selAsset, setSelAsset] = useState({
    logo: "rcg",
    name: "Recharge",
    symbol: "RCG",
    chainId: {
      Ethereum: 1,
      "Huobi ECO Chain": 128,
      "Binance Smart Chain": 56,
    },
    tokenAddress: {
      1: "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30",
      128: "0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b",
      56: "0x2D94172436D869c1e3c094BeaD272508faB0d9E3",
    },
    conversionFee: {
      1: 0.5,
      128: 5,
      56: 0.5,
    },
  });

  return (
    <Container>
      <Content>
        <Dropdown
          recipe={recipe}
          setRecipe={setRecipe}
          Image={recipe.from.image}
          symbol={recipe.from.token}
          network={recipe.from.network}
          unselectedList={fromList}
          title="FROM"
        />
        <Arrow
          style={
            recipe.from.token === "PiggyCell Point"
              ? {
                  width: "60px",
                  height: "60px",
                  margin: "40px auto",
                  cursor: "not-allowed",
                }
              : {
                  width: "60px",
                  height: "60px",
                  margin: "40px auto",
                  cursor: "pointer",
                }
          }
          onClick={() => {
            recipe.from.token === "PiggyCell Point"
              ? console.log("")
              : setRecipe({
                  ...recipe,
                  from: recipe.to,
                  to: recipe.from,
                  swapAmount: "",
                });
          }}
        >
          {recipe.from.token !== "PiggyCell Point" ? <Active /> : <Inactive />}
        </Arrow>
        <Dropdown
          recipe={recipe}
          setRecipe={setRecipe}
          Image={recipe.to.image}
          symbol={recipe.to.token}
          network={recipe.to.network}
          unselectedList={
            recipe.from.index === 0
              ? toList1
              : recipe.from.index === 1
              ? toList2
              : recipe.from.index === 2
              ? toList3
              : recipe.from.index === 3
              ? toList4
              : []
          }
          unselectedList2={toList2}
          unselectedList3={toList3}
          unselectedList4={toList4}
          title="TO"
        />
        <WalletConnect
          need="2"
          bgColor="var(--purple)"
          border="4px solid #9314B2"
          notConnected="Connect Wallet for swap"
          wrongNetwork="Change network for swap"
          m="80px auto"
          radius="20px"
          w="540px"
          // h="60px"
          fontsize="30px"
          notConnected="Connect Wallet for PLUG-IN"
          wrongNetwork="Change network for PLUG-IN"
          text="SWAP"
        />
      </Content>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  margin: 40px 50px 50px 50px;
  height: fit-content;
  background-color: #1c1e35;
  border-radius: 10px;

  @media (min-width: 1088px) {
    justify-content: center;
    width: 714px;
    height: 670px;
    margin: 40px 0px 0px 20px;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  margin: 40px 40px 40px 40px;
`;
const Arrow = styled.div`
  display: flex;
`;

export default React.memo(AssetSwap);
