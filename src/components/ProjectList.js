import React, { useEffect } from 'react'
import axios from 'axios'
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom'
import config from "../config/const";
import moment from 'moment'

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
          <td>詳細</td>
          <td>編集</td>
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
                  <p>{moment(value.start_date).format("yyyy年MM月DD日")}</p>
                  <p>{moment(value.end_date).format("yyyy年MM月DD日")}</p>
                </td>
                <td>
                  <p className="btn btn-outline-primary"><Link to={'/project/' + value.id}>詳細</Link></p>
                </td>
                <td>
                  <p className="btn btn-outline-primary"><Link to={'/project/update/' + value.id}>編集</Link></p>
                </td>
                <td>
                  <p><Link to={'/create/task/' + value.id}>このプロジェクトにタスクを追加</Link></p>
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
