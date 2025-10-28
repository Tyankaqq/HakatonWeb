import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/headerComponent/header.css';
import TaskLogo from '../assets/Image/TaskLogo.svg';
import ExecutorLogo from '../assets/Image/ExecutorsLogo.svg';
import BalancerLogo from '../assets/Image/BalancerLogo.svg';
import DashboardLogo from '../assets/Image/DashboardLogo.svg';
import ParametresLogo from '../assets/Image/ParametresLogo.svg';
import ZunamiLogo from '../assets/Image/zunamiLogo.svg';
function Header() {
    return (
        <aside className="sidebar">
            {/* Логотип */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <img src={ZunamiLogo} alt="ZunamiLogo" style={{width:'50px',height:'50px'}} />
                    <span className="sidebar-title">Zunami Executor</span>
                </div>
            </div>

            {/* Основное меню */}
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <div className="nav-section-title">Основное</div>

                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <img src={DashboardLogo} alt="Dashboard" />
                        <span>Dashboard</span>
                    </NavLink>


                    <NavLink to="/executors" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <img src={ExecutorLogo} alt="executors" />
                        <span>Исполнители</span>
                    </NavLink>



                    <NavLink to="/balancer" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <img src={BalancerLogo} alt="balancers" />
                        <span>Балансировщик</span>
                    </NavLink>
                </div>

                {/* Система */}
                <div className="nav-section">
                    <div className="nav-section-title">Система</div>



                    <NavLink to="/parametrs" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                        <img src={ParametresLogo}/>
                        <span>Параметры</span>
                    </NavLink>
                </div>
            </nav>
        </aside>
    );
}

export default Header;
