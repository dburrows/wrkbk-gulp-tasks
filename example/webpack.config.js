var webpack = require("webpack");
var autoprefixer = require('autoprefixer');
var path = require('path');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  resolve: {
    alias: {
      "react": __dirname + '/node_modules/react',
      "react-dom": __dirname + '/node_modules/react-dom',
      "lodash": __dirname + '/node_modules/lodash'
    }
  },
  resolveLoader: { fallback: path.join(__dirname, "node_modules") },
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:9090',
      'webpack/hot/only-dev-server',
      "./src/wrkbk-browser.js"
    ],
    lib: [ "lodash", "react" ]
  },
  output: {
    path: './dist/js/',
    filename: "bundle.js",
    publicPath: "http://localhost:9090/js/"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("lib", "lib.bundle.js"),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.css$/, loader: "style-loader!css-loader"
      },
      {
        test: /\.scss$/,
        loader: "style!css!postcss!sass"
      },
      {
        test: /\.js$/,
        exclude: [ /node_modules/],
        loaders: ["react-hot", "babel?presets[]=react,presets[]=es2015"]
      },
      {
        test: /.*draft-js-basic-html-editor\/.*\.js$/,
        loaders: ["babel?presets[]=react,presets[]=es2015"]
      }
    ]
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
  devServer: {
    port: 9090,
    inline: true,
    hot: true,
    publicPath: "/js/",
    contentBase: "./js",
    headers: { "Access-Control-Allow-Origin": "*" },
    devtool: 'cheap-module-eval-source-map'
  }
};
