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
        .Toastify__toast--success {
          bottom: 30px;
          width: fit-content;
          height: fit-content;
          min-height: fit-content;
          margin: auto;
          padding: 10px 18px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.6);
          box-shadow: none;
        }
        .Toastify__toast-body {
          font-family: Pretendard;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 161.7%;
          height: fit-content;
          color: #ffffff;
          margin: 0;
          padding: 0;
          div {
            font-size: 14px;
          }
        }
      `}
    />
  );
};

export const subscribeToastEmitter = () => {
  toast.success('즐겨찾기 성공', {
    icon: <img src={checkMarkUrl} alt="" />,
    position: 'bottom-center',
    autoClose: 3000,
    delay: 1000,
    hideProgressBar: true,
  });
};
