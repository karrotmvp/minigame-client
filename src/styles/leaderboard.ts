import styled from '@emotion/styled';
import { rem } from 'polished';

export const DistrictName = styled.div<{ color: string }>`
  height: fit-content;
  width: fit-content;
  padding: 0 5px;

  color: ${(props) => props.color};
  font-style: normal;
  font-weight: normal;
  font-size: ${rem(8)};
  line-height: 161.7%;

  border: ${(props) => `0.5px solid ${props.color}`};
  box-sizing: border-box;
  border-radius: 7px;
`;
