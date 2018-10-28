const path=require('path');
// const webpack=require('webpack');
// const fs=require('fs');

const SRC = path.resolve(__dirname,'index.js');
const DST = path.resolve(__dirname,'dist');

module.exports = {
    entry: {
      'ui': SRC
    }
  // , resolve: {
  //     extensions: ['.js', '.jsx','.ts]
  //   }
  , output: {
      path: DST
    , filename: '[name].js'
    }
  , module: {
      rules: [
      {
          test: /\.(jsx?|ts)$/
        , exclude: /node_modules/
        , use: {
            loader: 'babel-loader'
          , options: {
                presets: [
                    '@babel/preset-env',
                    '@babel/preset-react',
                    '@babel/preset-typescript'
                ]
              , plugins: [
                    '@babel/plugin-proposal-class-properties'
                  , '@babel/plugin-transform-react-constant-elements'
                ]
            }
        }
      }
      ]
    }
  , plugins: [
    // , new webpack.optimize.UglifyJsPlugin({
    //     compress: {
    //       warnings: false,
    //       properties: true,
    //       sequences: true,
    //       dead_code: true,
    //       conditionals: true,
    //       comparisons: true,
    //       evaluate: true,
    //       booleans: true,
    //       unused: true,
    //       loops: true,
    //       hoist_funs: true,
    //       cascade: true,
    //       if_return: true,
    //       join_vars: true,
    //       //drop_console: true,
    //       drop_debugger: true,
    //       negate_iife: true,
    //       unsafe: false,
    //       hoist_vars: true,
    //       //side_effects: true
    //     },
    //     output: {
    //       comments: false
    //     }
    //    //sourceMap: true,
    //   })
    ]
  , stats: { colors: true }
  , devtool: 'source-map'
  , devServer: {
      port: process.env.PORT || 8888,
      host: '0.0.0.0',
      colors: true,
      publicPath: '/',
      contentBase: './src',
      historyApiFallback: true,
      proxy: [
      ]
    }
};
