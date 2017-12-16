Reactサンプル
====

## ディレクトリの作成

* mkdir bbs
* cd bbs

## プロジェクトの作成とライブラリのインストール

* npm init -y
    * package.jsonを生成する(-yオプションは対話形式をすべてYes)
    * package.jsonに定義がある場合は、npm installコマンドで一括取り込みできる
* npm install —save express
    * SPAフレームワーク
    * —saveオプションでプロジェクトにインストール(package.jsonに書き込む)
* npm install —save nedb
    * 書き込まれたログデータを保存するためにNeDB
* npm install —save superagent
    * ajaxを利用するためにsuperAgent
* npm i —save react react-dom
    * Reactを利用
* npm i —save-dev webpack
    * Webpackでリソース管理
* npm i —save-dev babel-loader babel-core
* npm i —save-dev babel-preset-es2015 babel-preset-react
    * Babelで最新JS(ES2015)を利用、ReactのJSXを変換

## 実行する

* npm run build(webpack)
    * package.jsonで定義したscripts buildのタスクを実行する(webpackコマンド)
    * webpack.config.jsで定義されたモジュールエクスポート設定の通りに出力される
* npm start(node bbs-server.js)
    * npmでデフォルトで定義されたタスク(install,start,testなど)のため、runを省略できる
    * サーバ起動する
