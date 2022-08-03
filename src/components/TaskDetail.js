import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import config from '../config/const'
import axios from 'axios'

const TaskDetail = () => {

  const { id } = useParams();
  const [ task, setTask ] = useState({})
  const API_TO_FETCH_TASK_DETAIL = config.development.host + "/api/task/" + id;
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
  return (
    <React.Fragment>
      {task.id}
      {task.task_name}
      {task.task_description}
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
      })
      }
    </React.Fragment>
  )
}

export default TaskDetail;
