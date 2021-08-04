import React from "react";
import styled from "styled-components";

function Footer(props) {
  return (
    <Container>
      <div className="footer Roboto_20pt_Regular">
        <div className="header">
          <a href="mailto:info@therecharge.io">
            info@therecharge.io<span>〉</span>
          </a>
        </div>
        <div className="sns">
          <div
            className="logo"
            onClick={() => (window.location = "https://github.com/therecharge")}
          >
            <img src="/footer1.png" />
          </div>
          <div
            className="logo"
            onClick={() => (window.location = "https://medium.com/therecharge")}
          >
            <img src="/footer2.png" />
          </div>
          <div
            className="logo"
            onClick={() =>
              (window.location = "https://twitter.com/TheRecharge_Ad")
            }
          >
            <img src="/footer3.png" />
          </div>
          <div
            className="logo"
            onClick={() =>
              (window.location = "https://t.me/therecharge_officialkr")
            }
          >
            <img src="/footer4.png" />
          </div>
          <div
            className="logo"
            onClick={() =>
              (window.location =
                "https://etherscan.io/token/0xe74bE071f3b62f6A4aC23cA68E5E2A39797A3c30")
            }
          >
            <img src="/footer5.png" />
          </div>
          <div
            className="logo"
            onClick={() =>
              (window.location =
                "https://hecoinfo.com/token/0xbddC276CACC18E9177B2f5CFb3BFb6eef491799b")
            }
          >
            <img src="/footer6.png" />
          </div>
        </div>
        <div className="bottom" style={{ fontSize: "12px" }}>
          @ 2021 Recharge Labs Ltd.
        </div>
      </div>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  margin: auto;
  margin-bottom: 180px;
  color: #ffffff;
  .footer {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    .header {
      display: flex;
      margin: 0 auto;
      padding: 12px 0;
      width: 286px;
      height: 50px;
      box-sizing: border-box;
      text-align: center;
      border: 1px solid var(--yellow);
      border-radius: 25px;
      a {
        margin: auto;
        margin-top: -3px;
        text-decoration: none;
        color: #ffffff;
      }
      span {
        margin-left: 30px;
        margin-right: -30px;
        color: var(--yellow);
      }
    }
    .header:hover {
      border-radius: 25px;
      background-color: var(--yellow);
      span {
        color: var(--white);
      }
    }
    .sns {
      display: flex;
      margin: 40px auto;
      align-items: center;
      .logo {
        margin: 0 20px;
        cursor: pointer;
        img {
          width: 30px;
          vertical-align: top;
        }
      }
    }
    .bottom {
      margin: 0 auto;
    }
  }
`;
export default Footer;
