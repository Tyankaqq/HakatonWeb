import React from 'react';
import TotalInformation from "../components/TotalInformation.jsx";
import '../css/TotalInformation.css'

function DashboardPage() {
    return (
        <div className="dashboard-totalinfo-container">
            <TotalInformation
                title="123"
                value="3,847"
                diffValue="+12.5%"
                diffText="за последнюю неделю"
                diffColor="#3DB36A"
            />

            <TotalInformation
                title="123"
                value="3,847"
                diffValue="+12.5%"
                diffText="за последнюю неделю"
                diffColor="#3DB36A"
            />

            <TotalInformation
                title="123"
                value="3,847"
                diffValue="+12.5%"
                diffText="за последнюю неделю"
                diffColor="#3DB36A"
            />
        </div>
    );
}

export default DashboardPage;