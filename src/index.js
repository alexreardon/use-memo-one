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

  const isInputMatch: boolean = Boolean(
    inputs &&
      committed.current.inputs &&
      areInputsEqual(inputs, committed.current.inputs),
  );

  if (isInputMatch) {
    return committed.current.result;
  }

  // Concurrent mode assumption: the last render will be the one that is committed
  // I don't think this holds true in all cases, but I need to find some documentation
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
