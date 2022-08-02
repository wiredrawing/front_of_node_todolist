import "../css/project-detail.css";
import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const ProjectDetail = ({ projectId }) => {

  const [ project, setProject ] = React.useState({});
  // const [projectId, setProjectId] = React.useState(0);
  const params = useParams();
  // alert(id);
  let apiEndPoint = "";
  if ( projectId > 0 ) {
    apiEndPoint = "http://localhost:3000/api/project/detail/" + projectId;
  } else {
    apiEndPoint = "http://localhost:3000/api/project/detail/" + params.id;
  }

  React.useEffect(() => {
    axios.get(apiEndPoint, {}).then((result) => {
      if ( result.data.status ) {
        console.log(result);
        setProject(Object.assign(result.data.response));
      }
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  return (
    <React.Fragment>
      <div id="project-detail-box">
        <div id="project-id" className="unit">
          <p>プロジェクトID</p>
          <p>{project.id}</p>
        </div>
        <div id="project-name" className="unit">
          <p>プロジェクト名</p>
          <p>{project.project_name}</p>
        </div>
        <div id="project-descritpion" className="unit">
          <p>プロジェクト概要</p>
          <p>{project.project_description}</p>
        </div>
        <div id="start-date" className="unit">
          <p>プロジェクト開始予定日</p>
          <p>{project.start_date}</p>
        </div>
        <div id="end-date" className="unit">
          <p>プロジェクト完了予定日</p>
          <p>{project.end_date}</p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ProjectDetail
