import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from './Image'
import config from '../config/const'
// date picker
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import ja from "date-fns/locale/ja";
import moment from "moment";
import { useNavigate } from 'react-router-dom'

/**
 * projectIdがpropsでパスされている場合は編集処理とみなす
 * @param projectId
 * @returns {JSX.Element}
 * @constructor
 */
const Project = ({ projectId }) => {

  const apiEndPoint = config.development.host + "/api/project/create";
  const API_TO_UPDATE_PROJECT = config.development.host + "/api/project/update"
  const apiToShowImage = config.development.host + "/api/image/show";
  const API_TO_FETCH_PROJECT = config.development.host + "/api/project/detail"
  const API_TO_FETCH_UTILITY = config.development.host + "/api/utility";
  const [ projectImages, setProjectImages ] = useState([]);
  const [ startDate, setStartDate ] = useState(new Date());
  const [ endDate, setEndDate ] = useState(new Date());
  const [ project, setProject ] = React.useState({
    project_name: "",
    project_description: "",
    start_date: "",
    end_date: "",
    is_displayed: 0,
    is_deleted: 0,
    user_id: "1",
    code_number: "",
    image_id: projectImages,
  });
  const [ taskError, setTaskError ] = React.useState([]);
  const [ utility, setUtility ] = React.useState({});
  const completedUploadingImage = (imageId) => {
    setProjectImages((previous) => {
      let temp = previous.slice();
      temp.push(imageId);
      return temp;
    })
  }
  const updateProject = (e) => {
    console.log(e);
    let targetKey = e.target.name;
    setProject((previous) => {
      previous[targetKey] = e.target.value;
      return Object.assign({}, previous);
    });
  }

  // Request registering new project to api server.
  let navigate = useNavigate();
  const registerNewProject = () => {
    let newProject = Object.assign({}, project);
    // プロジェクト用画像を設定
    newProject.image_id = projectImages;
    console.log(newProject);
    axios.post(apiEndPoint, newProject).then((result) => {

      // apiリクエスト失敗時
      if ( result.data.status !== true ) {
        return setTaskError(result.data.response)
      }
      console.log(apiEndPoint);
      console.log(result);
      return navigate("/project/update/" + result.data.response.id);
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

  // プロジェクト開始予定日の更新
  const updateStartDate = (date) => {
    // projectデータを更新
    setProject((previous) => {
      let temp = Object.assign({}, previous);
      temp.start_date = moment(date).format("yyyy-MM-DD");
      return temp;
    })
    // startDateそのものを更新
    setStartDate(date);
  }
  // プロジェクト終了予定日の更新
  const updateEndDate = (date) => {
    setProject((previous) => {
      let temp = Object.assign({}, previous);
      temp.end_date = moment(date).format("yyyy-MM-DD");
      return temp;
    })
    // endDateそのものを更新
    setEndDate(date);
  }

  // 一度仮アップロードした画像を削除
  const deleteThisImage = (index) => {
    return (e) => {
      setProjectImages((previous) => {
        let temp = previous.slice();
        temp.splice(index, 1);
        return temp;
      })
    }
  }

  // 更新対象のプロジェクトデータを取得する
  const fetchProjectToUpdate = (projectId) => {
    axios.get(API_TO_FETCH_PROJECT + "/" + projectId).then((result) => {
      console.log(result);
      if ( result.data.status ) {
        let tempProject = result.data.response
        // project画像が登録されている場合
        let temp = [];
        if ( tempProject.ProjectImages ) {
          tempProject.ProjectImages.forEach((value) => {
            temp.push(value.image_id);
          })
          setProjectImages(temp)
          console.log("projectImages ------->", projectImages);
        }
        setProject((previous) => {
          return {
            project_name: tempProject.project_name,
            project_description: tempProject.project_description,
            start_date: moment(tempProject.start_date).format("yyyy-MM-DD"),
            end_date: moment(tempProject.end_date).format("yyyy-MM-DD"),
            is_displayed: tempProject.is_displayed,
            user_id: tempProject.user_id,
            code_number: tempProject.code_number,
            image_id: temp,
          }
        });
        // datePickerの値も更新
        setStartDate(new Date(tempProject.start_date));
        setEndDate(new Date(tempProject.end_date));
      }
    })
    return true;
  }
  // サーバー上のリソースをアップデート
  const updateProjectOnRemote = () => {
    let updateData = Object.assign({}, project);
    // project更新向けにペイロードを修正
    updateData.project_id = projectId;
    updateData.created_by = updateData.user_id;
    updateData.image_id = projectImages;
    axios.post(API_TO_UPDATE_PROJECT + "/" + projectId, updateData).then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    })
  }

  // 送信ボタンのonClickイベント
  const executeProject = (event) => {
    if ( projectId > 0 ) {
      // 既存リソースの作成処理
      updateProjectOnRemote();
      return true;
    }
    // 新規プロジェクト作成処理
    registerNewProject()
    return true;
  }
  // ユーティリティ情報を取得する
  useEffect(() => {
    console.log("-----------------> useEffect 1")
    axios.get(API_TO_FETCH_UTILITY).then((result) => {
      console.log(result);
      setUtility(result.data.response);
    }).catch((error) => {
      console.log(error);
    })
  }, []);

  useEffect(() => {
    console.log("-----------------> useEffect 2")
    // コンポーネントのプロパティに更新対象のprojectIdが指定されている場合のみ
    console.log(projectId);
    if ( projectId > 0 ) {
      fetchProjectToUpdate(projectId)
    }
  }, [])
  return (
    <React.Fragment>
      <section style={addNewProjectWrapper}>
        <div id="to-register-project-with-images">
          {projectImages.map((value, index) => {
            return (
              <div className="selected-image-unit" key={value} onDoubleClick={deleteThisImage(index)}>
                <img alt={value} width="10%" src={apiToShowImage + "/" + value}/>
              </div>
            )
          })}
        </div>
        <div className="add-new-project-unit" style={addNewProjectUnit}>
          <p>プロジェクト名</p>
          <input className="form-control" onInput={(e) => updateProject(e)} type="text" name="project_name" defaultValue={project.project_name}></input>
        </div>
        <div className="add-new-project-unit" style={addNewProjectUnit}>
          <p>プロジェクト概要</p>
          <textarea className="form-control" onInput={(e) => updateProject(e)} name="project_description" defaultValue={project.project_description}/>
        </div>
        <div className="add-new-project-unit" style={addNewProjectUnit}>
          <p>表示状態</p>
          <select className="form-select" name="is_displayed" onChange={(e) => updateProject(e)} value={project.is_displayed} defaultValue={project.is_displayed}>
            {utility["displayTypes"] && utility["displayTypes"].map((value, index) => {
              return (
                <React.Fragment key={index}>
                  <option value={value.id}>{value.value}</option>
                </React.Fragment>
              )
            })}
          </select>
        </div>
        <div className="add-new-project-unit" style={addNewProjectUnit}>
          <p>プロジェクト開始予定日</p>
          <DatePicker className="form-control" dateFormat="yyyy-MM-dd" locale="ja" selected={startDate} onChange={updateStartDate}/>
          <input onInput={(e) => updateProject(e)} type="text" name="start_date" defaultValue={project.start_date}></input>
        </div>
        <div className="add-new-project-unit" style={addNewProjectUnit}>
          <p>プロジェクト終了予定日</p>
          <DatePicker className="form-control" dateFormat="yyyy-MM-dd" locale="ja" selected={endDate} onChange={updateEndDate}/>
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
            <button className="common-button-style" onClick={executeProject}>上記内容で新規登録</button>
          </p>
        </div>
      </section>
      <Image callback={completedUploadingImage}></Image>
    </React.Fragment>
  );
}

export default Project;
