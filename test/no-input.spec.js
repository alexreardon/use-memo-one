// @flow
import React, { type Node } from 'react';
import { mount } from 'enzyme';
import { useMemoOne } from '../src';

type WithMemoProps = {|
  inputs?: mixed[],
  children: (value: mixed) => Node,
  getResult: () => mixed,
|};

function WithMemo(props: WithMemoProps) {
  const value: mixed = useMemoOne(props.getResult, props.inputs);
  return props.children(value);
}

it('should not memoize with no inputs', () => {
  const mock = jest.fn().mockReturnValue(<div>hey</div>);
  const wrapper = mount(
    <WithMemo getResult={() => ({ hello: 'world' })}>{mock}</WithMemo>,
  );

  // initial call
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith({ hello: 'world' });
  const initial: mixed = mock.mock.calls[0][0];
  expect(initial).toEqual({ hello: 'world' });
  mock.mockClear();

  // new function but still no inputs
  wrapper.setProps({ getResult: () => ({ hello: 'there' }) });

  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith({ hello: 'there' });
});

it('should start memoizing if inputs are provided', () => {
  const mock = jest.fn().mockReturnValue(<div>hey</div>);
  const wrapper = mount(
    <WithMemo getResult={() => ({ hello: 'world' })}>{mock}</WithMemo>,
  );

  // initial call
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith({ hello: 'world' });
  const initial: mixed = mock.mock.calls[0][0];
  expect(initial).toEqual({ hello: 'world' });
  mock.mockClear();

  // new function but still no inputs
  // no memoization as previously there where no inputs
  wrapper.setProps({ inputs: [1, 2], getResult: () => ({ hello: 'there' }) });

  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith({ hello: 'there' });
  const second = mock.mock.calls[0][0];
  expect(second).toEqual({ hello: 'there' });
  mock.mockClear();

  // memoization as inputs have not changed
  wrapper.setProps({ inputs: [1, 2], getResult: () => ({ hello: 'there' }) });

  expect(mock).toHaveBeenCalledTimes(1);
  const third = mock.mock.calls[0][0];
  // reference unchanged
  expect(third).toBe(second);
  mock.mockClear();

  // memoization will be lost as inputs are gone
  wrapper.setProps({ inputs: null, getResult: () => ({ hello: 'there' }) });

  expect(mock).toHaveBeenCalledTimes(1);
  const fourth = mock.mock.calls[0][0];
  expect(fourth).toEqual({ hello: 'there' });
  // reference changed
  expect(fourth).not.toBe(third);
});

it('should only call get result once on first pass', () => {
  const getResult = jest.fn().mockReturnValue({ hello: 'friend' });
  mount(
    <WithMemo getResult={getResult} inputs={undefined}>
      {() => null}
    </WithMemo>,
  );

  // initial call
  expect(getResult).toHaveBeenCalledTimes(1);
});
