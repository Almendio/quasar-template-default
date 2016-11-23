var
  path = require('path'),
  webpack = require('webpack'),
  config = require('../config'),
  cssUtils = require('./css-utils'),
  env = require('./env-utils'),
  merge = require('webpack-merge'),
  projectRoot = path.resolve(__dirname, '../')

// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue at the end of this file
var
  cssSourceMapDev = (env.dev && config.dev.cssSourceMap),
  cssSourceMapProd = (env.prod && config.build.productionSourceMap),
  useCssSourceMap = cssSourceMapDev || cssSourceMapProd

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: config[env.prod ? 'build' : 'dev'].publicPath,
    filename: 'js/[name].js',
    chunkFilename: 'js/[id].[chunkhash].js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [
      path.join(__dirname, '../src'),
      "node_modules"
    ],
    alias: {
      quasar: path.resolve(__dirname, '../node_modules/quasar-framework/'),
      src: path.resolve(__dirname, '../src'),
      assets: path.resolve(__dirname, '../src/assets'),
      components: path.resolve(__dirname, '../src/components')
    }
  },
  module: {
    rules: [
      { // eslint
        enforce: 'pre',
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: projectRoot,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: cssUtils.postcss,
          loaders: merge({js: 'babel-loader'}, cssUtils.styleLoaders({
            sourceMap: useCssSourceMap,
            extract: env.prod
          }))
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [
    // Uncomment if you wish to load only one Moment locale
    //new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-us/),

    new webpack.DefinePlugin({
      'process.env': config[env.prod ? 'build' : 'dev'].env,
      'DEV': env.dev,
      'PROD': env.prod,
      '__THEME': '"' + env.platform.theme + '"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: env.prod,
      options: {
        context: path.resolve(__dirname, '../src'),
        eslint: {
          formatter: require('eslint-friendly-formatter')
        },
        postcss: cssUtils.postcss
      }
    })
  ]
}
