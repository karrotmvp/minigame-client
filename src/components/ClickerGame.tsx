import React from 'react';

function ClickerGame({ number, diff, onIncrease, onDecrease, onSetDiff }: any) {
  // const onChange = (e: { target: { value: string } }) => {
  //   // convert string to int
  //   onSetDiff(parseInt(e.target.value, 10));
  // };
  return (
    <div>
      <h1>{number}</h1>
      <div>
        {/* <input type="number" value={diff} min="1" onChange={onChange} /> */}
        <button onClick={onIncrease}>+</button>
      </div>
    </div>
  );
}

export default ClickerGame;
