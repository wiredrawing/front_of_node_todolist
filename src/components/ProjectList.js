import React, { useEffect } from 'react'
import axios from 'axios'
import { Link, Outlet, useParams, useNavigate} from 'react-router-dom'

export default function() {

  const apiEndPoint = "http://localhost:3000/api/project/search";
  const [ projectList, setProjectList ] = React.useState([]);
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


  let naviate = useNavigate();
  const moveToTaskList = (index) => {
    return (function (_index) {
      return (e) => {
        naviate("/task/" + _index);
      }
    })(index)
  }
  const projectWrapperBox = {
    display: "flex",
    flexWrap: "wrap",
  }
  const projectUnitBox = {
    width: "10%",
    backgroundColor: "#DFDFDF",
    border: "1px solid #AAA",
    marginLeft: "2%",
    marginRight: "2%",
    marginBottom: "1%",
  }

  return (
    <React.Fragment>
      <div id="project-wrapper-box">
        {projectList.map((value, index) => {
          return (
            <React.Fragment key={index}>

              <div className="project-unit-box" style={projectWrapperBox}>
                <div className="project-id" style={projectUnitBox}>
                  <p>{value.id}</p>
                </div>
                <div className="project-name" style={projectUnitBox}>
                  <p>{value.project_name}</p>
                </div>
                <div className="project-description" style={projectUnitBox}>
                  <p>{value.project_description}</p>
                </div>
                <div className="project-start-date" style={projectUnitBox}>
                  <p>{value.start_date}</p>
                </div>
                <div className="project-end-date" style={projectUnitBox}>
                  <p>{value.end_date}</p>
                </div>
                <div style={projectUnitBox}>
                  <p><Link to={'/project/' + value.id}>プロジェクト詳細へ</Link></p>
                  <p><Link to={'/task/create/' + value.id}>このプロジェクトにタスクを追加</Link></p>
                </div>
                <div className="get-task-list" style={projectUnitBox}>
                  <button onClick={moveToTaskList(value.id)} className="button-to-task-list-page">登録ずみタスク一覧へ</button>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <Outlet/>
    </React.Fragment>
  )
}
