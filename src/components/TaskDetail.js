import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import config from '../config/const'
import axios from 'axios'
import CreateComment from './CreateComment'
import TaskComment from './TaskComment'
import moment from 'moment'

const TaskDetail = () => {

  const { id } = useParams();
  const [ task, setTask ] = useState({})
  const [ newCommentId, setNewCommentId ] = useState(0);
  const API_TO_FETCH_TASK_DETAIL = config.development.host + "/api/task/" + id;
  const API_TO_SHOW_IMAGE = config.development.host + "/api/image/show";
  console.log(id);
  console.log(API_TO_FETCH_TASK_DETAIL);
  useEffect(() => {
    console.log("=========================================");
    axios.get(API_TO_FETCH_TASK_DETAIL).then((result) => {
      console.log("API_TO_FETCH_TASK_DETAIL ----> ", result);
      if ( result.data.status ) {
        setTask((previous) => {
          return Object.assign({}, result.data.response);
        })
      }
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  const completedAddNewComment = (newCommentId) => {
    console.log(newCommentId);
    setNewCommentId(newCommentId);
  }
  return (
    <React.Fragment>
      <div className="col-xs-12 col-sm-12 col-md-10 ">
        <div className="content-box-large">
          <div className="row">
            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
              <p><label className="control-label ">タスクID</label></p>
              <p><input className="form-control" type="text" disabled="disabled" value={"P:" + task.project_id + ":T:" + task.id}/></p>
            </div>
            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
              <p><label className="control-label ">タスクコード</label></p>
              <p><input className="form-control" type="text" disabled="disabled" value={task.code_number}/></p>
            </div>
            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
              <p>作成日時</p>
              <p><input type="text" disabled="disabled" className="form-control" value={moment(task.created_at).format("yyyy年mm月DD日 HH時MM分")}/></p>
            </div>
            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
              <p>更新日時</p>
              <p><input type="text" disabled="disabled" className="form-control" value={moment(task.updated_at).format("yyyy年mm月DD日 HH時MM分")}/></p>
            </div>
          </div>

          <div className="row ">
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <p>タスク名</p>
              <p>{task.task_name}</p>
            </div>

            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3 ">
              <p>作業者IDおよび作業者名</p>
              <p>{task.User && task.User.user_name}</p>
            </div>

            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3 ">
              <p>タスクステータス</p>
              <p>{task.status}</p>
            </div>
          </div>

          <div className="row ">
            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3 ">
              <p>紐づくプロジェクト</p>
              <p>{task.Project && task.Project.project_name}</p>
            </div>

            <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3 ">
              <p>優先度の設定</p>
              <p>{task.priority}</p>
            </div>
          </div>

          <div className="row ">
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 ">
              <p>タスク詳細</p>
              <p>{task.task_description}</p>
            </div>
          </div>

          <div className="row">
            {task.TaskImages && task.TaskImages.map((value, index) => {
              return (
                <div className="col-sm-2 col-md-2 col-lg-2 col-xl-2" key={value.image_id}>
                  <p><img width="20%" alt={value.image_id} src={API_TO_SHOW_IMAGE + "/" + value.image_id} /></p>
                </div>
                )
            })}
          </div>
        </div>
      </div>
      <div className="col-xs-12 col-sm-12 col-md-10 ">
        <CreateComment taskId={id} callback={completedAddNewComment}/>
        <TaskComment taskId={id} newCommentid={newCommentId}/>
      </div>
    </React.Fragment>
  )
}

export default TaskDetail;
