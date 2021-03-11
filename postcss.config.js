// postcss.config.js
module.exports = ({ options }) => {
  return {
    plugins: {
      ...options.plugins,
    }
  }
}
