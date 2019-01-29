module.exports = {
  entry: `${__dirname}/AssemblyScript/f.ts`,
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'assemblyscript-typescript-loader',
        options: {
          sourceMap: true,
        }
      }
    ]
  },
};