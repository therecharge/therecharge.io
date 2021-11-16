import React from "react";
import styled from "styled-components";

function Header_Private() {
  return (
    <Contain>
      <Title>
        <TitleWrapper>
          <p className="Roboto_40pt_Black">Private Locker</p>
        </TitleWrapper>
      </Title>
      <Line />
    </Contain>
  );
}
const Line = styled.div`
  height: 2px;
  margin: 8px 10px 0px 00px;
  width: 100%;
  background-color: #9314b2;
  box-shadow: 0px 0px 20px 0.5px white;
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
`;
const Contain = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 1088px) {
    margin: 40px 30px 0px 30px;
  }
`;
const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;
export default Header_Private;
