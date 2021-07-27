const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

const src = path.join(__dirname, "src");
const target = "dist/edge";

const config = {
  performance: {
    hints: false,
  },
  mode: "development",
  devtool: "inline-source-map",
  //devtool: "source-map",
  entry: {
    /**
     * Browser-specific
     */
    sw: path.join(src, "browser/background/index.ts"),
    "browser/popup/index": path.join(src, "browser/popup/index.ts"),

    /**
     *  D&D Beyond: List Views
     */
    "content/dndbeyond.com/listing": path.join(
      src,
      "dndbeyond.com/pages/listing.ts"
    ),

    /**
     *  D&D Beyond: Detail Views
     */
    "content/dndbeyond.com/detail": path.join(
      src,
      "dndbeyond.com/pages/detail.ts"
    ),

    /**
     *  D&D Beyond: Sources
     */
    "content/dndbeyond.com/sources/toc": path.join(
      src,
      "dndbeyond.com/pages/sources/toc.ts"
    ),
    "content/dndbeyond.com/sources/page": path.join(
      src,
      "dndbeyond.com/pages/sources/page.ts"
    ),

    /**
     * D&D Beyond: Special Views
     */
    "content/dndbeyond.com/encounterBuilder/builder": path.join(
      src,
      "dndbeyond.com/pages/encounterBuilder/builder.ts"
    ),
    "content/dndbeyond.com/marketplace": path.join(
      src,
      "dndbeyond.com/pages/marketplace/index.ts"
    ),

    /**
     * Foundry specific
     */
    "content/fvtt/index": path.join(src, "fvtt/index.ts"),
  },
  module: {},
  output: {
    path: path.resolve(__dirname, target),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      Browser: path.resolve(__dirname, "src/browser/"),
      Config: path.resolve(__dirname, "src/config/"),
      Content: path.resolve(__dirname, "src/content/"),
      Utilities: path.resolve(__dirname, "src/utilities/"),
    },
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new CopyPlugin({
      patterns: [
        // { from: "key.pem", to: "" },
        { from: "config/edge/manifest.json", to: "manifest.json" },
        //{ from: "config/edge/key.pem", to: "key.pem" },
        { from: "assets/css/*.min.css", to: "" },
        { from: "assets/libs/**/*", to: "" },
        { from: "assets/icons/**/*", to: "" },
        { from: "assets/img/**/*", to: "" },
        { from: "src/browser/background/index.html", to: "browser/background" },
        { from: "src/browser/popup/index.html", to: "browser/popup" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{ loader: "ts-loader" }],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "env",
                {
                  targets: {
                    browsers: ["Chrome 60"],
                  },
                  //exclude: [ 'transform-regenerator' ],
                  modules: "commonjs",
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
module.exports = config;
