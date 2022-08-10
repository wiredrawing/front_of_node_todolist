import React from 'react'
import { BrowserRouter, Link } from 'react-router-dom'

const SideBar = () => {

  return (
    <React.Fragment>
      {/*Linkタグを使用する場合は必ずBrowserRouterでwrapする必要がある*/}
        <div className="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
          <div className="sidebar content-box">
            <ul className="nav row">
              <li>
                <Link to="/">TOP</Link>
              </li>
              <li>
                <Link to="/project">プロジェクト一覧</Link>
              </li>
              <li>
                <Link to="/project/create">新規プロジェクト作成</Link>
              </li>
              <li>
                <Link to="/user/list">ユーザー一覧</Link>
              </li>
              <li>
                <Link to="/task">タスク一覧</Link>
              </li>
              <li>
                <Link to="/image/list">アップロード済み画像</Link>
              </li>
            </ul>
          </div>
          <div className="sidebar content-box">
            <ul className="nav row">
              <li>
                <a id="logout-button" href="/logout">ログアウト</a>
              </li>
            </ul>
          </div>
        </div>
    </React.Fragment>
)
}

export default SideBar
