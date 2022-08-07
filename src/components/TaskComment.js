import React, { useEffect, useState } from 'react'
import config from '../config/const'
import axios from 'axios'
import task from './Task'
import taskComment from './TaskComment'

const TaskComment = ({
                       taskId,
                       newCommentid
                     }) => {
  const [ taskComments, setTaskComments ] = useState([]);
  const API_TO_FETCH_TASKCOMMENT = config.development.host + "/api/taskcomment/" + taskId;
  const API_TO_SHOW_IMAGE = config.development.host + "/api/image/show";
  useEffect(() => {
    console.log("=======================");
    axios.get(API_TO_FETCH_TASKCOMMENT).then((result) => {
      console.log("RESULT ====> ", result);
      if ( result.data.status ) {
        setTaskComments((previous) => {
          console.log(previous)
          return result.data.response
        });
      }
    })

  }, [ newCommentid ])
  const imagesWrapper = {
    display: "flex",
    flexWrap: "wrap",
  }
  const innerImagesWrapper = {
    width: "10%",
    margin: "2%",
  }
  const commentUnitBox = {
    backgroundColor: "#DEDEDE",
    marginTop: "2%",
  }
  return (
    <React.Fragment>
      {taskComments !== null && taskComments.map((value) => {
        return (
          <section className="task-comment-unit-box" style={commentUnitBox} key={value.id}>
            <p>{value.id}</p>
            <p>{value.comment.split("\n").map((value) => {
              return (
                <React.Fragment>{value}<br/></React.Fragment>
              )
            })}</p>
            <div className="images-wrapper" style={imagesWrapper}>
              {value.CommentImages.map((value, index) => {
                return (
                  <div className="inner-images-wrapper" style={innerImagesWrapper} key={value.image_id}>
                    <img alt={value.image_id} className="ajust" src={API_TO_SHOW_IMAGE + "/" + value.image_id}></img>
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
    </React.Fragment>

  )

}

export default TaskComment;
