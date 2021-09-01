import React, { useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function Language(props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language != "en" ? "en" : "ko");
  };
  const getImagePath = (lang) => {
    switch (lang) {
      case "en":
        return "/lang/ic-eng.svg";
      case "ko":
        return "/lang/ic-kor.svg";
      default:
        return "/lang/ic-eng.svg";
    }
  };
  return (
    <Container>
      <div className="dropdown">
        <Flag
          src={getImagePath(lang)}
        // onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />
        <Dropdown className="dropdownContent">
          <Row
            onClick={() => {
              i18n.changeLanguage("en");
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <img src="/lang/ic-eng.svg" />
            <span className={lang == "en" ? "bold" : ""}>ENG</span>
          </Row>
          <Row
            onClick={() => {
              i18n.changeLanguage("ko");
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <img src="/lang/ic-kor.svg" />
            <span className={lang == "ko" ? "bold" : ""}>KOR</span>
          </Row>
        </Dropdown>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  .dropdown {
    height: 60px;
    display: flex;
    margin: auto auto;
    padding-left: 27px;
    padding-right: 40px;
    align-items: center;
  }
  .dropdownContent {
    display: none;
  }
  .dropdown:hover .dropdownContent {
    display: flex;
  }
`;
const Flag = styled.img`
  height: 20px;
  cursor: pointer;
`;
const Dropdown = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 75px;
  width: 100px;
  height: 80px;
  background-color: black;
`;
const Row = styled.div`
  display: flex;
  margin: auto auto;
  width: 70px;
  height: 20px;
  cursor: pointer;
  &:hover span {
    color: var(--white);
  }
  img {
    height: 20px;
  }
  span {
    margin: auto auto;
    margin-bottom: 0;
    margin-left: 8.7px;
    font: var(--Roboto_15pt_Regular);
    color: var(--gray-20);
  }
  .bold {
    font: var(--Roboto_15pt_Bold);
  }
`;

export default Language;
