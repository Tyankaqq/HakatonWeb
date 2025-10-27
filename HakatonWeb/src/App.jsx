import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import "../src/css/style.css";
import DashboardPage from "./pages/DashboardPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import ExecutorsPage from "./pages/ExecutorsPage.jsx";
import QueuePage from "./pages/QueuePage.jsx";
import BalancerPage from "./pages/BalancerPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/executors" element={<ExecutorsPage />} />
                <Route path="/queues" element={<QueuePage />} />
                <Route path="/balancer" element={<BalancerPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
