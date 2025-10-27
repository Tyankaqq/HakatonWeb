import React from 'react';
import TotalInformation from "../components/TotalInformation.jsx";
import '../css/DashBoardPage/DashboardPage.css'

function DashboardPage() {
    return (
        <div className="dashboard=page-container">
            <div className="dashboard-graphics">

                <TotalInformation
                    title="Всего задач"
                    value="3,847"
                    diffValue="+12.5%"
                    diffText="за последнюю неделю"
                    diffColor="#3DB36A"
                    icon= {<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-checks h-4 w-4 text-blue-600" aria-hidden="true"><path d="M13 5h8"></path><path d="M13 12h8"></path><path d="M13 19h8"></path><path d="m3 17 2 2 4-4"></path><path d="m3 7 2 2 4-4"></path></svg>}
                />

                <TotalInformation
                    title="Активных пользователей"
                    value="3,847"
                    diffValue="+12.5%"
                    diffText="за последнюю неделю"
                    diffColor="#3DB36A"
                    icon ={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="lucide lucide-users h-4 w-4 text-green-600" aria-hidden="true">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                    </svg>}
                />

                <TotalInformation
                    title="В обработке "
                    value="3,847"
                    diffValue="+12.5%"
                    diffText="за последнюю неделю"
                    diffColor="#3DB36A"
                    icon ={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="lucide lucide-clock h-4 w-4 text-orange-600" aria-hidden="true">
                        <path d="M12 6v6l4 2"></path>
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>}
                />

                <TotalInformation
                    title="Завершено сегодня"
                    value="3,847"
                    diffValue="+12.5%"
                    diffText="за последнюю неделю"
                    diffColor="#3DB36A"
                    icon ={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                className="lucide lucide-circle-check h-4 w-4 text-emerald-600" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="m9 12 2 2 4-4"></path>
                    </svg>}
                />
            </div>

            <div className="graphics">
                <div className="done-task-for-week">
                    <h1>Выполнено задач за неделю</h1>
                </div>
                <div>
                    <h1>Загрузка системы</h1>
                </div>
            </div>

            <div className="last-tasks">
                <h1>Последние задачи</h1>
            </div>

            <div className="queue-status">
                <h1>Статус очередей</h1>
            </div>
        </div>
    );
}

export default DashboardPage;