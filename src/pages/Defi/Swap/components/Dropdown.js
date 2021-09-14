import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as RCGeth } from "./assets/RCGETH.svg";
import { ReactComponent as RCGht } from "./assets/RCGHT.svg";
import { ReactComponent as RCGbnb } from "./assets/RCGBNB.svg";
import { ReactComponent as Open } from "./assets/dropdown-close.svg";
import { ReactComponent as Close } from "./assets/dropdown-open.svg";
//store
import { useRecoilState } from "recoil";
import { requireNetworkState } from "../../../../store/web3";

export default function Dropdown({
  Image = RCGeth,
  symbol = "RCG",
  network = "(Ethereum Network)",
  title = "FROM",
  recipe,
  setRecipe,
  unselectedList,
}) {
  const [open, setOpen] = useState(false);
  const [requireNetwork, setRequireNetwork] = useRecoilState(
    requireNetworkState
  );

  return (
    <Container>
      <Title className="Roboto_30pt_Black">{title}</Title>
      <List
        style={
          open
            ? window.innerWidth < 1088
              ? {
                  borderRadius: "20px 20px 0px 0px",
                  border: "1px solid #9314B2",
                }
              : { borderRadius: "20px 20px 0px 0px" }
            : { borderRadius: "20px" }
        }
      >
        <Selected
          style={
            open
              ? window.innerWidth >= 1088
                ? {
                    borderRadius: "20px 20px 0px 0px",
                    border: "1px solid #9314B2",
                    padding: "18px 0px",
                  }
                : {
                    borderRadius: "20px 20px 0px 0px",
                    padding: "18px 0px",
                  }
              : { borderRadius: "20px" }
          }
          onClick={title === "TO" ? () => {} : () => setOpen(!open)}
        >
          <div
            className="img"
            // style={open ? { marginLeft: "39px" } : {}}
          >
            <Image style={{ width: "100%", height: "100%" }} />
          </div>
          <Coin>
            <Upside
              className={
                window.innerWidth > 1088
                  ? "Roboto_25pt_Black"
                  : "Roboto_30pt_Bold"
              }
            >
              {symbol}
            </Upside>
            <Downside className="Roboto_15pt_Regular">{network}</Downside>
          </Coin>
          <Btn>{open ? <Close fill="white" /> : <Open fill="white" />}</Btn>
        </Selected>
        {open ? <Line /> : <></>}
        <ListContainer
          style={
            open
              ? {
                  borderRadius: "0px 0px 20px 20px",
                  border: "1px solid #9314B2",
                }
              : { borderRadius: "20px" }
          }
        >
          {open &&
            unselectedList.map((token, i) => {
              let direction = title.toLowerCase();
              let j = 0;
              if (recipe[direction].index !== i) {
                let Image = token[2];
                switch (recipe[direction].index) {
                  case 0:
                    j = i - 1;
                    break;
                  case 1:
                    if (i > 0) j = i - 1;
                    else j = i;
                    break;
                  case 2:
                    if (i === 3) j = 2;
                    else j = i;
                    break;
                  default:
                    j = i;
                    break;
                }
                return (
                  <UnSelected
                    style={{
                      cursor: "pointer",
                      backgroundColor: j % 2 !== 0 ? "#35374B" : "#1C1E35",
                      borderRadius:
                        direction === "to" && j === 0
                          ? "0px 0px 20px 20px"
                          : j === 2
                          ? "0px 0px 20px 20px"
                          : "0px",
                    }}
                    // 글로벌 상태 requiredNetwork 설정 필요
                    onClick={() => {
                      if (direction === "from") {
                        setRecipe({
                          ...recipe,
                          from: {
                            token: token[0],
                            network: token[1],
                            image: token[2],
                            index: i,
                          },
                          to: {
                            token: "RCG",
                            network:
                              token[1] === "(Binance Smart Chain Network)"
                                ? "(Ethereum Network)"
                                : "(Binance Smart Chain Network)",
                            image:
                              token[1] === "(Binance Smart Chain Network)"
                                ? RCGeth
                                : RCGbnb,
                            index: 0,
                          },
                        });
                        setRequireNetwork(recipe.chainId[token[1]]);
                        setOpen(!open);
                      } else {
                        setRecipe({
                          ...recipe,
                          to: {
                            token: token[0],
                            network: token[1],
                            image: token[2],
                            index: i,
                          },
                        });
                        setOpen(!open);
                      }
                    }}
                  >
                    <div className="unselected">
                      <div className="img">
                        <Image style={{ width: "100%", height: "100%" }} />
                      </div>
                      <Coin>
                        <Upside className="Roboto_30pt_Bold">{token[0]}</Upside>
                        <Downside className="Roboto_15pt_Regular">
                          {token[1]}
                        </Downside>
                      </Coin>
                    </div>
                  </UnSelected>
                );
              }
            })}
        </ListContainer>
      </List>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  //   width: 100%;
  @media (min-width: 1088px) {
    gap: 16px;
  }
`;

const Upside = styled.div`
  margin: auto 0;
  margin-bottom: 0px;
`;
const Downside = styled.div`
  margin: auto 0;
  margin-top: 0px;

  // @media (min-width: 1088px) {
  //   font-size: 10px;
  // }
`;
const Title = styled.div`
  // @media (min-width: 1088px) {
  //   font-size: 30px;
  // }
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #35374b;
  min-height: 160px;
  position: relative;
  // gap: 20px;
  svg {
    margin: auto 0;
    // margin-left: 60px;
  }
  @media (min-width: 1088px) {
    // padding: 0px 0px 0px 40px;
    min-height: 100px;
    svg {
      width: 50px;
    }
  }
`;
const Selected = styled.div`
  padding: 20px 0;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  width: 100%;

  @media (min-width: 1088px) {
    margin: 0;
    height: 100px;
  }

  .img{
    margin-left: 40px;
    width: 78px;
    height: 78px;
  
    @media (min-width: 1088px) {
      // margin-left: 0;
      width: 60px;
      height: 60px;
    }
`;
const Coin = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;
const Btn = styled.div`
  margin: auto 0;
  margin-left: auto;
  margin-right: 40px;

  @media (min-width: 1088px) {
    margin-right: 40px;
  }
`;
const Line = styled.div`
  height: 1px;
  position: absolute;
  left: 1px;
  top: 161px;
  z-index: 2;
  width: calc(100% - 2px);
  background-color: #1c1e35;

  @media (min-width: 1088px) {
    top: 100px;
    left: 2px;
    width: calc(100% - 3px);
  }
`;
const ListContainer = styled.div`
  position: absolute;
  left: 0;
  top: 160px;
  z-index: 1;
  width: 100%;

  @media (min-width: 1088px) {
    top: 100px;
  }
`;
const UnSelected = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  // margin-top: 20px;

  .unselected {
    display: flex;
    margin: 20px 0;

    .img {
      margin-left: 40px;
      width: 80px;
      height: 80px;

      @media (min-width: 1088px) {
        margin-left: 40px;
        width: 60px;
        height: 60px;
      }
    }
  }
`;
