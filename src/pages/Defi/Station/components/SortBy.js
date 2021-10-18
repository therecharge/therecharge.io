import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import { requireNetworkState } from "../../../../store/web3";
import { ReactComponent as DropdownClose } from "./List/assets/dropdown-close.svg";
import { ReactComponent as DropdownOpen } from "./List/assets/dropdown-open.svg";

function SortBy({ setParams, params }) {
  const [t] = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [clickSort, SetclickSort] = useState("Default")
  // const [requireNetwork, setRequireNetwork] = useRecoilState(
  //   requireNetworkState
  // );
  let Samples = ["Default", "APY", "TVL", "Status"];
  return (
    <Sortby onClick={() => { setOpen(!isOpen) }}>
      <Text className={"Roboto_20pt_Black_L "}>Sort by</Text>
      <BoxContainer>
        <Box className={"Roboto_20pt_Regular"}>{clickSort}</Box>
        <BtnWrapper>
          <DropdownClose fill={"#fff"} />
        </BtnWrapper>
      </BoxContainer>
      {isOpen === false ?
        <div></div>
        :
        <DropDownContents>
          {Samples.map((sample) => {
            return (
              <DropdownList
                style={{ cursor: "not-allowed" }}
                className={"Roboto_20pt_Regular"}
                onClick={() => {
                  // SetclickSort(sample)
                  // setRequireNetwork(1)
                }}
              >{sample}</DropdownList>
            )
          })}

        </DropDownContents>
      }
    </Sortby>

  );
}
const Sortby = styled.div`
cursor: pointer;
position:relative;
`;
const Text = styled.div`
margin-bottom:4px;
margin-left:20px;

`;
const Box = styled.div`
display:flex;
margin-left:20px;
height: 42px;
  display: flex;
    justify-content: flex-start;
    align-items: center;

  `;
const BoxContainer = styled.div`
  display:flex;
  width: 196px;
  height: 42px;
  border-radius: 30px;
  background-color: var(--black-30);
`;
const BtnWrapper = styled.div`
display:flex;
align-items: center;
justify-content: space-between;
margin: auto;
margin-right: 16px;
`
const DropDownContents = styled.div`
  width: 196px;
  height: 204px;
  border-radius: 30px;
  box-shadow: 0 0 5px 0 rgba(255, 255, 255, 0.16);
  background-color: rgba(0, 0, 0, 0.9);
  margin-top:8px;
  z-index:0;
  position:absolute;
  z-index: 1;
`
const DropdownList = styled.div`
padding: 10px 0px;
&:hover {
  border-radius: 30px;
       background-color: #1c1e35;
   }
`
const Container = styled.div`
  margin-top: 40px;
  display: flex;
  width: 100%;

  @media (min-width: 1088px) {
    justify-content: center;
  }
`;


export default React.memo(SortBy);