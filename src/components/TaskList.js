import React from 'react'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import config from "../config/const";

// projectIdに左右されないタスク一覧を取得する
function TaskList() {
  const apiEndPoint = config.development.host + "/api/task";
  const API_TO_SEND_STAR = config.development.host + "/api/star";
  const [ taskList, setTaskList ] = React.useState([]);

  React.useEffect(() => {
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
            <td>プロジェクト詳細へ</td>
            <td>タスク開始予定日<br/>タスク終了予定日^</td>
            <td>タスク詳細へ</td>
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
                <Link to={'/project/' + value.project_id}>
                  <p>{value.project_id}<br/>{value.Project.project_name}</p>
                </Link>
              </td>
              <td>
                {value.start_date}<br/>
                {value.end_date}
              </td>
              <td><button onClick={toTaskDetail(value.id)} className="btn btn-outline-info button-to-task-list-page">タスク詳細へ</button></td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </React.Fragment>
  );
}

export default TaskList
