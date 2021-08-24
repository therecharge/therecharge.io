import React, { useState } from "react";
import styled from "styled-components";
import { ReactComponent as RCGeth } from "./assets/RCGETH.svg";
import { ReactComponent as Open } from "./assets/dropdown-close.svg";
import { ReactComponent as Close } from "./assets/dropdown-open.svg";
export default function Dropdown({
  Image = RCGeth,
  symbol = "RCG",
  network = "(Ethereum Network)",
  title = "FROM",
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
        <Selected>
          <Image />
          <Coin>
            <Upside className="Roboto_30pt_Regular">{symbol}</Upside>
            <Downside className="Roboto_30pt_Light">{network}</Downside>
          </Coin>
          <Btn onClick={() => setOpen(!open)}>
            {open ? <Close fill="white" /> : <Open fill="white" />}
          </Btn>
        </Selected>
        <ListContainer>
          <UnSelected>
            <Image />
            <Coin>
              <Upside className="Roboto_30pt_Regular">{symbol}</Upside>
              <Downside className="Roboto_30pt_Light">{network}</Downside>
            </Coin>
          </UnSelected>
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
  background-color: #35374b;
  min-height: 160px;
  border-radius: 20px;
  gap: 20px;
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
`;
