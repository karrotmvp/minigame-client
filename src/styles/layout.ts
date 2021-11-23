import styled from '@emotion/styled';

export const navHeight = `50px`;
export const pageHeight = `calc(100vh - ${navHeight})`;

export const PageContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: ${pageHeight};
  // position: relative;
`;
