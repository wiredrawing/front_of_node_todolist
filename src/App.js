import React, { useEffect } from 'react'
import './App.css';
import "./css/Main.css";
import CreateProject from './components/CreateProject'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Task from './components/Task'
import TaskDetail from './components/TaskDetail'
import ProjectList from './components/ProjectList'
import ProjectDetail from './components/ProjectDetail'
import TaskList from './components/TaskList'
import UserList from './components/UserList'
import ProjectTaskList from './components/ProjectTaskList'
import UploadImage from './components/UploadImage'
import ImageList from './components/ImageList'
import axios from 'axios'
import TaskComment from './components/TaskComment'

function App() {


  // API(corsテスト) => GETの場合
  // useEffect(() => {
  //   axios.get("http://localhost:8000/admin/api/line/reserve/unsent/7").then((result) => {
  //     console.log(" http://localhost:8000/admin/api/line/reserve/unsent/7 --->", result);
  //   })
  // }, [])

  // API corsテスト (POSTの場合)
  // useEffect(() => {
  //   let postData = {
  //     "channel_name": "ReactアプリケーションでPOSTリクエスト",
  //     "channel_id": "wire-drawing.co.jp.1234567890",
  //     "channel_secret": "wire-drawing.co.jp.123456789abcdefghijklmnopqrstuxwz",
  //     "user_id": "wire-drawing.co.jp.U1234567891234567891234567891234",
  //     "messaging_channel_id": "wire-drawing.co.jp.1234567890",
  //     "messaging_channel_secret": "wire-drawing.co.jp.123456789abcdefghijklmnopqrstuxwz",
  //     "messaging_user_id": "wire-drawing.co.jp.123456789abcdefghijklmnopqrstuxwz",
  //     "messaging_channel_access_token": "wire-drawing.co.jp......"
  //   }
  //   axios.post("http://localhost:8000/admin/api/line/account/create", postData).then((result) => {
  //     console.log(result);
  //   })
  // })

  return (
    <React.Fragment>
      <section id="wrapper">
        <header>
          <div id="header-top-block">
            <p>ここはヘッダー</p>
          </div>
        </header>
        <main id="body">
          <div id="main-block">
            <BrowserRouter>
              <div className="App">
                <section id="global-menus">
                  <div className="global-menu">
                    <p><Link to="/project">プロジェクト一覧 http://localhost:3001/project </Link></p>
                  </div>
                  <div className="global-menu">
                    <p><Link to="/project/create">新規プロジェクト作成  http://localhost:3001/project/create </Link></p>
                  </div>
                  <div className="global-menu">
                    <p><Link to="/task">タスク一覧  http://localhost:3001/task/ </Link></p>
                  </div>
                </section>
                <Routes>
                  <Route path="/project/">
                    <Route path="" element={<ProjectList/>}></Route>
                    <Route path=":id" element={<ProjectDetail/>}></Route>
                    <Route path="task/:id" element={<ProjectTaskList projectId="0"/>}></Route>
                    <Route path="create" element={<CreateProject/>}></Route>
                  </Route>
                  <Route path="/task/">
                    <Route path="create/:projectId" element={<Task/>}></Route>
                    <Route path=":id" element={<TaskDetail/>}></Route>
                    <Route path=":projctId" element={<TaskList/>}></Route>
                    <Route path="" element={<TaskList/>}></Route>
                  </Route>

                  <Route path="/userList/">
                    <Route path="" element={<UserList/>}></Route>
                  </Route>

                  <Route path="/image">
                    <Route path="upload" element={<UploadImage/>}></Route>
                    <Route path="list" element={<ImageList/>}></Route>
                  </Route>
                  <Route path="/" >
                    TOP
                  </Route>
                </Routes>
              </div>
            </BrowserRouter>
          </div>
        </main>
        <footer>
          <div id="footer-top-block">
            <p>ここはフッター</p>
          </div>
        </footer>
      </section>
    </React.Fragment>
  );
}

export default App;
