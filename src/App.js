import './App.css';
import Project from './components/Project'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Task from './components/Task'
import TaskDetail from './components/TaskDetail'
import ProjectList from './components/ProjectList'
import ProjectDetail from './components/ProjectDetail'
import TaskList from './components/TaskList'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/">
            TOP
          </Route>

          <Route path="/project/">
            <Route path="" element={<ProjectList/>}></Route>
            <Route path=":id" element={<ProjectDetail/>}></Route>
            <Route path="create" element={<Project/>}></Route>
          </Route>

          <Route path="/task">
            <Route path="" element={<TaskList/>}></Route>
            <Route path="create" element={<Task/>}></Route>
            <Route path=":id" element={<TaskDetail/>}></Route>
          </Route>

        </Routes>
      </div>
    </BrowserRouter>

  );
}

export default App;
