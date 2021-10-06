import styled from "styled-components";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import WalletConnect from "../../../Component/Components/Common/WalletConnect";
import { useTranslation } from "react-i18next";

function Gnb({ getTitle }) {
  const sidemenuInitialState = {
    home: false,
    about: false,
    recharge: false,
    defi: false,
    docs: false,
  };
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidemenuOpen, setSidemenuOpen] = useState(sidemenuInitialState);
  const open = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Container>
      <Logo style={{ marginRight: "40px" }}>
        <HashLink
          to={"/"}
          onClick={() => {
            setMenuOpen(false);
            setSidemenuOpen({
              ...sidemenuInitialState,
              home: true,
            });
          }}
        >
          <img src="/logo.png" />
        </HashLink>
      </Logo>
      <div className="state Roboto_30pt_Black">{getTitle()}</div>
      <div className="hamButton" onClick={() => open()}>
        <img src={menuOpen ? "/ic_menu_close.svg" : "/ic_menu.svg"} />
      </div>
      <div
        className="nav"
        style={menuOpen ? { display: "flex" } : { display: "none" }}
      >
        <WalletConnect
          need="2"
          notConnected="Connect Wallet"
          wrongNetwork="Change network"
          m="40px auto"
          w="470px"
          h="70px"
          fontsize="20px"
        />
        <div className="dropdown">
          <div
            className={
              sidemenuOpen.home ? "Roboto_35pt_Black" : "Roboto_35pt_Nomal"
            }
          >
            <HashLink
              to={"/"}
              onClick={() => {
                setMenuOpen(false);
                setSidemenuOpen({
                  ...sidemenuInitialState,
                  home: true,
                });
              }}
            >
              Home
            </HashLink>
          </div>
        </div>
        <div className="dropdown">
          <Link
            onClick={() => {
              setSidemenuOpen({
                ...sidemenuInitialState,
                about: !sidemenuOpen.about,
              });
            }}
            className={
              sidemenuOpen.about ? "Roboto_35pt_Black" : "Roboto_35pt_Nomal"
            }
          >
            About
          </Link>
          <div
            className="dropdownContent"
            style={
              sidemenuOpen.about ? { display: "block" } : { display: "none" }
            }
          >
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/about#aboutSection1"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Ecosystem
              </HashLink>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/about#aboutSection2"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Recharge Virtuous Cycle
              </HashLink>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/about#aboutSection3"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Team members
              </HashLink>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/about#aboutSection4"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Advisors
              </HashLink>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/about#aboutSection5"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Medium
              </HashLink>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/about#aboutSection6"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Recharge is on
              </HashLink>
            </div>
          </div>
        </div>

        <div className="dropdown">
          <Link
            onClick={() => {
              setSidemenuOpen({
                ...sidemenuInitialState,
                recharge: !sidemenuOpen.recharge,
              });
            }}
            className={
              sidemenuOpen.recharge ? "Roboto_35pt_Black" : "Roboto_35pt_Nomal"
            }
          >
            Recharge Token
          </Link>
          <div
            className="dropdownContent"
            style={
              sidemenuOpen.recharge ? { display: "block" } : { display: "none" }
            }
          >
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/recharge#rechargeSection1"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Features
              </HashLink>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/recharge#rechargeSection3"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Distribution
              </HashLink>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/recharge#rechargeSection4"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Governance
              </HashLink>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/recharge#rechargeSection5"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Exchanges
              </HashLink>
            </div>
          </div>
        </div>

        <div className="dropdown Roboto_35pt_Nomal">
          <Link
            onClick={() => {
              setSidemenuOpen({
                ...sidemenuInitialState,
                defi: !sidemenuOpen.defi,
              });
            }}
            className={
              sidemenuOpen.defi ? "Roboto_35pt_Black" : "Roboto_35pt_Nomal"
            }
          >
            De-Fi
          </Link>

          <div
            className="dropdownContent"
            style={
              sidemenuOpen.defi ? { display: "block" } : { display: "none" }
            }
          >
            <div>
              <HashLink
                to={"/defi"}
                className="Roboto_25pt_Regular"
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                <span className="on">Station</span>
              </HashLink>
              <div style={{ display: "flex", gap: "50px" }}>
                <HashLink
                  to={"/defi/station"}
                  className="Roboto_25pt_Regular"
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                >
                  Station
                </HashLink>
                <HashLink
                  to={"/defi/swap"}
                  className="Roboto_25pt_Regular"
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                >
                  Swap
                </HashLink>
              </div>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/defi#mypools"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                <span className="on">My Pools</span>
              </HashLink>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/defi#analytics"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                Analytics
              </HashLink>
            </div>
          </div>
        </div>

        <div className="dropdown">
          <Link
            onClick={() => {
              setSidemenuOpen({
                ...sidemenuInitialState,
                docs: !sidemenuOpen.docs,
              });
            }}
            className={
              sidemenuOpen.docs ? "Roboto_35pt_Black" : "Roboto_35pt_Nomal"
            }
          >
            Docs
          </Link>
          <div
            className="dropdownContent"
            style={
              sidemenuOpen.docs ? { display: "block" } : { display: "none" }
            }
          >
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/docs/1"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                WhitePaper
              </HashLink>
            </div>
            <div>
              <a className="unactive Roboto_25pt_Regular">
                <span className="on">Onepager</span>
                <span className="off">Coming Soon</span>
              </a>
            </div>
            <div>
              <a className="Roboto_25pt_Regular">
                <a
                  href="https://www.certik.org/projects/therecharge"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <span className="on">Token Audit</span>
                </a>
              </a>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.scrollTo(0, 0);
                  setMenuOpen(false);
                }}
                to={"/docs/2"}
              >
                Disclaimer
              </HashLink>
            </div>
            <div>
              <HashLink
                className="Roboto_25pt_Regular"
                to={"/docs/3"}
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                CI Download
              </HashLink>
            </div>
            <div>
              <a
                className="Roboto_25pt_Regular"
                onClick={() => {
                  window.open(t("Docs/userGuide"), "_blank");
                  setMenuOpen(false);
                }}
              >
                User Guide
              </a>
            </div>
          </div>
        </div>
        <Footer>
          <div className="footer">
            <div className="header">
              <a
                className="Roboto_20pt_Regular"
                href="mailto:info@therecharge.io"
              >
                info@therecharge.io<span>〉</span>
              </a>
            </div>
            <div className="sns">
              <div
                className="logo"
                onClick={() => {
                  window.open("https://github.com/therecharge", "_blank");
                }}
              >
                <img src="/footer1.png" />
              </div>
              <div
                className="logo"
                onClick={() => {
                  window.open(
                    i18n.language == "en"
                      ? "https://medium.com/therecharge"
                      : "https://medium.com/therecharge-kr",
                    "_blank"
                  );
                }}
              >
                <img src="/footer2.png" />
              </div>
              <div
                className="logo"
                onClick={() => {
                  window.open("https://blog.naver.com/therecharge", "_blank");
                }}
              >
                <img src="/ic_naver.svg" />
              </div>
              <div
                className="logo"
                onClick={() => {
                  window.open("https://twitter.com/TheRecharge_Ad", "_blank");
                }}
              >
                <img src="/footer3.png" />
              </div>
              <div
                className="logo"
                onClick={() =>
                  (window.location =
                    i18n.language == "en"
                      ? "https://t.me/therecharge_official"
                      : "https://t.me/therecharge_officialkr")
                }
              >
                <img src="/footer4.png" />
              </div>
            </div>
            <div className="sns">
              <div
                className="logo"
                onClick={() => {
                  window.open(
                    "https://etherscan.io/token/0xe74bE071f3b62f6A4aC23cA68E5E2A39797A3c30",
                    "_blank"
                  );
                }}
              >
                <img src="/footer5.png" />
              </div>
              <div
                className="logo"
                onClick={() => {
                  window.open(
                    "https://bscscan.com/token/0x2D94172436D869c1e3c094BeaD272508faB0d9E3",
                    "_blank"
                  );
                }}
              >
                <img src="/footer7.png" />
              </div>
              <div
                className="logo"
                onClick={() => {
                  window.open(
                    "https://hecoinfo.com/token/0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b",
                    "_blank"
                  );
                }}
              >
                <img src="/footer6.png" />
              </div>
            </div>
            <div className="bottom Roboto_15pt_Regular">
              @ 2021 Recharge Labs Ltd.
            </div>
          </div>
        </Footer>
        <Lang
          onClick={() =>
            i18n.changeLanguage(i18n.language != "en" ? "en" : "ko")
          }
        >
          <div className="Roboto_35pt_Black">
            <img src="/lang/ic-eng.svg" />
            <span className={i18n.language == "en" ? "bold" : ""}>ENG</span>
          </div>
          <div className="Roboto_35pt_Black">
            <img src="/lang/ic-kor.svg" />
            <span className={i18n.language == "ko" ? "bold" : ""}>KOR</span>
          </div>
        </Lang>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  display: flex;
  top: 0;
  width: 100%;
  height: 100.5px;
  z-index: 10;
  background-color: #000000;
  border-bottom: 1px solid var(--white);

  .state {
    margin: auto;
    text-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
  }
  .lang {
    margin: auto auto;
    margin-right: 50px;
  }
  .hamButton {
    margin: auto;
    margin-left: 0px;
    margin-right: 50px;
    width: 30px;
    height: 30px;
  }

  .nav {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 102px;
    right: 0;
    width: 630px;
    height: max-content;
    min-height: 100%;
    background-color: rgba(0, 0, 0, 0.95);
    border-left: 1px solid var(--white);

    .dropdown {
      display: flex;
      flex-direction: column;
      margin: 20 auto;
      margin-bottom: 40px;
      align-items: center;

      a {
        text-decoration: none;
      }
    }

    .dropdownContent {
      margin-top: 20px;
      background-color: black;
      text-align: center;

      a {
        // color: #7e7e7e;
      }

      a:active {
        color: white;
      }
      div {
        margin: 15px 0;
      }
    }
  }
  .unactive {
    .on {
      display: block;
      text-align: center;
    }
    .off {
      display: none;
    }
  }

  .unactive:hover {
    .on {
      display: none;
    }
    .off {
      color: #7e7e7e;
      display: block;
      animation: fadein 1s;
      -moz-animation: fadein 1s; /* Firefox */
      -webkit-animation: fadein 1s; /* Safari and Chrome */
      -o-animation: fadein 1s; /* Opera */
    }
    @keyframes fadein {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @-moz-keyframes fadein {
      /* Firefox */
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @-webkit-keyframes fadein {
      /* Safari and Chrome */
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @-o-keyframes fadein {
      /* Opera */
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
`;

const Logo = styled.div`
  margin: auto;
  margin-left: 50px;
  margin-right: 0px;
  img {
    width: 40px;
    height: 40px;
  }
`;

const ConnectWallet = styled.div`
  display: flex;
  margin: 80px auto;
  width: 470px;
  height: 70px;
  border: solid 2px var(--yellow);
  border-radius: 210px;

  span {
    margin: auto;
  }

  &:active {
    background-color: var(--yellow);
    color: var(--white);
`;

const Footer = styled.div`
  display: flex;
  margin: 0 auto;
  margin-top: 40px;
  // margin-bottom: 10vh;
  margin-bottom: 0px;

  .footer {
    display: flex;
    flex-direction: column;
    margin: 0 auto;

    .header {
      margin: 40px auto;
      width: 302px;
      height: 53px;
      padding: 14px 79px 13px 61px;
      text-align: center;
      border: 1px solid var(--yellow);
      border-radius: 27px;
      box-sizing: border-box;

      span {
        margin-left: 20px;
        margin-right: -50px;
        color: var(--yellow);
      }
      a {
        text-decoration: none;
      }
    }

    .sns {
      display: flex;
      margin: 0 auto;
      margin-top: 40px;
      .logo {
        margin: 0 20px;
        cursor: pointer;
        img {
          width: 50px;
          height: 50px;
        }
      }
    }
    .bottom {
      margin: 0 auto;
      margin-top: 40px;
      margin-bottom: 0px;
    }
  }
`;

const Lang = styled.div`
  display: flex;
  margin: auto auto;
  margin-top: 40px;
  flex-wrap: wrap;
  gap: 80px;

  div {
    display: flex;
    margin: auto auto;
    gap: 20px;

    img {
      height: 46px;
    }

    span {
      font-weight: 400;
    }

    .bold {
      font-weight: bold;
    }
  }
`;

export default Gnb;
