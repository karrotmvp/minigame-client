import styled from '@emotion/styled';

export const navHeight = `50px`;
export const pageHeight = `calc(100vh - ${navHeight})`;

export const PageContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: ${pageHeight};
  // position: relative;
`;

export const BottomCTAContainer = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90px;
  padding: 15px 18px 30px;

  display: flex;
  justify-content: center;

  border-top: 1px solid #ebebeb;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;
