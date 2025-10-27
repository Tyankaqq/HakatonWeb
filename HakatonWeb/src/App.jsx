import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import "../src/css/style.css";
import DashboardPage from "./pages/DashboardPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import ExecutorsPage from "./pages/ExecutorsPage.jsx";
import BalancerPage from "./pages/BalancerPage.jsx";
import ParametrsPage from "./pages/ParametrsPage.jsx";
import {useState} from "react";



function App() {

    return (

        <BrowserRouter>

            <Header />
            <Routes>
                <Route path="/balancer" element={<BalancerPage />} />
                <Route path="/executors" element={<ExecutorsPage />} />
                <Route path="/parametrs" element={<ParametrsPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="*" element={<Navigate to="/balancer" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
