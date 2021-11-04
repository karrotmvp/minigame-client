import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 1.625rem 1rem 0.938rem;

  font-style: normal;
  font-weight: normal;

  background: #f3f8ff;
  border: 1px solid #5ba1ff;
  border-radius: 10px;
  box-sizing: border-box;
`;
const Text = styled.p`
  font-weight: 500;
  font-size: 0.75rem;
  color: #82b6ff;
  line-height: 161.7%;
`;

const Name = styled.h3`
  font-weight: bold;
  font-size: 1.125rem;
  color: #0e74ff;
  line-height: 161.7%;
`;
const Score = styled.div`
  font-size: 0.625rem;
  color: #0e74ff;
`;
export const LastWeekTopTownie = () => {
  return (
    <Container>
      <Text>지난 주 1등 동네</Text>
      <Name>district_name</Name>
      <Score>9999</Score>
    </Container>
  );
};

export const LastWeekTopDistrict = () => {
  return (
    <Container>
      <Text>지난 주 1등 주민</Text>
      <Name>townie_name</Name>
      <Score>99999</Score>
    </Container>
  );
};
