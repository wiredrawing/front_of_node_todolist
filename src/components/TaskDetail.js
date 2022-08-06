import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import config from '../config/const'
import axios from 'axios'
import CreateComment from './CreateComment'
import TaskComment from './TaskComment'


const TaskDetail = () => {

  const { id } = useParams();
  const [ task, setTask ] = useState({})
  const [ newCommentId, setNewCommentId ] = useState(0);
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
  const completedAddNewComment = (newCommentId) => {
    console.log(newCommentId);
    setNewCommentId(newCommentId);
  }
  return (
    <React.Fragment>
      <section id="task-detail">
        {task.id}
        {task.task_name}
        {task.task_description}
        ☆:{task.Stars && task.Stars.length}
        <p>本タスク添付画像一覧</p>
        <div id="task-images-wrapper" style={taskImagesWrapper}>
          {task.TaskImages && task.TaskImages.map((value, index) => {
            return (
              <div className="common-image-wrapper task-image-unit-box" style={taskImageUnitBox} key={value.image_id}>
                <p><img alt={value.image_id} className="ajust" width="100%" src={API_TO_SHOW_IMAGE + "/" + value.image_id}/></p>
              </div>
            )
          })}
        </div>
        <CreateComment taskId={id} callback={completedAddNewComment}/>
        <hr/>
        <TaskComment taskId={id} newCommentid={newCommentId}/>
      </section>
    </React.Fragment>
  )
}

export default TaskDetail;
