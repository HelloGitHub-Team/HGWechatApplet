module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-pxtransform": {
      platform: "weapp",
      designWidth: 750
    },
    "postcss-csso": {}
  }
};
