# useMemoOne

[`useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) and [`useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback) with semantic guarantee (stable references)

## Background

`useMemo` and `useCallback` cache the most recent result. However, this cache can be destroyed by `React` when it wants to:

> You may rely on useMemo as a performance optimization, **not as a semantic guarantee**. In the future, **React may choose to “forget” some previously memoized values** and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without useMemo — and then add it to optimize performance. - [React docs](https://reactjs.org/docs/hooks-reference.html#usememo)

`useMemoOne` and `useCallbackOne` are `concurrent mode` friendly alternatives to `useMemo` and `useCallback` that do provide **semantic guarantee**. What this means is that you will always get the same reference for a memoized so long as there is no input change.

## Install

```bash
# npm
npm install use-memo-one --save
# yarn
yarn add use-memo-one
```

## Usage

```js
import { useMemoOne, useCallbackOne } from 'use-memo-one';

function App(props) {
  const {name, age } = props;
  const value = useMemoOne(() => ({hello: name}), [name]);
  const getAge = useCallbackOne(() => age, [age])

  // ...
}
```