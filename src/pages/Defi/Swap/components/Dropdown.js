import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as RCGeth } from "./assets/RCGETH.svg";
import { ReactComponent as RCGht } from "./assets/RCGHT.svg";
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
  const [requireNetwork, setRequireNetwork] = useRecoilState(requireNetworkState);

  return (
    <Container>
      <Title className="Roboto_30pt_Black">{title}</Title>
      <List>
        <Selected onClick={() => setOpen(!open)}>
          <div className="img">
            <Image style={{ width: "100%", height: "100%" }} />
          </div>
          <Coin>
            <Upside className="Roboto_30pt_Bold">{symbol}</Upside>
            <Downside className="Roboto_15pt_Regular">{network}</Downside>
          </Coin>
          <Btn>{open ? <Close fill="white" /> : <Open fill="white" />}</Btn>
        </Selected>
        <ListContainer>
          {open &&
            unselectedList.map((token, i) => {
              let direction = title.toLowerCase();
              if (recipe[direction].index !== i) {
                let Image = token[2];
                return (
                  <UnSelected
                    style={{ cursor: "pointer", height: "100px" }}
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
                              token[1] === "(Huobi ECO Chain Network)"
                                ? "(Ethereum Network)"
                                : "(Huobi ECO Chain Network)",
                            image:
                              token[1] === "(Huobi ECO Chain Network)"
                                ? RCGeth
                                : RCGht,
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
  border-radius: 20px;
  // gap: 20px;
  svg {
    margin: auto 0;
    // margin-left: 60px;
  }
  @media (min-width: 1088px) {
    padding: 20px 40px;
    min-height: 100px;
  }
`;
const Selected = styled.div`
  margin: 40px 0;
  cursor: pointer;
  display: flex;
  width: 100%;
  @media (min-width: 1088px) {
    margin: 0;
    // margin-top: 0px;
  }

  .img{
    margin-left: 40px;
    width: 80px;
    height: 80px;
  
    @media (min-width: 1088px) {
      margin-left: 0;
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
    margin-right: 0px;
  }
`;
const ListContainer = styled.div`
  margin-top: 20px;
`;
const UnSelected = styled.div`
  display: flex;
  width: 100%;
  // margin-top: 20px;

  .unselected {
    display: flex;
    margin: 20px 0;

    .img {
      margin-left: 40px;
      width: 80px;
      height: 80px;

      @media (min-width: 1088px) {
        margin-left: 0;
        width: 60px;
        height: 60px;
      }
    }
  }
`;
