import React, { useState } from 'react'
import axios from 'axios'
import Image from './Image'
import config from '../config/const'

const CreateProject = () => {

  const apiEndPoint = "http://localhost:3000/api/project/create";
  const apiToShowImage = config.development.host + "/api/image/show";
  const [ projectImages, setProjectImages ] = useState([]);

  const completedUploadingImage = (imageId) => {
    setProjectImages((previous) => {
      let temp = previous.slice();
      temp.push(imageId);
      return temp;
    })
  }
  const [ project, setProject ] = React.useState({
    project_name: "",
    project_description: "",
    start_date: "",
    end_date: "",
    is_displayed: "1",
    user_id: "1",
    code_number: "",
    image_id: projectImages,
  });
  const [ taskError, setTaskError ] = React.useState([]);
  console.log(project);
  const updateProject = (e) => {
    console.log(e);
    let targetKey = e.target.name;
    setProject((previous) => {
      previous[targetKey] = e.target.value;
      return Object.assign({}, previous);
    });
  }

  // Request registering new project to api server.
  const registerNewProject = () => {
    let newProject = Object.assign(project);
    // プロジェクト用画像を設定
    newProject.image_id = projectImages;
    console.log(newProject);
    axios.post(apiEndPoint, newProject).then((result) => {

      // apiリクエスト失敗時
      if ( result.data.status !== true ) {
        setTaskError(result.data.response)
      }
      console.log(apiEndPoint);
      console.log(result);
    }).catch((error) => {
      console.log(error);
    })
  }
  const addNewProjectWrapper = {
    display: "flex",
    flexWrap: "wrap",
  }
  const addNewProjectUnit = {
    width: "15%",
    backgroundColor: "#DADADA",
    margin: "3%",
  }

  return (
    <React.Fragment>
      <section style={addNewProjectWrapper}>
        <div id="to-register-project-with-images">
          {projectImages.map((value, index) => {
            return (
              <div className="selected-image-unit" key={index}>
                <img alt={value} width="10%" src={apiToShowImage + "/" + value}/>
              </div>
            )
          })}
        </div>
        <div className="add-new-project-unit" style={addNewProjectUnit}>
          <p>プロジェクト名</p>
          <input onInput={(e) => updateProject(e)} type="text" name="project_name" defaultValue={project.project_name}></input>
        </div>
        <div className="add-new-project-unit" style={addNewProjectUnit}>
          <p>プロジェクト概要</p>
          <textarea onInput={(e) => updateProject(e)} name="project_description" defaultValue={project.project_description}/>
        </div>
        <div className="add-new-project-unit" style={addNewProjectUnit}>
          <p>プロジェクト開始予定日</p>
          <input onInput={(e) => updateProject(e)} type="text" name="start_date" defaultValue={project.start_date}></input>
        </div>
        <div className="add-new-project-unit" style={addNewProjectUnit}>
          <p>プロジェクト終了予定日</p>
          <input onInput={(e) => updateProject(e)} type="text" name="end_date" defaultValue={project.end_date}></input>
        </div>
      </section>
      <section id="error">
        {taskError.map((value, index) => {
          return (<div>
            <p>{value.msg}</p>
          </div>)
        })
        }
      </section>
      <section>
        <div>
          <p>プロジェクト名</p>
          <p>{project.project_name}</p>
        </div>
        <div>
          <p>プロジェクト概要</p>
          <p>{project.project_description}</p>
        </div>
        <div>
          <p>プロジェクト開始予定日</p>
          <p>{project.start_date}</p>
        </div>
        <div>
          <p>プロジェクト終了予定日</p>
          <p>{project.end_date}</p>
        </div>
        <div>
          <p>プロジェクト登録ボタン</p>
          <p>
            <button onClick={registerNewProject}>上記内容で新規登録</button>
          </p>
        </div>
      </section>
      <Image callback={completedUploadingImage}></Image>
    </React.Fragment>
  );
}

export default CreateProject;
