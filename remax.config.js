const stylus = require('@remax/plugin-stylus');

module.exports = {
  plugins: [stylus()],
  configWebpack({ config, webpack, addCSSRule }) {
    // config 是的 https://github.com/neutrinojs/webpack-chain Config 对象。
    config.module.rule('md').test(/\.md$/).use('raw').loader('raw-loader')
    config.module.rule('graphql').test(/\.(graphql|gql)$/).use('graphql').loader('graphql-tag/loader')
  },
};
