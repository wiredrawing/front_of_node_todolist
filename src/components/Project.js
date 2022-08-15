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
import arrayUnique from '../config/array-unique'

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
  const API_TO_FETCH_USERS = config.development.host + "/api/user";
  const [ participants, setParticipants ] = useState([]);
  const [ users, setUsers ] = useState([]);
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
    // プロジェクト参加者
    users: participants,
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
  const updateProject = (index) => {
    return (e) => {
      console.log(e);
      console.log("FormNumber index ----->", index);
      let targetKey = e.target.name;
      setProject((previous) => {
        previous[targetKey] = e.target.value;
        return Object.assign({}, previous);
      });
    }
  }

  // Request registering new project to api server.
  let navigate = useNavigate();
  const registerNewProject = () => {
    let newProject = Object.assign({}, project);
    // プロジェクト用画像を設定
    newProject.image_id = projectImages;
    // プロジェクト参画メンバーを指定
    newProject.users = participants;
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
      console.log("API_TO_FETCH_PROJECT ---->", result);
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
        // プロジェクト参画メンバーを取得
        let users = [];
        if ( tempProject.ProjectUsers ) {
          tempProject.ProjectUsers.forEach((projectUser, index) => {
            users.push(projectUser.user_id);
          })
        }
        setParticipants((previous) => {
          console.log("previous ------>", previous);
          return users;
        })
        setProject((previous) => {
          console.log(previous);
          return {
            project_name: tempProject.project_name,
            project_description: tempProject.project_description,
            start_date: moment(tempProject.start_date).format("yyyy-MM-DD"),
            end_date: moment(tempProject.end_date).format("yyyy-MM-DD"),
            is_displayed: tempProject.is_displayed,
            is_deleted: tempProject.is_deleted,
            user_id: tempProject.user_id,
            code_number: tempProject.code_number,
            image_id: temp,
            users: users,
          }
        });
        // datePickerの値も更新
        setStartDate(new Date(tempProject.start_date));
        setEndDate(new Date(tempProject.end_date));
        // プロジェクトへの参加者
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
    updateData.users = participants;
    axios.post(API_TO_UPDATE_PROJECT + "/" + projectId, updateData).then((result) => {
      if ( result.data.status ) {
        alert("プロジェクトの更新が完了しました");
        console.log("プロジェクトデータアップデート完了後 ----> ", result);
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  const updateParticipants = (e) => {
    const selectedUserId = e.target.value;
    setParticipants((prevState) => {
      let temp = prevState.slice();
      temp.push(selectedUserId);
      temp = arrayUnique(temp);
      temp.sort();
      return temp;
    })
  }
  const deleteThisUserId = (index) => {
    return (e) => {
      setParticipants((prevState) => {
        let temp = prevState.slice();
        temp.splice(index, 1);
        return temp;
      })
    }
  }
  const fetchUserNameFromId = (userId) => {
    let target = users.filter((user, index, a) => {
      console.log(user);
      return user.id === userId;
    })
    console.log("target -----> ", target);
    return target[0]["user_name"];
  }

  /**
   * 送信ボタンのonClickイベント
   * @param event
   * @returns {boolean}
   */
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

  // 全ユーザー情報を取得する
  useEffect(() => {
    axios.get(API_TO_FETCH_USERS).then((result) => {
      if ( result.data.status ) {
        console.log("API_TO_FETCH_USERS ---->", result.data.response);
        setUsers(result.data.response);
      }
    })
  }, []);

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
      <div className="content-box-large ">
        <div className="panel-title ">プロジェクトの作成</div>
        <div className="row">
          <div className="row">
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <p>プロジェクト名</p>
              <input className="form-control" onInput={updateProject("project_name")} type="text" name="project_name" defaultValue={project.project_name}></input>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <p>開始日時</p>
              <DatePicker className="form-control" dateFormat="yyyy-MM-dd" locale="ja" selected={startDate} onChange={updateStartDate}/>
            </div>

            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <p>終了日時</p>
              <DatePicker className="form-control" dateFormat="yyyy-MM-dd" locale="ja" selected={endDate} onChange={updateEndDate}/>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <p>責任者ID</p>
              <select className="form-control form-select" name="user_id" id="user_id" onChange={updateProject("user_id")} value={project.user_id}>
                {users && users.map((value, index) => {
                  return (<option key={value.id} value={value.id}>{value.user_name}</option>);
                })}
              </select>
            </div>

            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <p>表示状態の指定</p>
              <select className="form-select" name="is_displayed" onChange={updateProject("is_displayed")} value={project.is_displayed}>
                {utility["displayTypes"] && utility["displayTypes"].map((value, index) => {
                  return (
                    <React.Fragment key={index}>
                      <option value={value.id}>{value.value}</option>
                    </React.Fragment>
                  )
                })}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <p>プロジェクト参画ユーザーID(※ここで追加したユーザーのみプロジェクト情報を閲覧できます)</p>
              <select defaultValue="0" name="users" className="form-control form-select" id="select-project-users" onChange={(e) => updateParticipants(e)}>
                {users && users.map((value, index) => {
                  return (<option key={value.id} value={value.id}>{value.user_name}</option>);
                })}
              </select>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <div className="row" id="project-users">
                {participants && participants.map((value, index) => {
                  return (
                    <div key={value} className="col-3 mx-3 my-3 btn btn-outline-primary selected-project-users" onClick={deleteThisUserId(index)}>
                      {fetchUserNameFromId(value)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div id="to-register-project-with-images" className="row">
            {projectImages.map((value, index) => {
              return (
                <div className="col-sm-3 col-md-3 col-lg-3 col-xl-3">
                  <div className="selected-image-unit" key={value} onDoubleClick={deleteThisImage(index)}>
                    <img className="ajust" alt={value} width="100%" src={apiToShowImage + "/" + value}/>
                  </div>
                </div>
              )
            })}
          </div>
          {/*ファイルアップロード用コンポーネント*/}
          <Image callback={completedUploadingImage}></Image>
          <div className="row ">
            <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <p>プロジェクト詳細</p>
              <textarea className="form-control" onInput={updateProject("project_description")} name="project_description" defaultValue={project.project_description} rows="10"/>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 ">
              <p>上記内容でタスクを作成する</p>
              <button className="common-button-style" onClick={executeProject}>上記内容で新規登録</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Project;
