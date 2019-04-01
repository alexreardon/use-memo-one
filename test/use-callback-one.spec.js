// @flow
import React, { type Node } from 'react';
import { mount } from 'enzyme';
import { useCallbackOne } from '../src';

type Props = {|
  inputs: mixed[],
  children: (value: mixed) => Node,
  callback: Function,
|};

function WithCallback(props: Props) {
  const fn: Function = useCallbackOne(props.callback, props.inputs);
  return props.children(fn);
}

it('should return the passed callback until there is an input change', () => {
  const mock = jest.fn().mockReturnValue(<div>hey</div>);
  const callback = () => {};
  const wrapper = mount(
    <WithCallback inputs={[1, 2]} callback={callback}>
      {mock}
    </WithCallback>,
  );

  // initial call
  expect(mock).toHaveBeenCalledTimes(1);
  expect(mock).toHaveBeenCalledWith(callback);
  const first: mixed = mock.mock.calls[0][0];
  expect(first).toBe(callback);

  mock.mockClear();
  // no input change
  // changing the reference to the callback function (will happen on each render)
  wrapper.setProps({ inputs: [1, 2], callback: () => ({ hello: 'world' }) });

  expect(mock).toHaveBeenCalledTimes(1);
  const second: mixed = mock.mock.calls[0][0];
  // same reference
  expect(second).toBe(first);

  mock.mockClear();

  // input change
  // changing the reference to the callback function (will happen on each render)
  const newCallback = () => {};
  wrapper.setProps({ inputs: [1, 2, 3], callback: newCallback });

  expect(mock).toHaveBeenCalledTimes(1);
  const third: mixed = mock.mock.calls[0][0];
  // same reference
  expect(third).toBe(newCallback);
});
