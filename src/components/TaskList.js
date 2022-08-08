import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import config from "../config/const";
import moment from 'moment'

// projectIdに左右されないタスク一覧を取得する
function TaskList() {
  const apiEndPoint = config.development.host + "/api/task";
  const API_TO_SEND_STAR = config.development.host + "/api/star";
  const API_TO_FETCH_UTILITY = config.development.host + "/api/utility";
  const [utility, setUtility ] = useState({});
  const fetchUtility = () => {
    axios.get(API_TO_FETCH_UTILITY).then((result) => {
      if (result.data.status) {
        setUtility(result.data.response);
      }
    })
  }
  const [ taskList, setTaskList ] = React.useState([]);
  React.useEffect(() => {
    // ユーティリティを取得
    fetchUtility();
    axios.get(apiEndPoint, {}).then((result) => {
      console.log(result);
      if ( result.data.status ) {
        setTaskList(result.data.response)
      }
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  // 実行された行数をクロージャー化する
  const navigate = useNavigate();
  const toTaskDetail = (index) => {
    let closureNumber = index;
    return function (event) {
      console.log(event);
      navigate("/task/" + closureNumber)
    }
  }
  // タスク編集ページへ移動
  const toTaskUpdate = (projectId, taskId) => {
    return function (event) {
      console.log(event);
      return navigate("/task/update/" + projectId + "/" + taskId);
    }
  }
  /**
   * 引数に指定したタスクIDに対してスターを送る
   * @param taskId
   */
  const sendStar = (taskId) => {
    return (e) => {
      let postData = {
        task_id: taskId,
        user_id: 1,
      }
      axios.post(API_TO_SEND_STAR + "/" + taskId, postData).then((result) => {
        console.log(result);
        axios.get(apiEndPoint, {}).then((result) => {
          console.log(result);
          if ( result.data.status ) {
            setTaskList(result.data.response)
          }
        }).catch((error) => {
          console.log(error);
        })
      }).catch((error) => {
        console.log(error);
      });
    }
  }
  return (
    <React.Fragment>
      <table  className="table table-bordered" id="tasks-you-need-to-to" >
        <thead>
          <tr>
            <td>タスクID</td>
            <td>プロジェクトID</td>
            <td>タスク名</td>
            <td>タスク概要</td>
            <td>スター</td>
            <td>優先順位<br/>作業ステータス</td>
            <td>プロジェクト詳細へ</td>
            <td>タスク開始予定日<br/>タスク終了予定日</td>
            <td>詳細</td>
            <td>編集</td>
          </tr>
        </thead>
        <tbody>
        {taskList.map((value, index) => {
          return (
            <tr key={value.id}>
              <td>{value.id}</td>
              <td>{value.project_id}</td>
              <td>{value.task_name}</td>
              <td>{value.task_description}</td>
              <td>
                ☆:{value.Stars.length}<br/>
                <button onClick={sendStar(value.id)} className="btn btn-outline-primary">☆を送る</button>
              </td>
              <td>
                {utility.priority && utility.priority.map((priority) => {
                  if (parseInt(priority.id) === parseInt(value.priority)) {
                    return (<p>{priority.value}</p>);
                  }
                })}
                {utility.status && utility.status.map((status) => {
                  if (parseInt(status.id) === parseInt(value.status)) {
                    return (<p>{status.value}</p>);
                  }
                })}
              </td>
              <td>
                <Link to={'/project/' + value.project_id}>
                  <p>{value.project_id}<br/>{value.Project.project_name}</p>
                </Link>
              </td>
              <td>
                {moment(value.start_date).format("yyyy年MM月DD日")}<br/>
                {moment(value.end_date).format("yyyy年MM月DD日")}
              </td>
              <td><button onClick={toTaskDetail(value.id)} className="btn btn-outline-info button-to-task-list-page">詳細へ</button></td>
              <td><button onClick={toTaskUpdate(value.project_id, value.id)} className="btn btn-outline-info button-to-task-list-page">編集へ</button></td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </React.Fragment>
  );
}

export default TaskList
