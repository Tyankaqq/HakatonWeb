import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/headerComponent/header.css';

function Header() {
    return (
        <header className="main-header">
            <nav className="main-nav">
                <NavLink to="/balancer" className="nav-link" activeClassName="active">Балансировщик</NavLink>
                <NavLink to="/executors" className="nav-link" activeClassName="active">Исполнители</NavLink>
                <NavLink to="/parametrs" className="nav-link" activeClassName="active">Параметры</NavLink>
                <NavLink to="/tasks" className="nav-link" activeClassName="active">Задачи</NavLink>
                <NavLink to="/dashboard" className="nav-link" activeClassName="active">Dashboard</NavLink>
            </nav>
        </header>
    );
}

export default Header;
