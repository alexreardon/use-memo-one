// @flow
import { useRef, useState, useEffect } from 'react';
import areInputsEqual from './are-inputs-equal';

type Result<T> = {|
  inputs: ?(mixed[]),
  result: T,
|};

export function useMemoOne<T>(
  // getResult changes on every call,
  getResult: () => T,
  // the inputs array changes on every call
  inputs?: mixed[],
): T {
  if (process.env.NODE_ENV !== 'production') {
    if (inputs == null) {
      // eslint-disable-next-line no-console
      console.warn(
        'use-memo-one: no memoization will occur as no input array was provided',
      );
    }
  }

  // using useState to generate initial value as it is lazy
  const initial: Result<T> = useState(() => ({
    inputs,
    result: getResult(),
  }))[0];

  const uncommitted = useRef<Result<T>>(initial);
  const committed = useRef<Result<T>>(initial);

  // persist any uncommitted changes after they have been committed
  useEffect(() => {
    committed.current = uncommitted.current;
  });

  // Not sure why you would want to do this, but this is to have api parity with useMemo
  if (inputs == null || committed.current.inputs == null) {
    return getResult();
  }

  if (areInputsEqual(inputs, committed.current.inputs)) {
    return committed.current.result;
  }

  uncommitted.current = {
    inputs,
    result: getResult(),
  };

  return uncommitted.current.result;
}

export function useCallbackOne<T: Function>(
  // getResult changes on every call,
  callback: T,
  // the inputs array changes on every call
  inputs?: mixed[],
): T {
  return useMemoOne(() => callback, inputs);
}
