import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

function Defi() {
  // const [t] = useTranslation();
  return (
    <Container>
      <Content>
        <a>Defi</a>
        {/*GNB*/}
        {/*Station*/}
        {/*My pools*/}
        {/*Analytics*/}
        {/*Footer*/}
      </Content>
    </Container>
  );
}
const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const Content = styled.div`
  margin-top: 100px;
  display: flex;
  width: 100%;
  max-width: 1088px;
  height: 100%;
  a {
    color: white;
  }
`;

export default React.memo(Defi);
