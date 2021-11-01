import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Networks from "./Networks";
import Slider from "./Slider";
import SortBy from "./SortBy";

// const convertNum = (num, { unitSeparator } = { unitSeparator: false }) => {
//   let newNum;
//   if (typeof num === "string") newNum = Number(num);
//   if (unitSeparator) return newNum.toLocaleString();
//   return newNum.toLocaleString("fullwide", { useGrouping: false });
// };

function Header({ setNetwork, network, setParams, params, tvl }) {
  return (
    <Contain>
      <Title>
        <TitleWrapper>
          {/* <Image params={params} /> */}
          <p className="Roboto_40pt_Black">Charger List</p>
          <TotalValue>
            <Text className="Roboto_20pt_Regular">Total Value Locked</Text>
            <Value className="Roboto_30pt_Medium ">
              {/* $ {convertNum(tvl, { unitSeparator: true })} */}$ {tvl}
            </Value>
          </TotalValue>
        </TitleWrapper>
      </Title>
      <Line />
      <Test>
        <Networks setNetwork={setNetwork} network={network} />
        <Slider setParams={setParams} params={params} />
        <SortBy />
      </Test>
    </Contain>
  );
}
const Test = styled.div`
  display: flex;
  margin-top: 40px;
  justify-content: flex-end;
  gap: 16px;

  @media (max-width: 720px) {
    justify-content: center;
  }
`;
const Line = styled.div`
  height: 2px;
  margin: 40px 10px 0px 00px;
  width: 100%;
  background-color: #9314b2;
  box-shadow: 0px 0px 20px 0.5px white;
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
`;
const Contain = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 1088px) {
    margin: 40px 30px 0px 30px;
  }
`;
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
const TotalValue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const Text = styled.div`
  height: 26px;
  font-size: 20px;
  text-align: center;
  color: var(--gray-10);
`;
const Value = styled.div``;
export default Header;
