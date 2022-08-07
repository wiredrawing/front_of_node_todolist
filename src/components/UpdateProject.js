import React from 'react'
import Project from './Project'
import { useParams } from 'react-router-dom'

const UpdateProject = () => {
  // アップデート画面の場合はURLに対象のprojectIdを持つ
  const {id} = useParams();

  return (
    <React.Fragment>
      <Project projectId={id} />
    </React.Fragment>
  )
}

export default UpdateProject
