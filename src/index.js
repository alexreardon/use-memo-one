// @flow
import { useRef, useState, useEffect } from 'react';
import areInputsEqual from './are-inputs-equal';

type Cache<T> = {|
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
  const [initial] = useState((): Cache<T> => ({
    inputs,
    result: getResult(),
  }));

  const committed = useRef<Cache<T>>();

  let cache = committed.current;
  if (cache) {
    const useCache = Boolean(
      inputs && cache.inputs && areInputsEqual(inputs, cache.inputs),
    );
    // create a new cache if required
    if (!useCache) {
      cache = {
        inputs,
        result: getResult(),
      };
    }
  } else {
    cache = initial;
  }

  // commit the cache
  useEffect(() => {
    committed.current = cache;
  }, [cache]);

  return cache.result;
}

export function useCallbackOne<T: Function>(
  // getResult changes on every call,
  callback: T,
  // the inputs array changes on every call
  inputs?: mixed[],
): T {
  return useMemoOne(() => callback, inputs);
}

// Aliased exports
// A drop in replacement for useMemo and useCallback that plays
// very well with eslint-plugin-react-hooks

export const useMemo = useMemoOne;
export const useCallback = useCallbackOne;
