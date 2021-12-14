import { useUser } from 'hooks';
import { rem } from 'polished';
import React from 'react';
import { Town } from 'redux/user';

interface TownProps {
  town: Town;
  myTownRank?: number;
}

const FirstUserInTown: React.FC<TownProps> = (props) => {
  return (
    <>
      <p
        style={{
          fontWeight: `bold`,
          fontSize: `${rem(22)}`,
          lineHeight: `160.2%`,
          color: `#0E74FF`,
        }}
      >
        {props.town.name2} 이웃님이
        <br />
        우리 동네&nbsp;
        <span
          style={{
            fontWeight: `bold`,
            fontSize: `${rem(22)}`,
            lineHeight: `160.2%`,
            color: `#EC9C00`,
          }}
        >
          첫 주민
        </span>
        이에요
      </p>
      <div
        style={{
          borderTop: `1px solid #E3EFFF`,
          margin: `18px 0 18px`,
        }}
      />
      <p
        style={{
          fontSize: `${rem(14)}`,
          lineHeight: `161.7%`,
          color: `#4694FF`,
        }}
      >
        지금 바로 게임하고
        <br />
        {props.town.name2}도 랭킹에 참여해봐요!
      </p>
    </>
  );
};

const NotFirstUserInTown: React.FC<TownProps> = (props) => {
  return (
    <>
      <p
        style={{
          fontWeight: `bold`,
          fontSize: `${rem(22)}`,
          lineHeight: `160.2%`,
          color: `#0E74FF`,
        }}
      >
        {props.town.name2} 이웃님,
        <br />
        우리 동네는&nbsp;
        <span
          style={{
            fontWeight: `bold`,
            fontSize: `${rem(22)}`,
            lineHeight: `160.2%`,
            color: `#EC9C00`,
          }}
        >
          {props.myTownRank}위
        </span>
        에요!
      </p>
      <div
        style={{
          borderTop: `1px solid #E3EFFF`,
          margin: `18px 0 18px`,
        }}
      />
      <p
        style={{
          fontSize: `${rem(14)}`,
          lineHeight: `161.7%`,
          color: `#4694FF`,
        }}
      >
        이웃님의 실력으로
        <br />
        우리 동네 순위를 올릴수 있어요
      </p>
    </>
  );
};

interface ComponentProps {
  isFirstInTown: boolean;
  myTownRank?: number;
  myTownScore?: number;
}

export const UserNotLoggedIn: React.FC<ComponentProps> = (props) => {
  const { town } = useUser();
  return (
    <div
      style={{
        display: `flex`,
        flexFlow: `column`,
        justifyContent: `space-between`,
        width: `100%`,
        padding: `${rem(22)} ${rem(18)}`,
        background: `#ffffff`,
        border: `1px solid #4694ff`,
        boxSizing: `border-box`,
        boxShadow: `0px 2px 10px rgba(0, 67, 147, 0.15)`,
        borderRadius: `10px`,
        textAlign: `center`,
      }}
    >
      {props.isFirstInTown ? (
        <FirstUserInTown town={town} />
      ) : (
        <NotFirstUserInTown town={town} myTownRank={props.myTownRank} />
      )}
    </div>
  );
};
