
import React, { useState } from 'react'
import Image from './Image'

const CreateComment = ({taskId}) => {

  const [comment,setComment] = useState({
    task_id: taskId,
    comment: "",
    user_id: "",
  });

  const createNewCommentWrapper = {
    display: "flex",
    flexWrap: "wrap",
  }
  const createNewCommentUnitBox = {
    width: "45%",
  }
  const completedUploadingImage = (imageId) => {
    alert(imageId);
  }
  return (
    <React.Fragment>
      <section id="create-new-comment-wrapper" style={createNewCommentWrapper}>
        <div id="new-comment" style={createNewCommentUnitBox}>
          <textarea name="comment" defaultValue={comment.comment}/>
        </div>
        <div id="submit-new-comment">
          <button className="btn btn-primary">上記内容でコメント追加</button>
        </div>
      </section>
      <Image callback={completedUploadingImage}/>
    </React.Fragment>
  )
}



export default CreateComment;
