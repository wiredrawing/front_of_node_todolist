import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import config from '../config/const'
import axios from 'axios'
import CreateComment from './CreateComment'

const TaskDetail = () => {

  const { id } = useParams();
  const [ task, setTask ] = useState({})
  const API_TO_FETCH_TASK_DETAIL = config.development.host + "/api/task/" + id;
  const API_TO_SHOW_IMAGE = config.development.host + "/api/image/show";
  console.log(id);

  useEffect(() => {
    axios.get(API_TO_FETCH_TASK_DETAIL).then((result) => {
      console.log(result);
      if ( result.data.status ) {
        setTask((previous) => {
          return Object.assign({}, result.data.response);
        })
      }
    })
  }, [])

  const taskImagesWrapper = {
    display: "flex",
    flexWrap: "wrap",
  }
  const taskImageUnitBox = {
    width: "20%",
    margin: "1%"
  }
  return (
    <React.Fragment>
      <section id="task-detail">
        {task.id}
        {task.task_name}
        {task.task_description}
        <p>本タスク添付画像一覧</p>
        <div id="task-images-wrapper" style={taskImagesWrapper}>
          {task.TaskImages && task.TaskImages.map((value, index) => {
            return (
              <div className="task-image-unit-box" style={taskImageUnitBox}>
                <p><img className="ajust" width="100%" src={API_TO_SHOW_IMAGE + "/" + value.image_id}/></p>
              </div>
            )
          })}
        </div>
        <CreateComment taskId={task.id}/>
        <hr/>
        {task.TaskComments && task.TaskComments.map((value, index) => {
          return (
            <React.Fragment>
              <p>{value.id}</p>
              <p>{value.comment}</p>
              {value.CommentImages.map((value, index) => {
                return (
                  <p>{value.image_id}</p>
                )
              })}
            </React.Fragment>
          )
        })}
      </section>
    </React.Fragment>
  )
}

export default TaskDetail;
