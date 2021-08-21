import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
//components
import Image from "./List/image.js";
import Row from "./List/row.js";
import WalletConnect from "../../../../Component/Components/Common/WalletConnect";

function List({ type, list }) {
  const [t] = useTranslation();
  return (
    <Container>
      <Content>
        <Image type={type} />
        <p className="Roboto_40pt_Black">Charger List</p>
        <RowContainer>
          <Row status="Close" />
          <Row status="Inactive" />
          <Row status="Active" />
        </RowContainer>
      </Content>
    </Container>
  );
}
const Container = styled.div`
  margin-top: 40px;
  display: flex;
  width: 100%;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  mix-width: 620px;
  img {
    height: 60px;
    margin: auto;
  }
  p {
    color: white;
    margin: auto;
    margin-top: 20px;
  }
`;
const RowContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 50px 0px 50px;
`;

export default React.memo(List);
