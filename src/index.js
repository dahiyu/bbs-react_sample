/**
 * クライアント側のプログラム
 * 掲示板のログを表示し、発言を書き込む
 * Webサーバにアクセスする際には、SuperAgentモジュールを利用する
 */

import React from 'react'
import ReactDOM from 'react-dom'
import request from 'superagent'

// 書き込みフォームのコンポーネントを定義 --- (*1)
class BBSForm extends React.Component {
  // 初期化：コンポーネントの状態を初期化するには、コンストラクタの中で、this.stateにオブジェクトを利用する
  // stateオブジェクトは一度値を設定したあとは、直接値を書き換えることはせず、setStateメソッドを介して値を変更するように定められている
  // setStateメソッドが呼び出されて状態が変化すると、自動的にrender()メソッドが実行されて再描画が行われる仕組みになっている
  // 参照：一般的なオブジェクトと同じように「this.state.名前」で状態を参照できる
  // 更新：値を更新する場合はthis.setState({名前:新しい値})を利用する
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      body: ''
    }
  }
  // テキストボックスの値が変化した時の処理
  // 名前inputのvalueが変更されるたびに呼ばれるように定義している(render内)
  nameChanged (e) {
    // this.setStateでnameの状態を更新
    // e.target.valueでinputのvalueを取る
    this.setState({name: e.target.value})
  }
  bodyChanged (e) {
    this.setState({body: e.target.value})
  }
  // Webサーバに対して書き込みを投稿する --- (*2)
  // superAgentのgetメソッドを利用する
  post (e) {
    request
      .get('/api/write')
      .query({
        name: this.state.name,
        body: this.state.body
      })
      .end((err, data) => {
        if (err) {
          console.error(err)
        }
        // 書き込みすると本文の入力欄をクリア
        this.setState({body: ''})
        if (this.props.onPost) {
          this.props.onPost()
        }
      })
  }
  render () {
    return (
      <div style={styles.form}>
        名前:<br />
        <input type='text' value={this.state.name} onChange={e => this.nameChanged(e)} /><br />
        本文:<br />
        <input type='text' value={this.state.body} size='60' onChange={e => this.bodyChanged(e)} /><br />
        <button onClick={e => this.post()}>発言</button>
      </div>
    )
  }
}

// メインコンポーネントを定義 --- (*3)
// 書き込みフォーム部分をBBSFormコンポーネントとして分離しているため、ログ出力に集中できる
class BBSApp extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      items: []
    }
  }
  // コンポーネントがマウントされたらログを読み込む
  // コンポーネントがDOMにマウントされる直前に呼ばれる
  // 呼ばれる順番
  // 1.constructor
  // 2.componentWillMount(コンポーネントがDOMにマウントされる直前)
  // 3.render(コンポーネントが描画される)
  // 4.componentDidMount(コンポーネントがDOMにマウントされた直後)の順
  componentWillMount () {
    this.loadLogs()
  }
  // APIにアクセスして掲示板のログ一覧を取得 --- (*4)
  loadLogs () {
    request
      .get('/api/getItems')
      .end((err, data) => {
        if (err) {
          console.error(err)
          return
        }
        this.setState({items: data.body.logs})
      })
  }
  render () {
    // 発言ログの一つずつを生成する ---- (*5)
    const itemsHtml = this.state.items.map(e => (
      <li key={e._id}>{e.name} - {e.body}</li>
    ))
    return (
      <div>
        <h1 style={styles.h1}>掲示板</h1>
        <BBSForm onPost={e => this.loadLogs()} />
        <p style={styles.right}>
          <button onClick={e => this.loadLogs()}>再読込</button>
        </p>
        <ul>{itemsHtml}</ul>
      </div>
    )
  }
}

const styles = { // スタイルを定義
  h1: {
    backgroundColor: 'blue',
    color: 'white',
    fontSize: 24,
    padding: 12
  },
  form: {
    padding: 12,
    border: '1px solid silver',
    backgroundColor: '#F0F0F0'
  },
  right: {
    textAlign: 'right'
  }
}

// DOMにメインコンポーネントを書き込む
ReactDOM.render(
  <BBSApp />,
  document.getElementById('root'))
