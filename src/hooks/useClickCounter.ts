import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementClickCount, reset } from 'reducers/counterReducer';
import { RootState } from 'reducers/rootReducer';

export default function useClickCounter() {
  const { clickCount } = useSelector((state: RootState) => ({
    clickCount: state.counterReducer.clickCount,
  }));
  const dispatch = useDispatch();
  const onResetCount = useCallback(() => dispatch(reset()), [dispatch]);
  const onIncrementClickCount = useCallback(
    () => dispatch(incrementClickCount()),
    [dispatch]
  );

  return {
    clickCount,
    onResetCount,
    onIncrementClickCount,
  };
}
