import React from 'react'
import Task from './Task'

const Project = () => {

  const[taskUniqueKey, setTaskUniqueKey] = React.useState(0);
  const taskUniqueKeyCountUp = () => {
    setTaskUniqueKey((previous) => {
      previous = previous + 1;
      return previous;
    });
    return taskUniqueKey;
  }
  const taskCallback = (taskOriginal) => {
    console.log("Taskコンポーネントからの通知--->", taskOriginal)
  }
  const [ taskList, setTaskList ] = React.useState([]);
  const [ project, setProject ] = React.useState({
    project_name: "",
    project_description: "",
    start_date: "",
    end_date: "",
    is_displayed: "",
    user_id: "",
    code_number: "",
  });
  console.log(project);
  const updateProject = (e) => {
    console.log(e);
    let targetKey = e.target.name;
    setProject((previous) => {
      previous[targetKey] = e.target.value;
      return Object.assign({}, previous);
    });
  }

  // delete the task which you clicked.
  const deleteThisTask = (deleteIndex) => {
    alert(deleteIndex);
    setTaskList((previous) => {
      let temp = previous.slice();
      temp.splice(deleteIndex, 1);
      return temp;
    })
  }
  // add task record.
  const addTask = () => {
    setTaskList((previous) => {
      let temp = [...previous];
      // ユニークkeyをカウントアップ
      temp.push({unique_key: taskUniqueKeyCountUp()});
      return temp;
    })
  }
  return (
    <React.Fragment>
      <section>
        <div>
          <p>プロジェクト名</p>
          <input onInput={(e) => updateProject(e)} type="text" name="project_name" defaultValue={project.project_name}></input>
        </div>
        <div>
          <p>プロジェクト概要</p>
          <textarea onInput={(e) => updateProject(e)} name="project_description" defaultValue={project.project_description}/>
        </div>
        <div>
          <p>プロジェクト開始予定日</p>
          <input onInput={(e) => updateProject(e)} type="text" name="start_date" defaultValue={project.start_date}></input>
        </div>
        <div>
          <p>プロジェクト終了予定日</p>
          <input onInput={(e) => updateProject(e)} type="text" name="end_date" defaultValue={project.end_date}></input>
        </div>
      </section>
      <section>
        <div>
          <p>プロジェクト名</p>
          <p>{project.project_name}</p>
        </div>
        <div>
          <p>プロジェクト概要</p>
          <p>{project.project_description}</p>
        </div>
        <div>
          <p>プロジェクト開始予定日</p>
          <p>{project.start_date}</p>
        </div>
        <div>
          <p>プロジェクト終了予定日</p>
          <p>{project.end_date}</p>
        </div>
      </section>
      <section id="task-list">
        {taskList.map((task, index) => {
          return (
            <React.Fragment key={task.unique_key}>
              {task.unique_key}
              <Task taskCallback={taskCallback} taskUniqueKey={task.unique_key}></Task>
              <button onClick={(e) => deleteThisTask(index)}>このタスクを削除</button>
            </React.Fragment>
          );
        })}
      </section>
      <button onClick={addTask}>Add task record.</button>
    </React.Fragment>
  );
}

export default Project;
