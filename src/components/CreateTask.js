import React from 'react'
import ProjectDetail from './ProjectDetail'
import Task from './Task'
import { useParams } from 'react-router-dom'



const CreateTask = () => {

  const {projectId} = useParams();
  console.log("projectId ====> ", projectId);
  return (
    <React.Fragment>
      <h2>タスク登録フォーム</h2>
      <ProjectDetail projectId={projectId}/>
      <Task projectId={projectId}/>
    </React.Fragment>
  )

}

export default CreateTask
