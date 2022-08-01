import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'



export default () => {
  const params = useParams();
  const apiEndPoint = "http://localhost:3000/api/project/detail/" + params.id;

  const [project, setProject] = React.useState({});

  React.useEffect(() => {
    axios.get(apiEndPoint, {}).then((result) => {
      if (result.data.status) {
        console.log(result);
        setProject(Object.assign(result.data.response));
      }

    }).catch((error ) => {
      console.log(error);
    })
  }, [])

  return (
    <React.Fragment>
      <div id="project-detail-box">
        {params.id}
        <p>{project.project_name}</p>
        <p>{project.project_description}</p>
        <p>{project.start_date}</p>
        <p>{project.end_date}</p>
      </div>
    </React.Fragment>
  )
}
