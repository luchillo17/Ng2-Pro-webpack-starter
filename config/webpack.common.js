const {
  HotModuleReplacementPlugin,
  optimize: {
    OccurenceOrderPlugin,
    CommonsChunkPlugin
  }
} = require('webpack');
const helpers = require('./helpers');

/**
 * Webpack Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {ForkCheckerPlugin} = require('awesome-typescript-loader');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

/*
 * Webpack Constants
 */
const METADATA = {
  title: 'Angular 2 pro starter With Webpack',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer()
};

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = {

  /*
   * Static metadata for index.html
   *
   * See: (custom attribute)
   */
  metadata: METADATA,

  /*
   * The entry point for the bundle
   * Our Angular.js app
   *
   * See: http://webpack.github.io/docs/configuration.html#entry
   */
  entry: {

    polyfills: './src/polyfills.browser.ts',
    vendor: './src/vendor.browser.ts',
    main: './src/main.browser.ts'

  },

  /*
   * Options affecting the resolving of modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#resolve
   */
  resolve: {

    /*
     * An array of extensions that should be used to resolve modules.
     *
     * See: http://webpack.github.io/docs/configuration.html#resolve-extensions
     */
    extensions: ['', '.ts', '.js'],

    // Make sure root is src
    root: helpers.root('src'),

    // remove other default values
    modulesDirectories: ['node_modules', 'bower_components', 'src']

  },

  /*
   * Options affecting the normal modules.
   *
   * See: http://webpack.github.io/docs/configuration.html#module
   */
  module: {

    /*
   * An array of automatically applied loaders.
   *
   * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
   * This means they are not resolved relative to the configuration file.
   *
   * See: http://webpack.github.io/docs/configuration.html#module-loaders
   */
    loaders: [

      /*
       * Typescript loader support for .ts and Angular 2 async routes via .async.ts
       *
       * See: https://github.com/s-panferov/awesome-typescript-loader
       */
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: [/\.(spec|e2e)\.ts$/]
      },

      /*
       * Json loader support for *.json files.
       *
       * See: https://github.com/webpack/json-loader
       */
      {
        test: /\.json$/,
        loader: 'json'
      },

      /**
      * Scss loader support for *.scss files.
      *
      * See: https://github.com/jtangelder/sass-loader
      */

      {
        test: /^(?!.*app\.core.scss).*\.scss$/,
        loaders: ['raw', 'sass']
      },
      {
        test: /app\.core\.scss$/,
        loaders: [
          // ExtractTextPlugin.extract("style", "css?sourceMap"),
          'style',
          'css',
          'resolve-url',
          'sass' +
          '?sourceMap&' +
          'outputStyle=expanded&' +
          'root=' + helpers.root('src') + '&' +
          '&includePaths[]' + helpers.root('node_modules') + '&' +
          '&includePaths[]' + helpers.root('src')
        ]
      },
      /*
       * Raw loader support for *.css files
       * Returns file content as string
       *
       * See: https://github.com/webpack/css-loader
       * See: https://github.com/webpack/style-loader
       */
      // {
      //   test: /^(?!.*\.min\.css$).*\.css$/,
      //   loader: ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap")
      // },

      /*
       * Raw loader support for *.css files
       * Returns file content as string
       *
       * See: https://github.com/webpack/raw-loader
       */
      {
        test: /\.css$/,
        loader: 'raw-loader'
      },

      /* Raw loader support for *.html
       * Returns file content as string
       *
       * See: https://github.com/webpack/raw-loader
       */
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [helpers.root('src/index.html')]
      },

      /**
      * Url loader support for png|jpg|gif
      *
      * See: https://www.npmjs.com/package/url-loader
      */
      {
        test: /\.(png|jpg|gif)$/,
        loader: "url?limit=50000&name=[path][name].[ext]"
      },

      /**
       * Font loader support for fonts necesary for FontAwesome
       * Fonts handled by next 2 loaders are ttf|eot|otf|svg|woff|woff2
       *
       * See: https://www.npmjs.com/package/url-loader
       */
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&name=fonts/[name].[ext]"
      },
      {
        test: /\.(ttf|eot|otf|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=fonts/[name].[ext]"
      }

    ]
  },

  /*
   * Add additional plugins to the compiler.
   *
   * See: http://webpack.github.io/docs/configuration.html#plugins
   */
  plugins: [

    new HotModuleReplacementPlugin(),

    /*
     * Plugin: ForkCheckerPlugin
     * Description: Do type checking in a separate process, so webpack don't need to wait.
     *
     * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
     */
    new ForkCheckerPlugin(),

    /*
     * Plugin: OccurenceOrderPlugin
     * Description: Varies the distribution of the ids to get the smallest id length
     * for often used ids.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
     * See: https://github.com/webpack/docs/wiki/optimization#minimize
     */
    new OccurenceOrderPlugin(true),

    /*
     * Plugin: CommonsChunkPlugin
     * Description: Generate an extra chunk, which contains common modules shared between entry points..
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
     * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
     */
    new CommonsChunkPlugin({
      name: ['polyfills', 'vendor', 'main'].reverse(),
      minChunks: Infinity
    }),

    // new webpack.ProvidePlugin({
    //   // io: 'socket.io-client',
    //   // Chart: 'chart.js/Chart.min.js'
    //   // ,$: "jquery",
    //   // jQuery: "jquery",
    //   // "window.jQuery": "jquery"
    // }),

    /*
     * Plugin: ExtractTextPlugin
     * Description: It moves every require("style.css") in entry chunks into a separate css output file.
     * So your styles are no longer inlined into the javascript, but separate in a css bundle file (styles.css).
     *
     * See: https://github.com/webpack/extract-text-webpack-plugin#usage-example-with-css
     */
    // new ExtractTextPlugin("styles.css"),

    /*
     * Plugin: HtmlWebpackPlugin
     * Description: Simplifies creation of HTML files to serve your webpack bundles.
     * This is especially useful for webpack bundles that include a hash in the filename
     * which changes every compilation.
     *
     * See: https://github.com/ampedandwired/html-webpack-plugin
     */
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      chunksSortMode: 'dependency'
    }),

    /**
     * Plugin: WebpackBuildNotifierPlugin
     * Description: Desk notifications in upper right corner of screen
     *
     * See: https://www.npmjs.com/package/webpack-build-notifier
     */
    new WebpackBuildNotifierPlugin({
      title: 'TAO WEB'
      // logo: 'public/dist/img/favicon.ico'
    }),

    new ProgressBarPlugin()
  ],

  /**
   * Config sassLoader paths for imports from node_modules, bower components
   * and app folder.
   *
   * See: https://github.com/jtangelder/sass-loader
   */
  sassLoader: {
    includePaths: [
      'node_modules', 'bower_components', 'src', '.'
    ]
  },

  /*
   * Include polyfills or mocks for various node stuff
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: 'window',
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }

};
