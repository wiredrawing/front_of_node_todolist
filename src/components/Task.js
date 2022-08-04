import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import ProjectDetail from './ProjectDetail'
import Image from './Image'
import config from '../config/const'

const Task = () => {
  const params = useParams();
  let projectId = 0;
  if ( params.projectId ) {
    projectId = params.projectId;
  }
  // タスクに追加する画像リスト
  const [ taskImages, setTaskImages ] = useState([]);
  const completedUploadingImage = (imageId) => {
    setTaskImages((previous) => {
      let temp = previous.slice();
      temp.push(imageId);
      return temp;
    })
  }
  const sectionStyle = {
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "#DEDEDE",
    margin: "1%",
    padding: "1%",
  }
  const taskInputStyle = {
    width: "20%",
  }
  // 作業中のプロジェクト情報を取得する
  const API_TO_FETCH_PROJECT_INFO = config.development.host + "/api/project/detail/" + projectId
  const API_TO_ADD_NEW_TASK = config.development.host + "/api/task/create/"
  const API_TO_SHOW_IMAGE = config.development.host + "/api/image/show";
  const [ task, setTask ] = React.useState({
    unique_key: "",
    task_name: "",
    task_description: "",
    start_date: "",
    end_date: "",
    priority: "",
    status: "",
    // code_number: "",
    user_id: 1,
    image_id: taskImages,
    project_id: projectId,
  });

  // 新規タスク情報登録ボタン押下時
  let navigate = useNavigate();
  const addTaskInfo = (e) => {
    setTask((previous) => {
      let temp = Object.assign({}, previous);
      temp.project_id = projectId
      return temp;
    })
    let postData = Object.assign({}, task);
    // タスク用画像を追加
    postData.image_id = taskImages;
    axios.post(API_TO_ADD_NEW_TASK, postData).then((result) => {
      console.log(result);
      if ( result.data.status ) {
        // 新規タスクの登録に完了したら当該プロジェクトのタスク一覧へ遷移させる
        navigate("/project/task/" + projectId);
        return true;
      }
      return false;
    }).catch((error) => {

    })
  }
  // 入力イベントの度に親コンポーネントにデータを共有する
  const onInput = (event) => {
    setTask((previous) => {
      let temp = Object.assign({}, previous);
      temp[event.target.name] = event.target.value;
      return temp;
    })
    return true;
  }

  React.useEffect(() => {
    (async () => {
      // コンポーネント初回表示時に作業中のプロジェクト情報を取得する
      let project = await axios.get(API_TO_FETCH_PROJECT_INFO, {}).then((result) => {
        console.log(result);
        if ( result.data.status ) {
          console.log("API通信成功");
          let temp = Object.assign(null, result.data.response)
          console.log(result.data.response);
          // setProject(result.data.response);
          console.log("project --->", project);
        }
      }).catch((error) => {

      })
      console.log(project);
    })();

    // 親コンポーネントにTaskコンポーネントのstateの構造を共有する

  }, []);

  return (
    <React.Fragment>
      <ProjectDetail projectId={projectId}></ProjectDetail>
      <section style={sectionStyle}>
        <div style={taskInputStyle}>
          <p>プロジェクトID</p>
          <input type="text" name="project_id" onChange={onInput} defaultValue={projectId}></input>
        </div>
        <div style={taskInputStyle}>
          <p>タスク名</p>
          <input type="text" name="task_name" onInput={onInput} defaultValue={task.task_name}></input>
        </div>
        <div style={taskInputStyle}>
          <p>タスク概要</p>
          <input type="text" name="task_description" onChange={onInput} defaultValue={task.task_description}></input>
        </div>
        <div style={taskInputStyle}>
          <p>優先順位</p>
          <input type="text" name="priority" onChange={onInput} defaultValue={task.priority}></input>
        </div>
        <div style={taskInputStyle}>
          <p>ステータス</p>
          <input type="text" name="status" onChange={onInput} defaultValue={task.status}></input>
        </div>
        <div style={taskInputStyle}>
          <p>タスクコード</p>
          <input type="text" name="code_number" onChange={onInput} defaultValue={task.code_number}></input>
        </div>
        <div style={taskInputStyle}>
          <p>タスク開始予定日</p>
          <input type="text" name="start_date" onChange={onInput} defaultValue={task.start_date}></input>
        </div>
        <div style={taskInputStyle}>
          <p>タスク終了予定日</p>
          <input type="text" name="end_date" onChange={onInput} defaultValue={task.end_date}></input>
        </div>
        <div style={taskInputStyle}>
          <button id="add-task-button" onClick={addTaskInfo}>
            上記内容でタスクを登録する
          </button>
        </div>
      </section>
      <div id="task-images">
        {taskImages.map((value, index) => {
          return (
            <img width="15%" src={API_TO_SHOW_IMAGE + "/" + value}/>
          )
        })}
      </div>
      <Image callback={completedUploadingImage}/>
    </React.Fragment>
  )
}

export default Task;
