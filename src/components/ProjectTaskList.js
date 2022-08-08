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
  }
  React.useEffect(() => {
    // タスクリストをサーバー側から取得
    fetchTaskList().then((result) => {
      console.log(result);
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
      <table className="table table-bordered">
        <thead>
        <tr>
          <td>タスクID</td>
          <td>タスク名</td>
          <td>タスク概要</td>
          <td>タスクコード</td>
          <td>スター</td>
          <td>優先順位<br/>作業ステータス</td>
          <td>開始予定日<br/>終了予定日</td>
          <td>担当者ID</td>
          <td>詳細</td>
          <td>編集</td>
        </tr>
        </thead>
        <tbody>
        {taskList.map((value, index) => {
          return (
            <tr key={index}>
              <td>{value.id}</td>
              <td>{value.task_name}</td>
              <td>{value.task_description}</td>
              <td>{value.code_number}</td>
              <td>
                <button className="btn btn-outline-primary" onClick={sendStar(value.id)}>☆({value.Stars && value.Stars.length})を送る</button>
              </td>
              <td>
                {utility.priority && utility.priority.map((priority) => {
                  if ( parseInt(priority.id) === parseInt(value.priority) ) {
                    return (<p>{priority.value}</p>);
                  }
                })}
                {utility.status && utility.status.map((status) => {
                  if ( parseInt(status.id) === parseInt(value.status) ) {
                    return (<p>{status.value}</p>);
                  }
                })}
              </td>
              <td>
                {moment(value.start_date).format("yyyy年MM月DD日")}<br/>
                {moment(value.end_date).format("yyyy年MM月DD日")}
              </td>
              <td>{value.user_id}</td>
              <td>
                {/* タスク詳細ページへ遷移 */}
                <button onClick={moveToTaskDetail(value.id)} className="btn btn-outline-info button-to-task-list-page ">詳細へ</button>
              </td>
              <td>
                {/* タスク編集ページへ遷移 */}
                <button onClick={moveToTaskUpdate(id, value.id)} className="btn btn-outline-info button-to-task-list-page ">編集</button>
              </td>
            </tr>
          )
        })
        }
        </tbody>
      </table>
    </React.Fragment>
  )
}

export default ProjectTaskList;
