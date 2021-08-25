import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as RCGeth } from "./assets/RCGETH.svg";
import { ReactComponent as RCGht } from "./assets/RCGHT.svg";
import { ReactComponent as Open } from "./assets/dropdown-close.svg";
import { ReactComponent as Close } from "./assets/dropdown-open.svg";
export default function Dropdown({
  Image = RCGeth,
  symbol = "RCG",
  network = "(Ethereum Network)",
  title = "FROM",
  recipe,
  setRecipe,
  unselectedList,
  unselectedList1,
  unselectedList2,
  unselectedList3,
  unselectedList4,
}) {
  const [open, setOpen] = useState(false);

  /**
   * 토큰 리스트
   * FROM LIST: 고정 -> RCG_ht, RCG_eth, RCG_bnb, FUP
   * TO LIST: from에 따라 변동
   *
   * 체인지 버튼 필요:아직없음
   *
   * selected: 리스트에서 선택한 토큰
   * unselected: 리스트에서 선택한 토큰 제외한 나머지 토큰들
   *
   * swap 버튼 필요:아직없음
   */
  return (
    <Container>
      <Title className="Roboto_40pt_Black">{title}</Title>
      <List>
        <Selected
          style={{ margin: "40px 0", cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        >
          <Image style={{ width: "80px", height: "80px" }} />
          <Coin>
            <Upside className="Roboto_30pt_Bold">{symbol}</Upside>
            <Downside className="Roboto_16pt_Regular">{network}</Downside>
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
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (direction === "from") {
                        setRecipe({
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
                      <Image style={{ width: "80px", height: "80px" }} />
                      <Coin>
                        <Upside className="Roboto_30pt_Bold">{token[0]}</Upside>
                        <Downside className="Roboto_16pt_Regular">
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
`;
const Upside = styled.div`
  margin: auto 0;
  margin-bottom: 0px;
`;
const Downside = styled.div`
  margin: auto 0;
  margin-top: 0px;
`;
const Title = styled.div``;
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
    margin-left: 60px;
  }
`;
const Selected = styled.div`
  display: flex;
  width: 100%;
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
`;
const ListContainer = styled.div``;
const UnSelected = styled.div`
  display: flex;
  width: 100%;

  .unselected {
    display: flex;

    margin: 20px 0;
  }
`;
