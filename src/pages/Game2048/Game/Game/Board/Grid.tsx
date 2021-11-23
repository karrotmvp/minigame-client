import React from 'react';
import styled from '@emotion/styled';
import { boardMargin, boardPadding } from '../styles';

type Props = {
  cellWidth: number;
  children: React.ReactNode;
};

const Grid: React.FC<Props> = (props) => {
  return (
    <Container className="grid">
      {[...Array(16)].map((x, i) => (
        <Cell key={i} cellWidth={props.cellWidth} />
      ))}
      {props.children}
    </Container>
  );
};

export const MemoizedGrid = React.memo(Grid);

const Container = styled.div`
  width: calc(100% - ${boardMargin}rem * 2);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${boardPadding}rem;

  margin: ${boardMargin}rem;

  background: #c8d8ee;
  border: ${boardPadding}rem solid #c8d8ee;
  box-sizing: border-box;
  border-radius: 6px;
`;

const Cell = styled.div<{ cellWidth: number }>`
  width: ${(props) => props.cellWidth}px;
  height: ${(props) => props.cellWidth}px;
  background: #dde7f4;
  border-radius: 3px;
`;
