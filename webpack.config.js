/**
 * Webpackの設定ファイル
 * /src/index.jsに書いたReactプログラムをpublic/bundle.jsに出力する設定
 */

// pathモジュール(node.jsで用意されている)をロードする
const path = require('path')

// module.exportsで外部に公開できる
// モジュールのエクスポート設定
module.exports = {
  // src/index.jsをpublic/bundle.jsに出力する
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  // ブラウザの開発者ツールなどにソースマップ(ビルド前のコード)を表示する
  devtool: 'inline-source-map',
  // モジュールのルール指定を行う
  module: {
    rules: [
      {
        // testプロパティにはファイルのパターンを正規表現で指定
        // .jsファイルが対象
        test: /.js$/,
        // loaderにはどのプラグインを使うか指定
        // npmでインストールしたbabel-loaderを使う
        loader: 'babel-loader',
        // babel-loaderのオプションとして、es2015とreactを指定すると、React/JSXの変換が行える
        options: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
}
