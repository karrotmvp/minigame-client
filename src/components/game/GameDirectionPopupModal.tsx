/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { emphasizedTextStyle, largeTextStyle } from 'styles/textStyle';

import BackendService from 'services/backendService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reducers/rootReducer';
import Modal from 'react-modal';
import { ReactComponent as PointingFinger } from 'assets/PointingFinger.svg';

const modalStyle = css`
  position: absolute;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  top: 50%;
  transform: translateY(-50%);
  width: 80%;
  max-width: 400px;
  display: flex;
  flex-flow: column;
  gap: 26px;
  align-items: center;
  background: #fff;
  // top: 25px;
  // inset: 10% 8% 10%;
  padding: 45px 15px 20px;
  border-radius: 21px;
`;
const directionText = css`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 161.7%;
  /* or 23px */

  text-align: center;

  color: #ffffff;
`;
const GameDirectionPopupModal = () => {
  return (
    <>
      <PointingFinger />
      <p css={directionText}>
        아무 곳이나 눌러보세요!
        <br />
        10번을 누르면
        <br />
        1개의 당근을 모을 수 있어요
      </p>
    </>
  );
};

export default GameDirectionPopupModal;
