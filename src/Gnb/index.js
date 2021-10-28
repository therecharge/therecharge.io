import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Language from "../Components/Desktop/Language";
import { HashLink } from "react-router-hash-link";
import WalletConnect from "../Components/Common/WalletConnect";
import { useRecoilState } from "recoil";
import {
  modalPoolOpenState,
  modalSwapOpenState,
  modalPool2OpenState,
} from "../store/modal";

function Gnb() {
  const { t, i18n } = useTranslation();
  const [black, setBlack] = useState(false);

  const [modalPoolOpen, setModalPoolOpen] = useRecoilState(modalPoolOpenState);
  const [modalSwapOpen, setModalSwapOpen] = useRecoilState(modalSwapOpenState);
  const [modalPool2Open, setModalPool2Open] = useRecoilState(
    modalPool2OpenState
  );

  // const homeSection = useScrollSection('home');
  // const aboutSection = useScrollSection('about');

  const listener = (e) => {
    if (window.scrollY > 0) {
      setBlack(true);
    }
    if (window.scrollY == 0) {
      setBlack(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  });

  return (
    <Container
      style={
        black
          ? { backgroundColor: "#000000", borderBottom: "1px solid white" }
          : { backgroundColor: "#02051c" }
      }
    >
      <SubContainer>
        <HashLink
          className="logo"
          to={"/"}
          // onClick={() => {
          //   setModalPoolOpen(false);
          //   setModalPool2Open(false);
          //   setModalSwapOpen(false);
          // }}
        >
          <Logo>
            <img src="/logo.png" />

            <a className="Roboto_25pt_Regular">The Recharge</a>
          </Logo>
        </HashLink>
        <Nav>
          <HashLink
            className="content"
            to={"/"}
            // onClick={() => {
            //   setModalPoolOpen(false);
            //   setModalPool2Open(false);
            //   setModalSwapOpen(false);
            // }}
          >
            <div className="dropdown Roboto_16pt_Regular">
              <a
                style={{
                  width: "70px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Overview
              </a>
            </div>
          </HashLink>
          <HashLink
            className="content"
            to={"/defi/station"}
            // onClick={() => {
            //   setModalPoolOpen(false);
            //   setModalPool2Open(false);
            //   setModalSwapOpen(false);
            // }}
          >
            <div className="dropdown Roboto_16pt_Regular">
              <a
                style={{
                  width: "125px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Charging Station
              </a>
            </div>
          </HashLink>
          <HashLink
            className="content"
            to={"/defi/swap"}
            // onClick={() => {
            //   setModalPoolOpen(false);
            //   setModalPool2Open(false);
            //   setModalSwapOpen(false);
            // }}
          >
            <div className="dropdown Roboto_16pt_Regular">
              <a
                style={{
                  width: "115px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Recharge Swap
              </a>
            </div>
          </HashLink>
        </Nav>
        {/* <Language /> */}
        <WalletConnectContainer>
          <WalletConnect
            need="2"
            notConnected="Wallet Connect"
            wrongNetwork="Change network"
            w="192px"
            h="40px"
            fontsize="20px"
            fontClass="Roboto_20pt_Light"
          />
        </WalletConnectContainer>
      </SubContainer>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  // width: 1920px;
  width: 100%;
  min-width: 1088px;
  height: 80px;
  z-index: 6;
  background-color: black;
  a {
    text-decoration: none;
  }
`;
const SubContainer = styled.div`
  display: flex;
  width: 1080px;
  margin: auto auto;
  .logo {
    display: flex;
  }
  .lang {
    margin: auto;
    margin-left: 0px;
    margin-right: 0px;
    color: #ffffff;
    text-decoration: none;
    font-weight: bold;
  }
`;

const Logo = styled.div`
  display: flex;
  margin: auto auto;
  margin-left: 20px;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
  }

  a {
    margin-left: 10px;
  }
`;

const Nav = styled.div`
  display: flex;
  // width: 30%;
  margin: auto auto;
  margin-right: 0px;
  a:hover {
    font-family: Roboto;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.31;
    letter-spacing: normal;
    text-align: left;
    color: var(--yellow);
  }

  .dropdown {
    align-items: center;
    display: flex;
    margin: auto auto;
    padding-right: 40px;
    height: 60px;

    // a {
    //   color: #ffffff;
    // }
  }
  .dropdownContent {
    display: none;
    position: absolute;
    top: 75px;
    min-width: 9%;
    padding: 10px 35px 10px 15px;
    margin-left: -15px;
    background-color: black;

    a {
      color: var(--gray-20);
    }
    a: hover {
      color: #ffffff;
    }
    div {
      margin: 10px 0;
    }
    div:hover {
    }
    .unactive {
      color: var(--gray-20);
    }
  }
  .dropdown:hover .dropdownContent {
    display: block;
  }
`;

const ConnectWallet = styled.div`
  margin: auto 15px;
  margin-right: 20px;
  padding: 5px 10px;
  color: gray;

  border: 1px solid var(--yellow);
  border-radius: 30px;
  cursor: pointer;

  &:hover {
    background-color: var(--yellow);
    color: var(--white);
  }
`;
const WalletConnectContainer = styled.div`
  display: flex;
  height: 40px;
  margin: auto 0;
`;

export default Gnb;
