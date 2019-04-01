const path = require("path");
const HtmlPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./client/src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index_bundle.js"
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: "babel-loader" },
      { test: /\.css$/, use: ["style-loader", "css-loader"] }
    ]
  },
  mode: "development",
  plugins: [new HtmlPackPlugin({ template: "./client/index.html" })]
};
