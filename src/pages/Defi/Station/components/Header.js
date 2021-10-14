import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
//components
// import Image from "./List/image.js";
// import Row from "./List/row.js";
// /* Libraries */
// import {
//     getChargerList,
//     createContractInstance,
//     getTokenInfo,
//     getChargerInfo,
// } from "../../../../lib/read_contract/Station";
// /* Store */
// import { web3ReaderState } from "../../../../store/read-web3";
// import { ReactComponent as DropdownClose } from "./List/assets/dropdown-close.svg";
// import { ReactComponent as DropdownOpen } from "./List/assets/dropdown-open.svg";
// const loading_data = [
//     {
//         address: "0x0",
//         // apy: "-",
//         name: "Loading List..",
//         period: [1625022000, 14400],
//         redemtion: 200,
//         symbol: ["RCG", "RCG"],
//         token: [
//             "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30", // 이더리움 토큰주소
//             "0xe74be071f3b62f6a4ac23ca68e5e2a39797a3c30",
//         ],
//         tvl: "-",
//         type: "flexible",
//     },
// ];
// import Networks from "./Networks";
// import Slider from "./Slider";

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
                        <div>Total Value Locked</div>
                        <div>$ 000,000,000,000.00</div>
                    </TotalValue>
                </TitleWrapper>
            </Title>
            <Line />
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
  @media (min-width: 1088px) {
    display: flex;
    flex-direction: row;
    justify-content: space-between	;
    align-items: flex-end;
  }
`;
const TitleWrapper = styled.div`
display:flex;
justify-content: space-between	;
`
const TotalValue = styled.div``;
export default Header;