const path = require("path");

module.exports = (_, argv) => ({
  entry: "./src/index.browser.ts",
  output: {
    path: path.resolve(__dirname, "umd"),
    libraryTarget: "umd",
    libraryExport: "Trekin",
    library: "Trekin",
    filename: `Trekin${
      argv.mode === "production" ? ".min" : ""
    }.js`,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json",
          transpileOnly: true,
        },
      },
    ],
  },
  devtool: argv.mode === "production" ? undefined : "inline-cheap-source-map",
});
