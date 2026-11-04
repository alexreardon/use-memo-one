module.exports = {
  presets: ['@babel/react', '@babel/flow', ['@babel/env', { loose: true }]],
  comments: false,
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
};
