import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from '@emotion/css';
import checkMarkUrl from 'assets/svg/checkmark.svg';

export const SubscribeToastContainer = () => {
  return (
    <ToastContainer
      closeButton={false}
      limit={1}
      transition={Slide}
      className={css`
        .Toastify__toast--default {
          bottom: 30px;
          width: fit-content;
          height: fit-content;
          min-height: fit-content;
          margin: auto;
          padding: 10px 18px;
          background: #5b5b5b;
          opacity: 0.9;
          border-radius: 10px;
          box-shadow: none;
          z-index: 99999;
        }
        .Toastify__toast-body {
          font-family: Pretendard;
          font-style: normal;
          font-weight: normal;

          line-height: 161.7%;
          height: fit-content;
          text-align: center;
          color: #ffffff;
          margin: 0;
          padding: 0;

          p {
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 161.7%;
            /* identical to box height, or 26px */

            color: #ffc8a9;
          }
          span {
            font-style: normal;
            font-weight: normal;
            font-size: 14px;
            line-height: 161.7%;
            /* identical to box height, or 23px */

            /* gray/gray 200 */

            color: #ececec;
          }
        }
      `}
    />
  );
};

export const subscribeToastEmitter = () => {
  toast(
    <p>
      <img
        src={checkMarkUrl}
        alt=""
        style={{
          marginRight: `8px`,
        }}
      />
      구독 추가 완료!
      <br />
      <span
        style={{
          fontSize: `14px`,
          lineHeight: `161.7%`,
          color: `#ECECEC`,
        }}
      >
        내 근처 탭에서 확인할 수 있어요
      </span>
    </p>,
    {
      position: 'bottom-center',
      autoClose: 3000,
      delay: 200,
      hideProgressBar: true,
    }
  );
};
