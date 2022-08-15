import React, { useEffect, useMemo } from 'react'
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'
import config from "../config/const";
import moment from 'moment'

const ProjectLit = function() {

  const apiEndPoint = config.development.host + "/api/project/search";
  const API_TO_FETCH_UTILITY = config.development.host + "/api/utility";
  const [ projectList, setProjectList ] = React.useState([]);
  const [ utility, setUtility ] = React.useState({});

  console.log("ProjectList ==>", useParams());

  // utility情報を取得する
  useEffect(() => {
    axios.get(API_TO_FETCH_UTILITY).then((result) => {
      if ( result.data.status ) {
        setUtility(result.data.response);
        return true;
      }
      setUtility({});
      return false;
    })
  }, []);

  useEffect(() => {
    // コンポーネント表示初回のみ
    axios.get(apiEndPoint).then((result) => {
      console.log(result)
      if ( result.data.status ) {
        // stateを更新
        setProjectList(result.data.response);
      }
    }).catch((error) => {
      console.log(error);
    })
  }, []);

  let naviate = useNavigate();
  const moveToTaskList = (index) => {
    return (function(_index) {
      return (e) => {
        naviate("/project/task/" + _index);
      }
    })(index)
  }
  // プロジェクト詳細ページへ
  const moveToProjectDetail = (projectId) => {
    return (e) => {
      console.log("moveToProjectDetail ----> ", e);
      return naviate("/project/" + projectId)
    }
  }
  // プロジェクト編集ページ
  const moveToProjectEdit = (projectId) => {
    return (e) => {
      console.log("moveToProjectEdit ----> ", e);
      return naviate("/project/update/" + projectId)
    }
  }
  // 指定したプロジェクトに追加のタスク情報を登録する
  const addNewTask = (projectId) => {
    return (e) => {
      console.log("addNewTask ----->", e);
      return naviate("/task/create/" + projectId);
    }
  }
  return (
    <React.Fragment>
      <table className="table table-bordered">
        <thead>
        <tr>
          <td>プロジェクトID</td>
          <td>
            プロジェクト名<br/>
            登録済みタスク数
          </td>
          {/*<td>プロジェクト概要</td>*/}
          <td>開始予定日<br/>終了予定日</td>
          <td>詳細</td>
          <td>編集</td>
          <td>タスクの追加</td>
          <td>タスク一覧へ</td>
        </tr>
        </thead>
        <tbody>
        {projectList.map((value, index) => {
          return (
            <React.Fragment key={index}>
              <tr>
                <td>
                  <p>{value.id}</p>
                </td>
                <td>
                  <p>{value.project_name}</p>
                  <p>({value.Tasks.length}件)</p>
                </td>
                {/*<td>*/}
                {/*  <p>{value.project_description}</p>*/}
                {/*</td>*/}
                <td>
                  <p>{moment(value.start_date).format("yyyy年MM月DD日")}</p>
                  <p>{moment(value.end_date).format("yyyy年MM月DD日")}</p>
                </td>
                <td>
                  <p onClick={moveToProjectDetail(value.id)} className="btn btn-outline-primary"><Link to={'/project/' + value.id}>詳細</Link></p>
                </td>
                <td>
                  <p onClick={moveToProjectEdit(value.id)} className="btn btn-outline-primary"><Link to={'/project/update/' + value.id}>編集</Link></p>
                </td>
                <td>
                  <p className="btn btn-outline-primary" onClick={addNewTask(value.id)}>タスク追加</p>
                </td>
                <td>
                  <button onClick={moveToTaskList(value.id)} className="btn btn-outline-info button-to-task-list-page">登録ずみタスク一覧へ</button>
                </td>
              </tr>
            </React.Fragment>
          );
        })}
        </tbody>
      </table>
    </React.Fragment>
  )
}

export default ProjectLit
