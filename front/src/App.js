import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VerificationPage from "./pages/VerificationPage.tsx";
import TasksPage from "./pages/TasksPage.tsx";





function App() {
  return (


    <Router>

      <Routes>
        <Route path="/" element={<VerificationPage />} />
        <Route path="/tasks" element={<TasksPage />} />
      </Routes>
    </Router>
  );
}

export default App;
