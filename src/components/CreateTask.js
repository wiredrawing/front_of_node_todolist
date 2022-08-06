import React from 'react'
import ProjectDetail from './ProjectDetail'
import Task from './Task'
import { useParams } from 'react-router-dom'



const CreateTask = () => {

  const {projectId} = useParams();
  console.log("projectId ====> ", projectId);
  return (
    <React.Fragment>
      <ProjectDetail projectId={projectId}/>
      <Task/>
    </React.Fragment>
  )

}

export default CreateTask
