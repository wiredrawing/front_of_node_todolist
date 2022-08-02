import './App.css';
import CreateProject from './components/CreateProject'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Task from './components/Task'
import TaskDetail from './components/TaskDetail'
import ProjectList from './components/ProjectList'
import ProjectDetail from './components/ProjectDetail'
import TaskList from './components/TaskList'
import { Link } from 'react-router-dom'
import UserList from './components/UserList'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <section id="global-menus">
          <div className="global-menu">
            <p><Link to="/project">プロジェクト一覧</Link></p>
          </div>
          <div className="global-menu">
            <p><Link to="/project/create">新規プロジェクト作成</Link></p>
          </div>
          <div className="global-menu">
            <p><Link to="/project">タスク一覧</Link></p>
          </div>
        </section>
        <Routes>
          <Route path="/project/">
            <Route path="" element={<ProjectList/>}></Route>
            <Route path=":id" element={<ProjectDetail/>}></Route>
            <Route path="create" element={<CreateProject/>}></Route>
          </Route>
          <Route path="/task/">
            <Route path="create/:projectId" element={<Task/>}></Route>
            <Route path=":id" element={<TaskDetail/>}></Route>
            <Route path=":projctId" element={<TaskList/>}></Route>
          </Route>

          <Route path="/userList/">
            <Route path="" element={<UserList/>}></Route>
          </Route>
          <Route path="/" >
            TOP
          </Route>
        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
