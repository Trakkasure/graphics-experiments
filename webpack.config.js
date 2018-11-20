const path=require('path');
// const webpack=require('webpack');
// const fs=require('fs');

const SRC = path.resolve(__dirname,'index.ts');
const QT = path.resolve(__dirname,'quadTree.ts');
const BOUNDS = path.resolve(__dirname,'bounds.ts');
const COLLISION = path.resolve(__dirname,'collision.ts');
const AXIS = path.resolve(__dirname,'axis.ts');
const DST = path.resolve(__dirname,'dist');

module.exports = {
    entry: {
      'ui': SRC
    , 'qt': QT
    , 'bounds': BOUNDS
    , 'collision': COLLISION
    , 'axis': AXIS
    }
  , resolve: {
      extensions: ['.js','.ts']
    }
  , output: {
      path: DST
    , filename: '[name].js'
    }
  , module: {
      rules: [{
          test: /\.(jsx?|ts)$/
        , exclude: /node_modules/
        , use: {
            loader: 'babel-loader'
          , options: {
                presets: [
                    ['@babel/preset-env',{"targets": "> 0.25%, not dead"}],
                    '@babel/preset-react',
                    '@babel/preset-typescript'
                ]
              , plugins: [
                    '@babel/plugin-proposal-class-properties'
                  , '@babel/plugin-transform-react-constant-elements'
                ]
            }
        }
      }]
    }
  , plugins: []
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
