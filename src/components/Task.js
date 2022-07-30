import React from 'react'
import project from './Project'

const Task = ({ taskNumber, taskUniqueKey, taskCallback }) => {

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
      // 親コンポーネントへ通知
      taskCallback(temp);
      return temp;
    })
    return true;
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
    // 親コンポーネントにTaskコンポーネントのstateの構造を共有する
    taskCallback(task);
  }, []);

  return (
    <React.Fragment>
      <div>
        <p>ユニークKey: {taskUniqueKey}</p>
      </div>
      <section style={sectionStyle}>
        <div style={taskInputStyle}>
          <p>プロジェクトID</p>
          <input type="text" name="project_id" onChange={onInput} defaultValue={project.id}></input>
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
      </section>
    </React.Fragment>
  )
}

export default Task;
