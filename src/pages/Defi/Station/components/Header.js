import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Networks from "./Networks";
import Slider from "./Slider";
import SortBy from "./SortBy";


function Header({ setNetwork, network, setParams, params, tvl }) {

    return (
        <div>
            <Title>
                <TitleWrapper >
                    {/* <Image params={params} /> */}
                    <p className={window.innerWidth > 1088 ? "Roboto_30pt_Black" : "Roboto_40pt_Black"}>
                        Charger List
                    </p>
                    <TotalValue>
                        <Text className="Roboto_20pt_Regular">Total Value Locked</Text>
                        <Value className="Roboto_30pt_Medium ">$ {tvl}</Value>
                    </TotalValue>
                </TitleWrapper>
            </Title>
            <Line />
            <Test>
                <Networks setNetwork={setNetwork} network={network} />
                <Slider setParams={setParams} params={params} />
                <SortBy />
            </Test>
        </div>
    )
}
const Test = styled.div`
display:flex;
margin-top:40px;
justify-content: flex-end;
gap:16px;
`
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
const TitleWrapper = styled.div`
display:flex;
justify-content: space-between	;
align-items: flex-end;
`
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