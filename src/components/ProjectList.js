import React, { useEffect } from 'react'
import axios from 'axios'
import { Link, Outlet, useParams } from 'react-router-dom'

export default function() {

  const apiEndPoint = "http://localhost:3000/api/project/search";
  const [ projectList, setProjectList ] = React.useState([]);
  const [ id, setId ] = React.useState(0);
  console.log("ProjectList ==>", useParams());

  React.useEffect(() => {
    // コンポーネント表示初回のみ
    axios.get(apiEndPoint).then((result) => {
      console.log(result)
      if ( result.data.status ) {
        // stateを更新
        setProjectList(result.data.response);
      }
    }).catch((error) => {

    })

  }, []);

  const projectWrapperBox = {
    display: "flex",
    flexWrap: "wrap",
  }
  const projectUnitBox = {
    width: "25%",
  }

  return (
    <React.Fragment>
      <div id="project-wrapper-box" style={projectWrapperBox}>
        {projectList.map((value, index) => {
          return (
            <React.Fragment key={index}>

              <div className="project-unit-box" style={projectUnitBox}>
                <div className="project-name">
                  <p>{value.project_name}</p>
                </div>
                <div className="project-description">
                  <p>{value.project_description}</p>
                </div>
                <div className="project-start-date">
                  <p>{value.start_date}</p>
                </div>
                <div className="project-end-date">
                  <p>{value.end_date}</p>
                </div>
                <Link to={'/project/' + value.id}>プロジェクト詳細へ</Link>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <Outlet/>
    </React.Fragment>
  )
}
