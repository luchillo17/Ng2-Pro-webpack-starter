/**
 * @author: @AngularClass
 */

const {
  optimize: {
    OccurenceOrderPlugin,
    CommonsChunkPlugin
  }
} = require('webpack');
const helpers = require('./helpers');

/**
 * Webpack Plugins
 */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {ForkCheckerPlugin} = require('awesome-typescript-loader');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlElementsPlugin = require('./html-elements-plugin');
const OfflinePlugin = require('offline-plugin');

/*
 * Webpack Constants
 */
const METADATA = {
  title: 'Angular 2 pro starter With Webpack by @luchillo',
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
    vendor:    './src/vendor.browser.ts',
    main:      './src/main.browser.ts'

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
    extensions: ['', '.ts', '.js', '.json'],

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
     * An array of applied pre and post loaders.
     *
     * See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
     */
    preLoaders: [

      /*
       * Tslint loader support for *.ts files
       *
       * See: https://github.com/wbuchwalter/tslint-loader
       */
       // { test: /\.ts$/, loader: 'tslint-loader', exclude: [ helpers.root('node_modules') ] },

      /*
       * Source map loader support for *.js files
       * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
       *
       * See: https://github.com/webpack/source-map-loader
       */
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs'),
          helpers.root('node_modules/@angular'),
          helpers.root('node_modules/@ngrx'),
          helpers.root('node_modules/@angular2-material'),
        ]
      }

    ],

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
        loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
        exclude: [/\.(spec|e2e)\.ts$/]
      },

      /*
       * Json loader support for *.json files.
       *
       * See: https://github.com/webpack/json-loader
       */
      {
        test: /\.json$/,
        loader: 'json-loader'
      },

      /**
      * Scss loader support for *.scss files.
      *
      * See: https://github.com/jtangelder/sass-loader
      */

      // {
      //   test: /^(?!.*app\.core.scss).*\.scss$/,
      //   loaders: ['raw', 'sass']
      // },
      {
        test: /\.scss$/,
        loaders: [
          // ExtractTextPlugin.extract("style", "css?sourceMap"),
          'to-string-loader',
          'css-loader',
          'resolve-url-loader',
          'sass-loader' +
          '?sourceMap&' +
          'outputStyle=expanded&' +
          'root=' + helpers.root('src') + '&' +
          '&includePaths[]' + helpers.root('node_modules') + '&' +
          '&includePaths[]' + helpers.root('src')
        ]
      },
      /*
       * To string and css loader support for *.css files
       * Returns file content as string
       *
       * See: https://github.com/gajus/to-string-loader
       * See: https://github.com/webpack/css-loader
       */
      {
        test: /\.css$/,
        loaders: ['to-string-loader', 'css-loader']
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
     * Description: Shares common code between the pages.
     * It identifies common modules and put them into a commons chunk.
     *
     * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
     * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
     */
    new CommonsChunkPlugin({
      name: ['polyfills', 'vendor'].reverse()
    }),

    /*
     * Plugin: CopyWebpackPlugin
     * Description: Copy files and directories in webpack.
     *
     * Copies project static assets.
     *
     * See: https://www.npmjs.com/package/copy-webpack-plugin
     */
    new CopyWebpackPlugin([{
      from: 'src/assets',
      to: 'assets'
    }]),

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

    /*
     * Plugin: HtmlHeadConfigPlugin
     * Description: Generate html tags based on javascript maps.
     *
     * If a publicPath is set in the webpack output configuration, it will be automatically added to
     * href attributes, you can disable that by adding a "=href": false property.
     * You can also enable it to other attribute by settings "=attName": true.
     *
     * The configuration supplied is map between a location (key) and an element definition object (value)
     * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
     *
     * Example:
     *  Adding this plugin configuration
     *  new HtmlElementsPlugin({
     *    headTags: { ... }
     *  })
     *
     *  Means we can use it in the template like this:
     *  <%= webpackConfig.htmlElements.headTags %>
     *
     * Dependencies: HtmlWebpackPlugin
     */
    new HtmlElementsPlugin({
      headTags: require('./head-config.common')
    }),

    new OfflinePlugin(),

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
   * Description: Node configuration
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
