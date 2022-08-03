import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import config from "../config/const"
import axios from 'axios'

const ProjectTaskList = ({ projectId }) => {
  const [ taskList, setTaskList ] = useState([]);
  const { id } = useParams();
  console.log("projectId ====> ", projectId);
  console.log("id ====> ", id);
  const apiEndPoint = config.development.host + "/api/project/task/" + id

  // レンダリング初回のみロード
  React.useEffect(() => {
    axios.get(apiEndPoint, {}).then((result) => {
      console.log(result);
      if ( result.data.status ) {
        setTaskList(result.data.response);
        console.log(taskList);
      }
    })
  }, []);

  return (
    <React.Fragment>
      <table className="table table-bordered">
        <thead>
          <tr>
            <td>タスクID</td>
            <td>タスク名</td>
            <td>タスク概要</td>
            <td>タスクコード</td>
            <td>開始予定日<br/>終了予定日</td>
            <td>担当者ID</td>
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
              <td>{value.start_date}<br/>{value.end_date}</td>
              <td>{value.user_id}</td>
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
