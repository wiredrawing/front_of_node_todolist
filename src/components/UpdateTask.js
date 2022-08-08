import React, { useState } from 'react'
import Task from './Task'
import { useParams } from 'react-router-dom'
const UpdateTask = () => {

  // URLパラメータを取得する
  const {projectId, taskId} = useParams();

  return (
    <React.Fragment>
      <h2>タスクの編集フォーム</h2>
      <Task projectId={projectId} taskId={taskId}/>
    </React.Fragment>
  )
}

export default UpdateTask;
