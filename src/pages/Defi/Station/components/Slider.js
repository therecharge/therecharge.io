import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function Slider({ setParams, params }) {
  const [t] = useTranslation();
  return (
    <Container>
      <Content>
        <div style={{ cursor: "pointer" }}>
          <Button
            setParams={setParams}
            pam={params}
            type="Locked"
            text="Locked Staking"
          />
        </div>
        <div style={{ cursor: "pointer" }} /*className="disable"*/>
          <Button
            setParams={setParams}
            pam={params}
            type="Flexible"
            text="Flexible Staking"
          />
        </div>
        <div className="disable">
          <Button type="Locked" pam={params} text="LP Locked Staking" />
        </div>
        <div className="disable">
          <Button type="Flexible" pam={params} text="LP Flexible Staking" />
        </div>
      </Content>
    </Container>
  );
}
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

function Button({ type, text, setParams, pam }) {
  let params;
  if (type === "Locked") {
    if (text.includes("LP")) {
      params = {
        type: "Locked",
        isLP: true,
        address: "0x",
      };
    } else {
      params = {
        type: "Locked",
        isLP: false,
        address: "0x",
      };
    }
  } else {
    if (text.includes("LP")) {
      params = {
        type: "Flexible",
        isLP: true,
        address: "0x",
      };
    } else {
      params = {
        type: "Flexible",
        isLP: false,
        address: "0x",
      };
    }
  }
  return (
    <ContainerButton
      onClick={() => {
        type !== pam.type ? setParams(params) : console.log("");
      }}
    >
      <div className="box">
        <img
          className="Roboto_20pt_Black"
          src={
            type === "Locked"
              ? text.includes("LP")
                ? "/ic_lockedstaking_lp.png"
                : "/ic_lockedstaking.svg"
              : text.includes("LP")
              ? "/ic_flexiblestaking_lp.png"
              : "/ic_flexiblestaking.svg"
          }
        />
        <p
          className={
            window.innerWidth > 1088 ? "Roboto_20pt_Black" : "Roboto_30pt_Black"
          }
        >
          {text}
        </p>
      </div>
    </ContainerButton>
  );
}
const ContainerButton = styled.div`
  .box {
    display: flex;
    flex-direction: column;
    min-width: 260px;
    height: 280px;
    background-color: var(--black-30);
    border-radius: 10px;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .box::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  img {
    margin: auto auto;
    margin-bottom: 0px;
    height: 60px;
  }
  p {
    margin: auto auto;
    margin-top: 20px;
  }
  @media (min-width: 1088px) {
    min-width: 260px;
    margin: 0;
    // gap: 5px;
  }
`;
