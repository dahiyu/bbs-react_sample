/**
 * Webサーバを実現するプログラム
 * /publicに対するアクセスは、自動的にファイルを返すようにし、API(/api/xxx)に対するアクセスを実装
 */

// --------------------------------------------------------
// 掲示板アプリのWebサーバ側
// --------------------------------------------------------
// データベースに接続 --- (*1)
/**
 * 掲示板のログを書き込むためにNeDBを利用する
 * NeDBはJSON形式でデータが保存され、1DBに1ファイルというシンプルな構成
 * 並べ替えやデータの抽出も手軽に行える
 */
const NeDB = require('nedb')
const path = require('path')
const db = new NeDB({
  // ファイルを指定
  filename: path.join(__dirname, 'bbs.db'),
  // 自動でデータをロードする場合はtrue
  autoload: true
})

// サーバを起動 --- (*2)
// expressモジュールをロードする
const express = require('express')
// expressモジュールをインスタンス化
const app = express()
const portNo = 3001
// 3001番ポートで待機する
app.listen(portNo, () => {
  console.log('起動しました', `http://localhost:${portNo}`)
})

// publicディレクトリ以下は自動的に返す --- (*3)
// 自動的に、/public/xxxへのアクセスは./public/xxxのファイルを返すように指定
app.use('/public', express.static('./public'))
// ルートへのアクセスを/publicにリダイレクトする
app.get('/', (req, res) => {
  res.redirect(302, '/public')
})

// apiの定義
// ログの取得API --- (*4)
app.get('/api/getItems', (req, res) => {
  // データベースを書き込み時刻でソートして一覧を返す
  /**
   * findメソッドでデータ抽出できる
   * 第1引数にからのオブジェクトを指定すると無条件に抽出できる(ここに{name:'hoge'}のように指定するとnameフィールドに'hoge'が入ったデータを抽出)
   * 例えば特定の値以上のデータを抽出する場合は、「{"price": {$gt: 5000}}」を指定してfindメソッドに渡す
   */
  /**
   * sortメソッドでデータの並び替えができる
   * limitメソッドでデータの件数指定ができる
   * skipメソッドでページング処理
   * updateで値の更新
   */
  // 無条件で検索し、stime順に並び替えてjsonを返す
  db.find({}).sort({stime: 1}).exec((err, data) => {
    if (err) {
      sendJSON(res, false, {logs: [], msg: err})
      return
    }
    console.log(data)
    sendJSON(res, true, {logs: data})
  })
})

// 新規ログを書き込むAPI --- (*5)
app.get('/api/write', (req, res) => {
  const q = req.query
  // URLパラメータの値をDBに書き込む
  db.insert({
    name: q.name,
    body: q.body,
    stime: (new Date()).getTime()
  }, (err, doc) => {
    if (err) {
      console.error(err)
      sendJSON(res, false, {msg: err})
      return
    }
    sendJSON(res, true, {id: doc._id})
  })
})

function sendJSON (res, result, obj) {
  obj['result'] = result
  res.json(obj)
}
