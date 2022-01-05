import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Language from "../../Components/Desktop/Language";
import { HashLink } from "react-router-hash-link";
import { useRecoilState } from "recoil";

function Gnb() {
  const { t, i18n } = useTranslation();
  const [black, setBlack] = useState(false);

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
        <Logo>
          <HashLink
            to={"/#home"}
          // onClick={() => {
          //   setModalPoolOpen(false);
          //   setModalPool2Open(false);
          //   setModalSwapOpen(false);
          // }}
          >
            <img src="/logo.png" />
          </HashLink>
        </Logo>
        <Nav>
          <HashLink to={"/"}>
            <div className="dropdown">
              <a className="title Roboto_16pt_Regular">Home</a>
            </div>
          </HashLink>
          <div className="dropdown">
            <HashLink to={"/about#aboutSection1"}>
              <a className="title Roboto_16pt_Regular">About</a>
            </HashLink>
            <div className="dropdownContent">
              <HashLink to={"/about#aboutSection1"}>
                <div>
                  <a className="Roboto_14pt_Regular">Ecosystem</a>
                </div>
              </HashLink>
              <HashLink to={"/about#aboutSection2"}>
                <div>
                  <a className="Roboto_14pt_Regular">Recharge Virtuous Cycle</a>
                </div>
              </HashLink>
              <HashLink to={"/about#aboutSection3"}>
                <div>
                  <a className="Roboto_14pt_Regular">Team members</a>
                </div>
              </HashLink>
              <HashLink to={"/about#aboutSection4"}>
                <div>
                  <a className="Roboto_14pt_Regular">Advisors</a>
                </div>
              </HashLink>
              <HashLink to={"/about#aboutSection5"}>
                <div>
                  <a className="Roboto_14pt_Regular">Medium</a>
                </div>
              </HashLink>
              <HashLink to={"/about#aboutSection6"}>
                <div>
                  <a className="Roboto_14pt_Regular">Recharge is on</a>
                </div>
              </HashLink>
            </div>
          </div>
          <div className="dropdown">
            <HashLink to={"/recharge#rechargeSection1"}>
              <a className="title Roboto_16pt_Regular">Recharge Token</a>
            </HashLink>
            <div className="dropdownContent">
              <HashLink to={"/recharge#rechargeSection1"}>
                <div>
                  <a className="Roboto_14pt_Regular">Features</a>
                </div>
              </HashLink>
              <HashLink to={"/recharge#rechargeSection2"}>
                <div>
                  <a className="Roboto_14pt_Regular">Distribution</a>
                </div>
              </HashLink>
              <HashLink to={"/recharge#rechargeSection3"}>
                <div>
                  <a className="Roboto_14pt_Regular">NFT</a>
                </div>
              </HashLink>
              <HashLink to={"/recharge#rechargeSection4"}>
                <div>
                  <a className="Roboto_14pt_Regular">Governance</a>
                </div>
              </HashLink>
              <HashLink to={"/recharge#rechargeSection5"}>
                <div>
                  <a className="Roboto_14pt_Regular">Exchanges</a>
                </div>
              </HashLink>
            </div>
          </div>
          <div className="dropdown">
            <HashLink to={"/docs/1#whitepaper"}>
              <a className="title Roboto_16pt_Regular">Docs</a>
            </HashLink>
            <div className="dropdownContent">
              <HashLink to={"/docs/1#whitepaper"}>
                <div>
                  <a className="Roboto_14pt_Regular">WhitePaper</a>
                </div>
              </HashLink>

              {/*<div className="unactive" style={{ cursor: "not-allowed" }}>*/}
              {/*  Onepager*/}
              {/*</div>*/}
              <div>
                <a
                  className="Roboto_14pt_Regular"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.open(
                      "https://www.certik.org/projects/therecharge",
                      "_blank"
                    );
                  }}
                >
                  Token Audit
                </a>
              </div>
              <HashLink
                to={"/docs/2#disclaimer"}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                <div>
                  <a className="Roboto_14pt_Regular">Disclaimer</a>
                </div>
              </HashLink>
              <HashLink
                to={"/docs/3#cidownload"}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                <div>
                  <a className="Roboto_14pt_Regular">CI Download</a>
                </div>
              </HashLink>
              <div style={{ cursor: "pointer" }}>
                <a
                  className="Roboto_14pt_Regular"
                  onClick={() => {
                    window.open(t("Docs/userGuide"), "_blank");
                  }}
                >
                  User Guide
                </a>
              </div>
            </div>
          </div>
        </Nav>
        <Language />
        <LaunchApp
          className="launchApp"
          onClick={() => {
            window.open("https://defi.therecharge.io/", "_blank");
          }}
        >
          <div className="wording Roboto_16pt_Bold">Launch App</div>
        </LaunchApp>
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
  a {
    text-decoration: none;
  }
`;
const SubContainer = styled.div`
  display: flex;
  width: 1080px;
  margin: auto auto;
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
  margin: auto auto;
  margin-left: 20px;
  img {
    width: 40px;
    height: 40px;
  }
`;

const Nav = styled.div`
  display: flex;
  // width: 30%;
  margin: auto auto;
  margin-right: 0px;

  .dropdown {
    align-items: center;
    display: flex;
    margin: auto auto;
    padding: 0 20px;
    height: 60px;

    a {
      color: #ffffff;
    }

    .title:hover {
      color: var(--yellow);
    }
  }
  .dropdownContent {
    display: none;
    position: absolute;
    top: 65px;
    min-width: 9%;
    padding: 10px 35px 10px 15px;
    margin-left: -15px;
    border-radius: 10px;
    background-color: var(--black-30);

    a: hover {
      color: var(--yellow);
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
  .dropdownContent:hover .dropdown {
    .title {
      color: var(--yellow);
    }
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
  margin: auto auto;
`;

const LaunchApp = styled.div`
  display: flex;
  margin: auto 0;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 160px;
  border-radius: 210px;
  box-shadow: 0 0 10px 0 rgba(255, 255, 255, 0.3);
  background-color: var(--yellow);
  cursor: pointer;
`;

export default Gnb;
