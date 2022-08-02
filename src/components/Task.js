import React from 'react'
// import CreateProject from './CreateProject'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import ProjectDetail from './ProjectDetail'

const Task = ({
                taskNumber,
                taskUniqueKey
              }) => {
  const params = useParams();
  let projectId = 0;
  if ( params.projectId ) {
    projectId = params.projectId;
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
  const FETCH_PROJECT_INFO = "http://localhost:3000/api/project/detail/" + projectId
  const ADD_NEW_TASK = "http://localhost:3000/api/task/create/"
  // const [ project, setProject ] = React.useState({});
  const [ task, setTask ] = React.useState({
    unique_key: "",
    task_name: "",
    task_description: "",
    start_date: "",
    end_date: "",
    priority: "",
    status: "",
    code_number: "",
  });
  const updateTask = (e) => {
    setTask((previous) => {
      let temp = Object.assign({}, previous);
      temp[e.target.name] = e.target.value;
      return temp;
    })
    return true;
  }

  // 新規タスク情報登録ボタン押下時
  const addTaskInfo = (e) => {
    setTask((previous) => {
      let temp = Object.assign({}, previous);
      temp.project_id = projectId
      return temp;
    })
    let postData = Object.assign({}, task);
    axios.post(ADD_NEW_TASK, postData).then((result) => {
      console.log(result);
      if (result.data.status) {

        return true;
      }
      return false;
    }).catch((error) => {

    })
  }
  // 入力イベントの度に親コンポーネントにデータを共有する
  const onInput = (event) => {
    let response = updateTask(event);
    return true;
  }

  // 指定したフォーム要素を削除する
  const deleteThisTaskForm = () => {

  }

  React.useEffect(() => {
    (async () => {
      // コンポーネント初回表示時に作業中のプロジェクト情報を取得する
      let project = await axios.get(FETCH_PROJECT_INFO, {}).then((result) => {
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
      <div>
        <p>ユニークKey: {taskUniqueKey}</p>
      </div>
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
      -
    </React.Fragment>
  )
}

export default Task;
