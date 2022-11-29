const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const slsw = require('serverless-webpack')
const nodeExternals = require('webpack-node-externals')

const isLocal = slsw.lib.webpack.isLocal || (slsw.lib.options && slsw.lib.options.stage === 'local')

module.exports = {
  entry: slsw.lib.entries,
  externalsPresets: { node: true },
  devtool: isLocal ? 'inline-cheap-module-source-map' : 'source-map',
  mode: isLocal ? 'development' : 'production',
  node: {
    __dirname: true,
    __filename: true,
  },
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }],
  },
  externals: [nodeExternals(), '_http_common'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '~': path.resolve(__dirname, 'src'),
      // openapi-validator-middleware attemps to import this even though we don't need it
      'fastify-plugin': false,
      /* Workaround for 'api-schema-builder' breaking when attempting to import the decimal.js library.
       * See {@link https://github.com/MikeMcl/decimal.js/issues/59}
       */
      'decimal.js': 'decimal.js/decimal.js',
    },
    extensions: ['.js'],
  },
  plugins: [
    /* Workaround for `critical-dependency` issue with webpack and node-formidable.
     * See {@link https://github.com/node-formidable/formidable/issues/337}
     */
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new CopyPlugin({
      patterns: ['openapi-schema.yaml'],
    }),
  ],
}
