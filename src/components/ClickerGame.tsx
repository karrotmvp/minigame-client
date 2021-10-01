import React from 'react';

function ClickerGame({ number, diff, onIncrease, onDecrease, onSetDiff }: any) {
  return (
    <div>
      <h1>{number}</h1>
      <div>
        <button onClick={onIncrease}>+</button>
      </div>
    </div>
  );
}

export default ClickerGame;
