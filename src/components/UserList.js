import React, { useEffect, useState } from 'react'
import axios from 'axios'
import config from "../config/const";
import moment from 'moment'

const UserList = () => {
  const API_TO_FETCH_USERS = config.development.host + "/api/user";

  const [ users, setUsers ] = useState([]);

  // useEffect自体は何度でも定義可能
  useEffect(() => {
    axios.get(API_TO_FETCH_USERS).then((result) => {
      console.log(result);
      if ( result.data.status ) {
        setUsers(result.data.response);
      }
    })
  }, [])

  return (
    <React.Fragment>
      <div className="panel-heading">
        <div className="row mb-5">
          <h3 className="panel-title">現在登録中ユーザーの一覧</h3>
        </div>
      </div>
      <div className="panel-heading">
        <form action="" method="get">
          <div className="row">
            <div className="col-6 mb-5">
              <p>検索キーワード</p>
              <input type="text" name="keyword" className="form-control"/>
            </div>
            <div className="col-6 mb-5">
              <p>検索キーワード</p>
              <button type="submit" value="ユーザーの検索" className="btn btn-primary">ユーザーの検索</button>
            </div>
          </div>
        </form>
      </div>
      <div className="panel-body">
        <table cellPadding="0" cellSpacing="0" className="table table-bordered" id="example">
          <thead>
          <tr>
            <th><p>ID</p></th>
            <th><p>ユーザー名</p></th>
            <th><p>所属部署</p></th>
            <th><p>参画中プロジェクト</p></th>
            <th><p>作業中タスク</p></th>
            <th><p>作成日<br/>更新日</p></th>
          </tr>
          </thead>
          <tbody>

          {users && users.map((value, index) => {
            return (
              <tr key={value.id}>
                <td>{value.id}</td>
                <td>{value.user_name}</td>
                <td></td>
                <td>{value.ProjectUsers && value.ProjectUsers.length}</td>
                <td>{value.Tasks && value.Tasks.length}</td>
                <td>
                  {moment(value.created_at).format("yyyy年MM月DD日 HH時mm分")}<br/>
                  {moment(value.updated_at).format("yyyy年MM月DD日 HH時mm分")}
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  )
}

export default UserList;
