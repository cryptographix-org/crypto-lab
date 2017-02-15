var path = require( 'path' );
var webpack = require('webpack');
var AureliaWebPackPlugin = require('aurelia-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var project = require('./package.json');

const coreBundles = {
  bootstrap: [
    'aurelia-bootstrapper-webpack',
    'aurelia-polyfills',
    'aurelia-pal',
    'aurelia-pal-browser',
    'bluebird'
  ],
  // these will be included in the 'aurelia' bundle (except for the above bootstrap packages)
  aurelia: [
    'aurelia-bootstrapper-webpack',
    'aurelia-binding',
    'aurelia-dependency-injection',
    'aurelia-event-aggregator',
    'aurelia-framework',
    'aurelia-history',
    'aurelia-history-browser',
    'aurelia-loader',
    'aurelia-loader-webpack',
    'aurelia-logging',
    'aurelia-logging-console',
    'aurelia-metadata',
    'aurelia-pal',
    'aurelia-pal-browser',
    'aurelia-path',
    'aurelia-polyfills',
    'aurelia-route-recognizer',
    'aurelia-router',
    'aurelia-task-queue',
    'aurelia-templating',
    'aurelia-templating-binding',
    'aurelia-templating-router',
    'aurelia-templating-resources'
  ]
}

module.exports = {
  entry: {
      'app': [ './client/main' ], // <-- this array will be filled by the aurelia-webpack-plugin
      'aurelia-bootstrap': coreBundles.bootstrap,
      'aurelia': coreBundles.aurelia.filter(pkg => coreBundles.bootstrap.indexOf(pkg) === -1)
      //      'aurelia': Object.keys(project.dependencies).filter(dep => dep.startsWith('aurelia-'))
  },
  output: {
      path: path.resolve( __dirname, 'public' ),
      filename: 'js/[name].bundle.js',
      sourceMapFilename: 'js/[name].bundle.js.map'
  },
  module: {
    rules: [
      { test: /\.(png|gif|jpg)$/, loader: 'url-loader', query: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader', query: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader', query: { limit: 10000, mimetype: 'application/font-woff' } },
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: path.join('./client/', 'index.html'),
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: "source-map-loader"
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ],
    alias: {
      jquery: "public/static/vendor/jquery/js/jquery-1.11.3.min"
    },
    modules: [path.resolve(), 'node_modules']
  },
  plugins: [
    new AureliaWebPackPlugin( {
      src: path.resolve( 'client' )
    } ),
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      chunksSortMode: 'dependency'
    }),
    new webpack.optimize.CommonsChunkPlugin({ // to eliminate code duplication across bundles
      name: ['aurelia', 'aurelia-bootstrap']
    })
  ],
  devtool: 'inline-source-map',
};
