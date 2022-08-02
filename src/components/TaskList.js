import React from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'

function TaskList() {

  const {projectId} = useParams();
  const apiEndPoint = "http://localhost:3000/api/task";
  const [ taskList, setTaskList ] = React.useState([]);

  React.useEffect(() => {

    axios.get(apiEndPoint, {}).then((result) => {
      console.log(result);

      if ( result.data.status ) {
        setTaskList(result.data.response)
      }
    }).catch((error) => {

    })
  }, [])

  const taskListBox = {
    display: "flex",
    flexWrap: "wrap",
  }
  const taskUnitBox = {
    width: "30%",
    backgroundColor: "#DDD",
    margin: "1%",
  }
  return (
    <React.Fragment>
      <div id="task-list-box" style={taskListBox}>
        {taskList.map((value, index) => {
          return (
            <div className="task-unit-box" key={index} style={taskUnitBox}>
              <Link to={'/project/' + value.project_id}><p>{value.project_id}<br/>{value.Project.project_name}</p></Link>
              <p>{value.task_name}</p>
              <p>{value.task_description}</p>
            </div>
          )
        })}
      </div>
    </React.Fragment>
  );
}

export default TaskList
