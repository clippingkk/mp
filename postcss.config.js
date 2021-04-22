// postcss.config.js
module.exports = ({ options }) => {
  // disable autoprefixer
  const plugins = Object.keys(options.plugins)
    .reduce((acc, k) => {
      if (k.includes('postcss-preset-env')) {
        acc[k] = { autoprefixer: false }
      } else {
        acc[k] = { k: options.plugins[k] }
      }
      return acc
    }, {})

  return {
    plugins: {
      ...plugins,
    }
  }
}
