import React, { useEffect } from 'react'
import axios from 'axios'
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom'
import config from "../config/const";

const ProjectLit = function() {

  const apiEndPoint = config.development.host + "/api/project/search";
  const [ projectList, setProjectList ] = React.useState([]);
  console.log("ProjectList ==>", useParams());

  useEffect(() => {
    // コンポーネント表示初回のみ
    axios.get(apiEndPoint).then((result) => {
      console.log(result)
      if ( result.data.status ) {
        // stateを更新
        setProjectList(result.data.response);
      }
    }).catch((error) => {

    })

  }, []);

  let naviate = useNavigate();
  const moveToTaskList = (index) => {
    return (function(_index) {
      return (e) => {
        naviate("/project/task/" + _index);
      }
    })(index)
  }

  return (
    <React.Fragment>
      <table className="table table-bordered">
        <thead>
        <tr>
          <td>プロジェクトID</td>
          <td>
            プロジェクト名<br/>
            登録済みタスク数
          </td>
          <td>プロジェクト概要</td>
          <td>開始予定日<br/>終了予定日</td>
          <td>プロジェクト詳細へ</td>
          <td>タスクの追加</td>
          <td>タスク一覧へ</td>
        </tr>
        </thead>
        <tbody>
        {projectList.map((value, index) => {
          return (
            <React.Fragment key={index}>
              <tr>
                <td>
                  <p>{value.id}</p>
                </td>
                <td>
                  <p>{value.project_name}</p>
                  <p>({value.Tasks.length}件)</p>
                </td>
                <td>
                  <p>{value.project_description}</p>
                </td>
                <td>
                  <p>{value.start_date}</p>
                  <p>{value.end_date}</p>
                </td>
                <td>
                  <p><Link to={'/project/' + value.id}>プロジェクト詳細へ</Link></p>
                </td>
                <td>
                  <p><Link to={'/task/create/' + value.id}>このプロジェクトにタスクを追加</Link></p>
                </td>
                <td>
                  <button onClick={moveToTaskList(value.id)} className="btn btn-outline-info button-to-task-list-page">登録ずみタスク一覧へ</button>
                </td>
              </tr>
            </React.Fragment>
          );
        })}
        </tbody>
      </table>
    </React.Fragment>
  )
}

export default ProjectLit
