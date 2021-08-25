import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Dropdown from "./Dropdown";
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
      index: 2
    },
    to: {
      token: "RCG",
      network: "(Ethereum Network)",
      image: RCGeth,
      index: 0
    },
    swapAmount: "",
  });

  const fromList = [
    ["RCG", "(Ethereum Network)", RCGeth],
    ["RCG", "(Binance Smart Chain Network)", RCGbnb],
    ["RCG", "(Huobi ECO Chain Network)", RCGht],
    ["PiggyCell Point", "", FUP]
  ];
  const toList = [
    ["RCG", "(Ethereum Network)", RCGeth],
    ["RCG", "(Binance Smart Chain Network)", RCGbnb],
    ["RCG", "(Huobi ECO Chain Network)", RCGht],
  ];


  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const [rollState1, setRollState1] = useState(false);
  const [rollState2, setRollState2] = useState(false);
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

  const handleDropdown1 = () => {
    setDropdownOpen1(!dropdownOpen1);
  };
  const handleDropdown2 = () => {
    setDropdownOpen2(!dropdownOpen2);
  };


  function loadSwitchBox(recipe, direction, netList) {
    return (
      <div className={direction}>
        <div className="theme Roboto_40pt_Black_L">
          {direction.toUpperCase()}
        </div>
        <div
          className="box"
          style={
            selAsset.logo === "piggy"
              ? {}
              : (direction == "from" ? dropdownOpen1 : dropdownOpen2)
                ? {
                  borderRadius: "20px 20px 0 0",
                  boxShadow: "0 0 15px 0 var(--purple)",
                }
                : {}
          }
        >
          <div
            className="default"
            style={
              selAsset.logo === "piggy"
                ? {}
                : (direction == "from" ? dropdownOpen1 : dropdownOpen2)
                  ? {}
                  : {}
            }
            onMouseOver={() => {
              direction == "from" ? setRollState1(true) : setRollState2(true);
            }}
            onMouseOut={() => {
              direction == "from" ? setRollState1(false) : setRollState2(false);
            }}
            onClick={() =>
              direction == "from" ? handleDropdown1() : handleDropdown2()
            }
          >
            <div className="network">
              <div className="logo">
                <img
                  src={
                    "/swap_" +
                    `${recipe.networkList[
                    direction == "from"
                      ? selAsset.logo === "piggy"
                        ? "PiggyCell"
                        : recipe.from
                      : selAsset.logo === "piggy"
                        ? "Huobi ECO Chain"
                        : recipe.to
                    ]
                    }` +
                    ".svg"
                  }
                  style={{ width: "80px", height: "80px" }}
                />
              </div>
              <div className="name">
                <div className="Roboto_30pt_Bold">
                  {direction == "from"
                    ? selAsset.logo === "piggy"
                      ? "PiggyCell"
                      : recipe.from
                    : selAsset.logo === "piggy"
                      ? "Huobi ECO Chain"
                      : recipe.to}
                </div>
                <div className="Roboto_30pt_Bold">
                  {direction == "from" && selAsset.logo === "piggy"
                    ? "Point"
                    : "Network"}
                </div>
              </div>
            </div>
            <div className="bar"></div>
            <div className="dropdown">
              <img
                src={
                  (direction == "from" ? dropdownOpen1 : dropdownOpen2)
                    ? "/ic_swap_rollup.svg"
                    : (direction == "from" ? rollState1 : rollState2)
                      ? "/ic_swap_rolldown_mouseover.svg"
                      : "/swap_dropdown.svg"
                }
                style={{ width: "16px", height: "9px" }}
              />
            </div>
            <div
              className={
                selAsset.logo === "piggy"
                  ? ""
                  : (direction == "from" ? dropdownOpen1 : dropdownOpen2)
                    ? "test"
                    : "inactive"
              }
            ></div>
            <div
              className={
                (direction == "from" ? dropdownOpen1 : dropdownOpen2)
                  ? "dropdownContents"
                  : "inactive"
              }
              style={direction === "from" ? { zIndex: "5" } : {}}
            >
              {selAsset.logo === "piggy"
                ? ""
                : netList.map((chain, index) => {
                  return (
                    <div
                      className="dropdownContent"
                      onClick={() => {
                        direction === "from"
                          ? netList[index] === recipe.to
                            ? setRecipe({
                              ...recipe,
                              from: recipe.to,
                              to: recipe.from,
                              swapAmount: "",
                            })
                            : setRecipe({
                              ...recipe,
                              from: netList[index],
                            })
                          : netList[index] == recipe.from
                            ? setRecipe({
                              ...recipe,
                              from: recipe.to,
                              to: recipe.from,
                              swapAmount: "",
                            })
                            : setRecipe({
                              ...recipe,
                              to: netList[index],
                            });
                        direction == "from"
                          ? handleDropdown1()
                          : handleDropdown2();
                      }}
                    >
                      <div className="logo">
                        <img
                          src={
                            "/swap_" + `${recipe.networkList[chain]}` + ".svg"
                          }
                          style={{ width: "80px", height: "80px" }}
                        />
                      </div>
                      <div className="name">
                        <div className="Roboto_30pt_Bold">{chain}</div>
                        <div className="Roboto_30pt_Bold">Network</div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          title="FROM" />
        <Arrow
          style={
            recipe.from.token === "PiggyCell Point"
              ? {
                width: "60px",
                height: "60px",
                cursor: "not-allowed",
              }
              : { width: "60px", height: "60px" }
          }
          onClick={() => {
            recipe.from.token === "PiggyCell Point"
              ? console.log("")
              : setRecipe({
                ...recipe,
                from: recipe.to,
                to: recipe.from,
                swapAmount: "",
              })
          }}
        >
          {recipe.from.token !== "PiggyCell Point"
            ? <Active />
            : <Inactive />
          }
        </Arrow>
        <Dropdown
          recipe={recipe}
          setRecipe={setRecipe}
          Image={recipe.to.image}
          symbol={recipe.to.token}
          network={recipe.to.network}
          unselectedList={toList}
          title="TO" />
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
const Arrow = styled.div`
  display: flex;
`

export default React.memo(AssetSwap);
