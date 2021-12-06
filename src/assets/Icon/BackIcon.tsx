import React from 'react';

export const BackIcon: React.FC<{ fill?: string; width?: string }> = (
  props
) => {
  return (
    <svg
      width={props.width ? props.width : '22'}
      height={props.width ? props.width : '22'}
      viewBox={props.width ? `0 0 ${props.width} ${props.width}` : '0 0 22 22'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.2352 2.74068C14.786 2.29152 14.0618 2.29152 13.6127 2.74068L5.99518 10.3582C5.63768 10.7157 5.63768 11.2932 5.99518 11.6507L13.6127 19.2682C14.0618 19.7174 14.786 19.7174 15.2352 19.2682C15.6843 18.819 15.6843 18.0949 15.2352 17.6457L8.59851 10.9999L15.2443 4.35402C15.6843 3.91402 15.6843 3.18068 15.2352 2.74068Z"
        fill={props.fill ? props.fill : '#7C7C7C'}
      />
    </svg>
  );
};

export const CircleBackIcon: React.FC = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_2303_7018)">
        <circle cx="24" cy="24" r="17" fill="white" />
        <path
          d="M28.2349 15.7408C27.7858 15.2916 27.0616 15.2916 26.6124 15.7408L18.9949 23.3583C18.6374 23.7158 18.6374 24.2933 18.9949 24.6508L26.6124 32.2683C27.0616 32.7175 27.7858 32.7175 28.2349 32.2683C28.6841 31.8191 28.6841 31.095 28.2349 30.6458L21.5983 24L28.2441 17.3541C28.6841 16.9141 28.6841 16.1808 28.2349 15.7408Z"
          fill="#7C7C7C"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2303_7018"
          x="0"
          y="0"
          width="48"
          height="48"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2303_7018"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2303_7018"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
