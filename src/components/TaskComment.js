import React, { useEffect, useState } from 'react'
import config from '../config/const'
import axios from 'axios'
import task from './Task'

const TaskComment = ({ taskId }) => {
  const [ taskComments, setTaskComments ] = useState([]);
  const API_TO_FETCH_TASKCOMMENT = config.development.host + "/api/taskcomment/" + taskId;
  const API_TO_SHOW_IMAGE = config.development.host + "/api/image/show";
  // axios.get(API_TO_FETCH_TASKCOMMENT).then((result) => {
  //   setTaskComments((previous) => {
  //     console.log(previous)
  //     return result.data.response
  //   });
  //   console.log(result);
  //   console.log("=======================");
  // })
  useEffect(() => {
    console.log("=======================");
    axios.get(API_TO_FETCH_TASKCOMMENT).then((result) => {
      console.log("RESULT ====> ", result);
      if ( result.data.status ) {
        setTaskComments((previous) => {
          console.log(previous)
          return result.data.response
        });
        console.log(result);
        console.log("=======================");
      }
    })

  }, [])
  const imagesWrapper = {
    display: "flex",
    flexWrap: "wrap",
  }
  const innerImagesWrapper = {
    width: "20%",
    margin: "2%",
  }
  return (
    <React.Fragment>
      {taskComments.map((value) => {
        return (
          <React.Fragment>
            <p>{value.id}</p>
            <p>{value.comment}</p>
            <div className="images-wrapper" style={imagesWrapper}>
              {value.CommentImages.map((value, index) => {
                return (
                  <div className="inner-images-wrapper" style={innerImagesWrapper}>
                    <img className="ajust" src={API_TO_SHOW_IMAGE + "/" + value.image_id}></img>{value.image_id}
                  </div>
                )
              })}
            </div>
          </React.Fragment>
        )
      })}
    </React.Fragment>

  )

}

export default TaskComment;
