import React from "react";
import styled from "styled-components";
//store
import { useRecoilState } from "recoil";
import { requireNetworkState } from "../../../../store/web3";

function Networks({ setNetwork, network }) {
  const [requireNetwork, setRequireNetwork] = useRecoilState(
    requireNetworkState
  );
  return (
    <Container>
      <Content>
        <div
          onClick={() => {
            // console.log(network);
            setNetwork("ERC");
            setRequireNetwork(1);
          }}
          className="network"
          style={{ cursor: "pointer" }}
        >
          <Button type="Locked" text="ERC-20" />
        </div>

        <div
          onClick={() => {
            // console.log(network);
            setNetwork("BEP");
            setRequireNetwork(56);
          }}
          className="network"
          style={{ cursor: "pointer" }}
        >
          <Button type="Locked" text="BEP-20" />
        </div>

        <div className="disable network">
          <Button
            onClick={() => setNetwork("HRC")}
            type="Locked"
            text="HRC-20"
          />
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
    margin: 0 auto;
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
        display: flex;
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

export default Networks;

function Button({ text, setParams }) {
  return (
    <ContainerButton
    //   onClick={() => (setParams ? setParams(params) : console.log(""))}
    >
      <div className="box">
        <img
          src={
            text === "ERC-20"
              ? "/ic_erc.png"
              : text === "BEP-20"
                ? "/ic_bnb.png"
                : text === "HRC-20"
                  ? "/ic_ht.png"
                  : ""
          }
        />
        <p
          className={
            window.innerWidth > 1088 ? "Roboto_24pt_Black" : "Roboto_30pt_Black"
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
    justify-content: center;
    align-items: center;
    min-width: 210px;
    height: 100px;
    background-color: var(--black-30);
    border-radius: 10px;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */

    @media (min-width: 1088px) {
      min-width: 349px;
      margin: 0;
    }
  }
  .box::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera*/
  }
  img {
    height: 50px;
  }
  p {
    margin-left: 16px;
  }
`;
