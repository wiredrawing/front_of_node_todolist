import React, { useState } from 'react'
import Image from './Image'
import config from '../config/const'
import axios from 'axios'

const CreateComment = ({
                         taskId,
                         callback,
                       }) => {

  const API_TO_ADD_NEW_COMMENT = config.development.host + "/api/taskcomment/create";
  const API_TO_SHOW_IMAGE = config.development.host + "/api/image/show";
  const [ imageIdList, setImageIdList ] = useState([])
  const [ comment, setComment ] = useState({
    task_id: 0,
    comment: "",
    user_id: 1,
    image_id: imageIdList,
  });

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
      if ( result.data.status ) {
        setComment((previous) => {
          console.log(previous);
          return {
            task_id: 0,
            comment: "",
            user_id: 1,
            image_id: imageIdList,
          }
        });
        setImageIdList([]);
        callback(result.data.response.id);
        // アップロード成功後入力フォームを空にする

      }
    })
  }

  // クリックしたアップロード済みの画像を除外する
  const deleteThisImage = (index) => {
    return (e) => {
      let temp = imageIdList.slice();
      temp.splice(index, 1);
      console.log(temp);
      setImageIdList(temp);
    }
  }

  return (
    <React.Fragment>
      <div className="content-box-large">
        <div className="row">
          <h2>コメント投稿フォーム</h2>
          <div className="row ">
            <Image callback={completedUploadingImage}/>
          </div>

          <div id="uploaded-file-block" className="row">
            {imageIdList.map((value, index) => {
              return (
                <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <div className="images-to-be-uploaed" key={value}>
                    <img onDoubleClick={deleteThisImage(index)} alt={value} width="20%" className="ajust" src={API_TO_SHOW_IMAGE + "/" + value}/>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <p>コメント内容</p>
              <textarea onChange={(e) => {
                inputComment(e)
              }} name="comment" className="form-control" id="task_description" defaultValue={comment.comment} value={comment.comment} cols="50 " rows="10"/>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4 col-md-4 col-lg-4 col-xl-4s">
              <p>
                <button id="post-task-comment" type="button" onClick={addNewComment} className="btn btn-outline-primary">上記内容でコメント追加</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default CreateComment;
