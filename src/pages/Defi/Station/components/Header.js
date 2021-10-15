import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Networks from "./Networks";
import Slider from "./Slider";


function Header() {
    return (
        <div>
            <Title>
                <TitleWrapper >
                    {/* <Image params={params} /> */}
                    <p
                        className={
                            window.innerWidth > 1088
                                ? "Roboto_30pt_Black"
                                : "Roboto_40pt_Black"
                        }
                    >
                        Charger List
                    </p>
                    <TotalValue>
                        <Text className={"Roboto_20pt_Regular"}>Total Value Locked</Text>
                        <Value className={"Roboto_30pt_Medium "}>$ 000,000,000,000.00</Value>
                    </TotalValue>
                </TitleWrapper>
            </Title>
            <Line />
            <Networks />
            <Slider />
        </div>

    )
}
const Line = styled.div`
  height: 2px;
  margin: 40px 10px 0px 10px;
  width: auto;
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
const TotalValue = styled.div``;
const Text = styled.div`
height: 26px;
font-size: 20px;
text-align: center;
color: var(--gray-10);
`;
const Value = styled.div``;
export default Header;