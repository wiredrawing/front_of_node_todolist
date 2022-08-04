import React, { useState } from 'react'
import Image from './Image'
import image from './Image'
import config from '../config/const'
import axios from 'axios'

const CreateComment = ({ taskId }) => {

  const API_TO_ADD_NEW_COMMENT = config.development.host + "/api/taskcomment/create";
  const [ imageIdList, setImageIdList ] = useState([])
  const [ comment, setComment ] = useState({
    task_id: 0,
    comment: "",
    user_id: 1,
    image_id: imageIdList,
  });


  const createNewCommentWrapper = {
    display: "flex",
    flexWrap: "wrap",
  }
  const createNewCommentUnitBox = {
    width: "45%",
  }
  const completedUploadingImage = (imageId) => {
    setImageIdList((previous) => {
      let temp = previous.slice();
      temp.push(imageId);
      return temp;
    })
  }
  const inputComment = (e) => {
    setComment((previous) => {
      let temp = Object.assign({}, previous);
      temp[e.target.name] = e.target.value;
      return temp;
    })
  }
  // 入力したコメント内容を登録する
  const addNewComment = () => {
    let postData = Object.assign({}, comment);
    postData.image_id = imageIdList;
    postData.task_id = taskId;
    axios.post(API_TO_ADD_NEW_COMMENT, postData).then((result) => {
      console.log(result);
    })
  }

  return (
    <React.Fragment>
      <section id="create-new-comment-wrapper" style={createNewCommentWrapper}>
        <div id="new-comment" style={createNewCommentUnitBox}>
          <textarea onChange={(e) => {inputComment(e)}} name="comment" defaultValue={comment.comment}/>
        </div>
        <div id="submit-new-comment">
          <button onClick={addNewComment} className="btn btn-primary">上記内容でコメント追加</button>
        </div>
      </section>
      <Image callback={completedUploadingImage}/>
    </React.Fragment>
  )
}

export default CreateComment;
