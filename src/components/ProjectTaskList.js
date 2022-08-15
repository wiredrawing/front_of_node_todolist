import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import config from "../config/const"
import axios from 'axios'
import moment from 'moment'

const ProjectTaskList = () => {
  let navigate = useNavigate();
  const [ taskList, setTaskList ] = useState([]);
  const { id } = useParams();
  const [ utility, setUtility ] = useState({});
  console.log("projectId ====> ", id);
  console.log("id ====> ", id);
  const apiEndPoint = config.development.host + "/api/project/task/" + id
  const API_TO_SEND_STAR = config.development.host + "/api/star"
  const API_TO_FETCH_UTILITY = config.development.host + "/api/utility";
  // ユーティリティ情報を取得する
  const fetchUtility = () => {
    axios.get(API_TO_FETCH_UTILITY).then((result) => {
      if ( result.data.status ) {
        setUtility((previous) => {
          console.log("utility ---->", result.data.response);
          return result.data.response;
        })
      }
    })
  }
  // レンダリング初回のみロード
  const fetchTaskList = async () => {
    let temp = await axios.get(apiEndPoint, {});
    if ( temp.data.status ) {
      setTaskList(temp.data.response);
    }
    return temp.data.response;
  }
  React.useEffect(() => {
    // タスクリストをサーバー側から取得
    fetchTaskList().then((result) => {
      console.log("fetchTaskList ---->", result);
    })
    // utilityを取得
    fetchUtility();
  }, []);

  const moveToTaskDetail = (index) => {
    let taskNumber = index;
    return function(e) {
      navigate("/task/" + taskNumber);
    }
  }
  const moveToTaskUpdate = (projectId, taskId) => {
    // タスク編集ページへ遷移させる
    return (e) => {
      alert(id);
      alert(taskId);
      return navigate("/task/update/" + id + "/" + taskId)
    }
  }

  const sendStar = (taskId) => {
    return (e) => {
      let postData = {
        task_id: taskId,
        user_id: 1,
      }
      axios.post(API_TO_SEND_STAR + "/" + taskId, postData).then((result) => {
        console.log(result);
        fetchTaskList().then((result) => {
          console.log(result);
        })
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  return (
    <React.Fragment>
      <div className="panel-heading">
        <div className="row mb-5">
          <div className="panel-title">現在登録中プロジェクトの一覧</div>
        </div>
      </div>
      <div className="panel-heading">
        <div className="row">
          <div className="col-6 mb-5">
            <p>検索キーワード</p>
            <input type="text" className="form-control"/>
          </div>
          <div className="col-6 mb-5">
            <p>検索キーワード</p>
            <input className="btn btn-primary" type="button" value="プロジェクトの検索"/>
          </div>
        </div>
      </div>
      <div className="panel-body">
        <table cellPadding="0" cellSpacing="0" className="table table-bordered" id="example">
          <thead>
          <tr>
            <th>ID</th>
            <th>タスク名</th>
            <th>概要</th>
            <th>作業者</th>
            <th>開始日<br/>終了日</th>
            <th>作成日<br/>更新日</th>
            <th>詳細</th>
            <th>編集</th>
            <th>優先順位<br/>ステータス</th>
            <th>スター★</th>
          </tr>
          </thead>
          <tbody>
          {taskList && taskList.map((value, index) => {
            return (
              <tr key={value.id}>
                <td>{value.id}</td>
                <td>{value.task_name}</td>
                <td>{value.task_description}</td>
                <td>
                  {value.User && value.User.user_name}
                </td>
                <td>
                  {moment(value.start_date).format("yyyy年MM月DD日")}<br/>
                  {moment(value.end_date).format("yyyy年MM月DD日")}
                </td>
                <td>
                  {moment(value.created_at).format("yyyy年MM月DD日 HH時mm分")}<br/>
                  {moment(value.updated_at).format("yyyy年MM月DD日 HH時mm分")}
                </td>
                <td>
                  {/* タスク詳細ページへ遷移 */}
                  <button onClick={moveToTaskDetail(value.id)} className="btn btn-outline-info button-to-task-list-page ">詳細へ</button>
                </td>
                <td>
                  {/* タスク編集ページへ遷移 */}
                  <button onClick={moveToTaskUpdate(id, value.id)} className="btn btn-outline-info button-to-task-list-page ">編集</button>
                </td>
                <td>
                  {utility.priority && utility.priority.map((priority) => {
                    if ( parseInt(priority.id) === parseInt(value.priority) ) {
                      return (<p key={priority.value}>{priority.value}</p>);
                    }
                  })}
                  {utility.status && utility.status.map((status) => {
                    if ( parseInt(status.id) === parseInt(value.status) ) {
                      return (<p key={status.value}>{status.value}</p>);
                    }
                  })}
                </td>
                <td>
                  <button className="btn btn-outline-primary" onClick={sendStar(value.id)}>
                    ☆({value.Stars && value.Stars.length})
                  </button>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
      </div>

    </React.Fragment>
  )
}

export default ProjectTaskList;
