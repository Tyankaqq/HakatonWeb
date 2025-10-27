import React from 'react';
import '../css/TotalInformation.css';

function TotalInformation({
  title,
  value,
  diffValue,
  diffText,
  icon,
  diffColor = '#3DB36A',
}) {
    return (
        <div className="total-card">
            <div className="total-card-header">
                <span>{title}</span>
                <span className="card-icon">{icon}</span>
            </div>
            <div className="total-card-count">{value}</div>
            <div className="total-card-growth">
                <span className="growth-value" style={{ color: diffColor }}>
                    {diffValue}
                </span>
                <span className="growth-text">{diffText}</span>
            </div>
        </div>
    );
}

export default TotalInformation;
