// @flow
const React = require('react');
const Enzyme = require('enzyme');

const majorVersion = Number(React.version.split('.')[0]);

const adapters = {
  16: 'enzyme-adapter-react-16',
  17: '@wojtekmaj/enzyme-adapter-react-17',
  18: '@cfaester/enzyme-adapter-react-18',
  19: '@belzile/enzyme-adapter-react-19',
};

const adapterPackage = adapters[majorVersion];

if (!adapterPackage) {
  throw new Error(`Unsupported React version: ${React.version}`);
}

const AdapterModule = require(adapterPackage);
const Adapter = AdapterModule.default || AdapterModule;

Enzyme.configure({ adapter: new Adapter() });
