import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { ReactComponent as DropdownClose } from "./List/assets/dropdown-close.svg";

function Slider({ setParams, params }) {
  const [t] = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [clickType, SetclickType] = useState("All Type")

  let typesParam = [
    {
      name: "All Type",
      type: "ALL",
      isLP: "ALL",
    },
    {
      name: "Locked",
      type: "Locked",
      isLP: false,
    },
    {
      name: "Flexible",
      type: "Flexible",
      isLP: false,
    },
    {
      name: "LP Locked",
      type: "Locked",
      isLP: true,
    },
    {
      name: "LP Flexible",
      type: "Flexible",
      isLP: true,
    },
  ]

  return (
    <Type onClick={() => { setOpen(!isOpen) }}>
      <Text className={"Roboto_20pt_Black_L "}>Type</Text>
      <BoxContainer>
        <Box className={"Roboto_20pt_Regular"}>{clickType}</Box>
        <BtnWrapper>
          <DropdownClose fill={"#fff"} />
        </BtnWrapper>
      </BoxContainer>
      {!isOpen ? <></> :
        <DropDownContents>
          {typesParam.map((typeParam, i) => {
            return (
              <Button
                i={i}
                SetclickType={SetclickType}
                setParams={setParams}
                pam={params}
                type={typeParam.type}
                text={typeParam.name}
                typeParam={typeParam}
              ></Button>
            )
          })}

        </DropDownContents>
      }
    </Type>
    // <Container>
    //   <Content>
    //     <div style={{ cursor: "pointer" }}>
    //       <Button
    //         setParams={setParams}
    //         pam={params}
    //         type="Locked"
    //         text="Locked Staking"
    //       />
    //     </div>
    //     <div style={{ cursor: "pointer" }} /*className="disable"*/>
    //       <Button
    //         setParams={setParams}
    //         pam={params}
    //         type="Flexible"
    //         text="Flexible Staking"
    //       />
    //     </div>
    //     <div className="disable">
    //       <Button type="Locked" pam={params} text="LP Locked Staking" />
    //     </div>
    //     <div className="disable">
    //       <Button type="Flexible" pam={params} text="LP Flexible Staking" />
    //     </div>
    //   </Content>
    // </Container>
  );
}
const Type = styled.div`
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
  height: 250px;
  border-radius: 30px;
  box-shadow: 0 0 5px 0 rgba(255, 255, 255, 0.16);
  background-color: rgba(0, 0, 0, 0.9);
  margin-top:8px;
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
const Content = styled.div`
  display: flex;
  max-width: 1088px;
  white-space: nowrap;
  overflow: auto;
  gap: 0px 20px;
  border
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  a {
    color: white;
  }
  div {
    &:hover{
      background-color: var(--black-20);
      border-radius: 10px;
    }
  }
  .disable {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (min-width: 1088px) {
    gap: 10px;
  }
`;

export default React.memo(Slider);

function Button({ type, text, setParams, pam, typeParam, SetclickType, i }) {
  let params;
  if (type === "ALL") {
    params = {
      type: "ALL",
      isLP: "ALL",
    };
  } else if (type === "Locked") {
    if (text.includes("LP")) {
      params = {
        type: "Locked",
        isLP: true,
      };
    } else {
      params = {
        type: "Locked",
        isLP: false,
      };
    }
  } else {
    if (text.includes("LP")) {
      params = {
        type: "Flexible",
        isLP: true,
      };
    } else {
      params = {
        type: "Flexible",
        isLP: false,
      };
    }
  }
  return (

    <DropdownList
      style={i === 3 || i === 4 ? { cursor: "not-allowed" } : {}}
      className="Roboto_20pt_Regular"
      onClick={i === 3 || i === 4 ?
        () => { } :
        type !== pam.type ?
          () => {
            setParams(params)
            SetclickType(typeParam.name)
          }
          : () => SetclickType(typeParam.name)
      }
    >
      <div className="box">
        {text}
      </div>
    </DropdownList>
  );
}
