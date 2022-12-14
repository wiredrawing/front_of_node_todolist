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
// import axios from 'axios'
// import TaskComment from './components/TaskComment'
import CreateTask from './components/CreateTask'
import UpdateProject from './components/UpdateProject'
import UpdateTask from './components/UpdateTask'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import SideBar from './components/common/SideBar'

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
      <BrowserRouter>
        <Header/>
        <div className="page-content">
          <div className="row">
            <SideBar/>
            <div className="col-md-10" id="app">
              <div className="content-box-large">
                <div id="main-block">
                  <div className="App">
                    <Routes>
                      <Route path="/project/">
                        <Route path="" element={<ProjectList/>}></Route>
                        <Route path=":id" element={<ProjectDetail/>}></Route>
                        <Route path="task/:id" element={<ProjectTaskList/>}></Route>
                        <Route path="create" element={<CreateProject/>}></Route>
                        <Route path="update/:id" element={<UpdateProject/>}></Route>
                      </Route>

                      <Route path="/task/">
                        <Route path="create/:projectId" element={<CreateTask/>}></Route>
                        <Route path="update/:projectId/:taskId" element={<UpdateTask/>}></Route>
                        <Route path=":id" element={<TaskDetail/>}></Route>
                        <Route path=":projctId" element={<TaskList/>}></Route>
                        <Route path="" element={<TaskList/>}></Route>
                      </Route>

                      {/*<Route path="/create/task/:projectId">*/}
                      {/*  <Route path="" element={<CreateTask/>}></Route>*/}
                      {/*</Route>*/}

                      <Route path="/user/list/">
                        <Route path="" element={<UserList/>}></Route>
                      </Route>

                      <Route path="/image">
                        <Route path="upload" element={<UploadImage/>}></Route>
                        <Route path="list" element={<ImageList/>}></Route>
                      </Route>
                      <Route path="/">
                        TOP
                      </Route>
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
      <Footer></Footer>
    </React.Fragment>
  );
}

export default App;
