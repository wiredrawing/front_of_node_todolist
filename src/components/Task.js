import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import ProjectDetail from './ProjectDetail'
import Image from './Image'
import config from '../config/const'
// date picker
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ja from "date-fns/locale/ja";
import moment from "moment";

registerLocale("ja", ja)
const Task = () => {
  const params = useParams();
  let projectId = 0;
  if ( params.projectId ) {
    projectId = params.projectId;
  }

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
  const API_TO_ADD_NEW_TASK = config.development.host + "/api/task/create/"
  const API_TO_SHOW_IMAGE = config.development.host + "/api/image/show";
  const API_TO_FETCH_UTILITY = config.development.host + "/api/utility";
  const [ taskImages, setTaskImages ] = useState([]);
  const [ utility, setUtility ] = useState({})
  const [ startDate, setStartDate ] = useState(new Date());
  const [ endDate, setEndDate ] = useState(new Date());
  const [ task, setTask ] = useState({
    unique_key: "",
    task_name: "",
    task_description: "",
    start_date: "",
    end_date: "",
    priority: "",
    status: "",
    // code_number: "",
    user_id: 1,
    image_id: taskImages,
    project_id: projectId,
  });

  // 新規タスク情報登録ボタン押下時
  let navigate = useNavigate();
  const addTaskInfo = (e) => {
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
        navigate("/project/task/" + projectId);
        return true;
      }
      return false;
    }).catch((error) => {
      console.log("error ---->", error);
    })
  }
  // 入力イベントの度に親コンポーネントにデータを共有する
  const onInput = (event) => {
    setTask((previous) => {
      let temp = Object.assign({}, previous);
      temp[event.target.name] = event.target.value;
      return temp;
    })
    return true;
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
  React.useEffect(() => {
    fetchUtilityList();
    (async () => {
      // コンポーネント初回表示時に作業中のプロジェクト情報を取得する
      let project = await axios.get(API_TO_FETCH_PROJECT_INFO, {}).then((result) => {
        console.log(result);
        if ( result.data.status ) {
          console.log("API通信成功");
          let temp = Object.assign({ }, result.data.response)
          console.log(result.data.response);
          // setProject(result.data.response);
          console.log("project --->", project);
        }
      }).catch((error) => {
        console.log("error ---> ", error);
      })
      console.log(project);
    })();

    // 親コンポーネントにTaskコンポーネントのstateの構造を共有する

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
  }
  return (
    <React.Fragment>
      <ProjectDetail projectId={projectId}></ProjectDetail>
      <section style={sectionStyle}>
        <div style={taskInputStyle}>
          <p>タスク名</p>
          <input className="form-control" type="text" name="task_name" onInput={onInput} defaultValue={task.task_name}></input>
        </div>
        <div style={taskInputStyle}>
          <p>タスク概要</p>
          <input className="form-control" type="text" name="task_description" onChange={onInput} defaultValue={task.task_description}></input>
        </div>
        <div style={taskInputStyle}>
          <p>優先順位</p>
          <select className="form-select" name="priority" onChange={onInput}>
            {utility.priority && utility.priority.map((value, index) => {
              return (
                <React.Fragment key={value.id}>
                  <option value={value.id}>{value.value}</option>
                </React.Fragment>
              )
            })}
          </select>
        </div>
        <div style={taskInputStyle}>
          <p>ステータス</p>
          <select className="form-select" name="status" onChange={onInput}>
            {utility.status && utility.status.map((value, index) => {
              return (
                <React.Fragment key={value.id}>
                  <option value={value.id}>{value.value}</option>
                </React.Fragment>
              )
            })}
          </select>
        </div>
        <div style={taskInputStyle}>
          <p>タスク開始予定日</p>
          <DatePicker className="form-control" dateFormat="yyyy-MM-dd" locale="ja" selected={startDate} onChange={updateStartDate}/>
        </div>
        <div style={taskInputStyle}>
          <p>タスク終了予定日</p>
          <DatePicker className="form-control" dateFormat="yyyy-MM-dd" locale="ja" selected={endDate} onChange={updateEndDate}/>
        </div>
      </section>
      <section>
        <div style={taskInputStyle}>
          <button id="add-task-button" className="common-button-style" onClick={addTaskInfo}>
            上記内容でタスクを登録する
          </button>
        </div>
      </section>
      <div id="task-images">
        {taskImages.map((value, index) => {
          return (
            <img alt={value} width="15%" src={API_TO_SHOW_IMAGE + "/" + value}/>
          )
        })}
      </div>
      <Image callback={completedUploadingImage}/>
    </React.Fragment>
  )
}

export default Task;
