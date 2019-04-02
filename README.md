# useMemoOne

[`useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) and [`useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback) with a stable cache (semantic guarantee)

[![Build Status](https://travis-ci.org/alexreardon/use-memo-one.svg?branch=master)](https://travis-ci.org/alexreardon/use-memo-one)
[![npm](https://img.shields.io/npm/v/use-memo-one.svg)](https://www.npmjs.com/package/use-memo-one)
[![dependencies](https://david-dm.org/alexreardon/use-memo-one.svg)](https://david-dm.org/alexreardon/use-memo-one)
[![min](https://img.shields.io/bundlephobia/min/use-memo-one.svg)](https://bundlephobia.com/result?p=use-memo-one)
[![minzip](https://img.shields.io/bundlephobia/minzip/use-memo-one.svg)](https://bundlephobia.com/result?p=use-memo-one)

## Background

`useMemo` and `useCallback` cache the most recent result. However, this cache can be destroyed by `React` when it wants to:

> You may rely on useMemo as a performance optimization, **not as a semantic guarantee**. In the future, **React may choose to “forget” some previously memoized values** and recalculate them on next render, e.g. to free memory for offscreen components. Write your code so that it still works without useMemo — and then add it to optimize performance. [- React docs](https://reactjs.org/docs/hooks-reference.html#usememo)

`useMemoOne` and `useCallbackOne` are `concurrent mode` safe alternatives to `useMemo` and `useCallback` **that do provide semantic guarantee**. What this means is that you will always get the same reference for a memoized value so long as there is no input change.

Using `useMemoOne` and `useCallbackOne` will consume more memory than `useMemo` and `useCallback` in order to provide a stable cache.

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
  const { name, age } = props;
  const value = useMemoOne(() => ({hello: name}), [name]);
  const getAge = useCallbackOne(() => age, [age])

  // ...
}
```

## API

See [`useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo) and [`useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback)
