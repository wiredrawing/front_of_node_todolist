import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Image from './Image'
import config from '../config/const'
// date picker
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";
import moment from "moment";

registerLocale("ja", ja)

const Task = ({
                projectId,
                taskId
              }) => {
  // タスクに追加する画像リスト
  const completedUploadingImage = (imageId) => {
    setTaskImages((previous) => {
      let temp = previous.slice();
      temp.push(imageId);
      return temp;
    })
  }
  const sectionStyle = {
    display: "flex",
    flexWrap: "wrap",
    backgroundColor: "#DEDEDE",
    margin: "1%",
    padding: "1%",
  }
  const taskInputStyle = {
    width: "20%",
    // marginLeft: "5%",
    // marginRight: "5%",
    marginTop: "2%",
    margin: "auto",
  }
  // 作業中のプロジェクト情報を取得する
  const API_TO_FETCH_PROJECT_INFO = config.development.host + "/api/project/detail/" + projectId
  const API_TO_ADD_NEW_TASK = config.development.host + "/api/task/create"
  const API_TO_UPDATE_TASK = config.development.host + "/api/task/update";
  const API_TO_SHOW_IMAGE = config.development.host + "/api/image/show";
  const API_TO_FETCH_UTILITY = config.development.host + "/api/utility";
  const API_TO_FETCH_TASK = config.development.host + "/api/task";
  const API_TO_FETCH_USER = config.development.host + "/api/user";
  const [users, setUsers] = useState([]);
  const [ project, setProject ] = useState({});
  const [ taskImages, setTaskImages ] = useState([]);
  const [ utility, setUtility ] = useState({})
  const [ startDate, setStartDate ] = useState(new Date());
  const [ endDate, setEndDate ] = useState(new Date());
  const [ task, setTask ] = useState({
    unique_key: "",
    task_name: "",
    task_description: "",
    // stateの初期値を利用
    start_date: moment(startDate).format("yyyy-MM-DD"),
    // stateの初期値を利用
    end_date: moment(endDate).format("yyyy-MM-DD"),
    priority: "",
    status: "",
    // code_number: "",
    user_id: 1,
    image_id: taskImages,
    project_id: projectId,
  });

  /**
   * 新規タスク情報のリソース作成あるいは既存リソースの更新
   */
  const navigate = useNavigate();
  const executeTaskInfo = (e) => {
    // taskIdが指定されている場合
    if ( taskId > 0 ) {
      let postData = {
        task_id: taskId,
        task_name: task.task_name,
        task_description: task.task_description,
        // stateの初期値を利用
        start_date: moment(startDate).format("yyyy-MM-DD"),
        // stateの初期値を利用
        end_date: moment(endDate).format("yyyy-MM-DD"),
        priority: task.priority,
        status: task.status,
        // タスク作業者(当該タスクを担う人)
        user_id: task.user_id,
        image_id: taskImages,
        project_id: projectId,
        is_displayed: task.is_displayed,
      }
      axios.post(API_TO_UPDATE_TASK + "/" + projectId, postData).then((result) => {
        console.log("postData ----> ", postData);
        console.log("API_TO_UPDATE_TASK/projectId ----> ", result);
        alert("編集が完了しました");
        return navigate("/task/update/" + projectId + "/" + postData.task_id);
      }).catch((error) => {
        console.log("ERROR: API_TO_UPDATE_TASK/projectId ----> ", error);
      })
    } else {
      setTask((previous) => {
        let temp = Object.assign({}, previous);
        temp.project_id = projectId
        return temp;
      })
      let postData = Object.assign({}, task);
      // タスク用画像を追加
      postData.image_id = taskImages;
      axios.post(API_TO_ADD_NEW_TASK, postData).then((result) => {
        console.log(result);
        if ( result.data.status ) {
          // 新規タスクの登録に完了したら当該プロジェクトのタスク一覧へ遷移させる
          return navigate("/project/task/" + projectId);
        }
        return false;
      }).catch((error) => {
        console.log("error ---->", error);
      })
    }
  }

  // 入力イベントの度に親コンポーネントにデータを共有する
  const onInput = (nameKey) => {
    return (event) => {
      setTask((previous) => {
        let temp = Object.assign({}, previous);
        temp[event.target.name] = event.target.value;
        return temp;
      })
      return true;
    }
  }
  // 設定データを取得
  const fetchUtilityList = async () => {
    let temp = await axios.get(API_TO_FETCH_UTILITY);
    if ( temp !== null ) {
      setUtility(temp.data.response);
      console.log("utility---->", temp)
      console.log(utility);
      return utility;
    }
    return null;
  };
  // タスク編集モード時にタスク情報を取得する
  const fetchTaskInfoToUpdate = (taskId) => {
    axios.get(API_TO_FETCH_TASK + "/" + taskId).then((result) => {
      if ( result.data.status ) {
        if ( result.data.response.TaskImages ) {
          setTaskImages((prevState) => {
            let temp = [];
            result.data.response.TaskImages.forEach((value) => {
              temp.push(value.image_id);
            })

            return temp;
          })
        }
        setTask((prevState) => {
          return result.data.response;
        })
        // タスク開始日を指定
        setStartDate(new Date(result.data.response.start_date))
        // タスク終了日を指定
        setEndDate(new Date(result.data.response.end_date))
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  /**
   * 指定したprojectIdに紐づくプロジェクト情報を取得する
   *
   * @param projectId
   * @returns {Promise<boolean>}
   */
  const fetchProjectInfo = async (projectId) => {
    // コンポーネント初回表示時に作業中のプロジェクト情報を取得する
    let result = await axios.get(API_TO_FETCH_PROJECT_INFO, {});
    if ( result === null ) {
      return null;
    }
    if ( result.data.status ) {
      setProject((prevState) => {
        return Object.assign({}, prevState);
      })
      return result.data.response;
    }
  }

  // useEffectは複数回実行可能
  useEffect(() => {
    axios.get(API_TO_FETCH_USER).then((result) => {
      if (result.data.status) {
        setUsers(result.data.response);
      }
    })
  }, [])

  React.useEffect(() => {
    fetchUtilityList().then((result) => {
      console.log(result);
    });
    if ( taskId > 0 ) {
      fetchTaskInfoToUpdate(taskId);
    }
    if ( projectId > 0 ) {
      fetchProjectInfo(projectId).then((result) => {
        console.log("fetchProjectInfo ---> ", result);
      })
    }
  }, []);

  // タスク開始予定日情報の更新
  const updateStartDate = (date) => {
    console.log("date -----> ", date);
    setTask((previous) => {
      let temp = Object.assign({}, previous);
      temp.start_date = moment(date).format("yyyy-MM-DD")
      console.log("temp --->", temp);
      return temp;
    })
    setStartDate(date)
  }
  // タスク終了予定日情報の更新
  const updateEndDate = (date) => {
    console.log("date -----> ", date);
    setTask((previous) => {
      let temp = Object.assign({}, previous);
      temp.end_date = moment(date).format("yyyy-MM-DD")
      console.log("temp --->", temp);
      return temp;
    })
    setEndDate(date);
  }

  // ダブルクリックした画像を削除する
  const deleteThisImage = (index) => {
    return (e) => {
      setTaskImages((prevState) => {
        let temp = prevState.slice();
        temp.splice(index, 1);
        return temp;
      })
    }
  }
  return (
    <React.Fragment>
      <div className="col-xs-12 col-sm-12 col-md-10 ">
        <div className="content-box-large ">
          <div className="panel-title ">登録中タスク内容</div>
          <div className="row " id="app ">
            <div className="col-xl-12 ">
              {project.id &&
              <div className="row ">
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                  <p>紐づくプロジェクトID</p>
                  <input className="form-control" type="text" readOnly="readOnly" name="project_id" onInput={onInput("project_id")} defaultValue={project.id}></input>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                  <p>紐づくプロジェクト名</p>
                  <input className="form-control" type="text" readOnly="readOnly" name="project_name" onInput={onInput("project_id")} defaultValue={project.project_name}></input>
                </div>
              </div>
              }
              <div className="row ">
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                  <p>タスク名</p>
                  <input className="form-control" type="text" name="task_name" onInput={onInput("task_name")} defaultValue={task.task_name}></input>
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

              <div className="row ">
                <div id="task-images">
                  {taskImages.map((value, index) => {
                    return (
                      <img onDoubleClick={deleteThisImage(index)} key={value} alt={value} width="15%" src={API_TO_SHOW_IMAGE + "/" + value}/>
                    )
                  })}
                </div>
              </div>
              <Image callback={completedUploadingImage}/>

              <div className="row ">
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                  <p>作業者ID</p>
                  <p>
                    <select className="form-control form-select" name="user_id" id="user_id" onChange={onInput("user_id")} value={task.user_id}>
                      {users && users.map((value, index) => {
                        return(<option key={value.id} value={value.id}>{value.user_name}</option>);
                      })}
                    </select>
                  </p>


                </div>

                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                  <p>タスクステータス</p>
                  <select className="form-select" name="status" onChange={onInput("status")} value={task.status}>
                    {utility.status && utility.status.map((value, index) => {
                      return (
                        <React.Fragment key={value.id}>
                          <option value={value.id}>{value.value}</option>
                        </React.Fragment>
                      )
                    })}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                  <p>優先度の設定</p>
                  <select className="form-select" name="priority" onChange={onInput("priority")} value={task.priority}>
                    {utility.priority && utility.priority.map((value, index) => {
                      return (
                        <React.Fragment key={value.id}>
                          <option value={value.id}>{value.value}</option>
                        </React.Fragment>
                      )
                    })}
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                  <p>タスク詳細</p>
                  <textarea className="form-control" name="task_description" onChange={onInput("task_description")} value={task.task_description} rows="15"></textarea>
                </div>
              </div>

              <div className="row ">
                <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 ">
                  <p>上記内容でタスクを作成する</p>
                  <button id="add-task-button" className="common-button-style" onClick={executeTaskInfo}>タスク登録</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Task;
