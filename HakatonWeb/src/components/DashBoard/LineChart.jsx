// src/components/Dashboard/LineChart.jsx
import React, { useState, useEffect } from 'react';
import '../../css/DashBoard/LineChart.css';

const LineChart = ({ title, data = [] }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Запускаем анимацию при появлении данных
        if (data && data.length > 0) {
            setIsAnimating(true);
        }
    }, [data]);

    // Если нет данных, показываем заглушку
    if (!data || data.length === 0) {
        return (
            <div className="chart-card">
                <div className="chart-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                        <polyline points="17 6 23 6 23 12"/>
                    </svg>
                    <h3 className="chart-title">{title}</h3>
                </div>
                <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
                    Нет данных для отображения
                </div>
            </div>
        );
    }

    // Находим максимальное значение для масштабирования
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const minValue = Math.min(...data.map(d => d.value), 0);

    // Генерируем точки для графика
    const points = data.map((point, index) => {
        const x = 40 + (index / (data.length - 1)) * 520; // От 40 до 560
        const y = 250 - ((point.value - minValue) / (maxValue - minValue || 1)) * 200; // От 50 до 250
        return { x, y, value: point.value, label: point.label };
    });

    // Создаем строку для polyline
    const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

    return (
        <div className="chart-card">
            <div className="chart-header">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                </svg>
                <h3 className="chart-title">{title}</h3>
            </div>
            <svg className="line-chart line-chart-large" viewBox="0 0 600 280">
                {/* Сетка */}
                <g className="chart-grid" opacity="0.1">
                    {[0, 1, 2, 3, 4, 5].map(i => (
                        <line
                            key={`h-${i}`}
                            x1="40"
                            y1={50 + i * 40}
                            x2="560"
                            y2={50 + i * 40}
                            stroke="#94a3b8"
                            strokeWidth="1"
                        />
                    ))}
                </g>

                {/* Линия графика с анимацией */}
                <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polylinePoints}
                    className={isAnimating ? 'line-animated' : ''}
                />

                {/* Область под графиком (градиент) */}
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                    </linearGradient>
                </defs>
                <polygon
                    fill="url(#areaGradient)"
                    points={`40,250 ${polylinePoints} 560,250`}
                    className={isAnimating ? 'area-animated' : ''}
                />

                {/* Точки и значения */}
                {points.map((point, index) => (
                    <g key={index} className={isAnimating ? `point-animated point-delay-${index}` : ''}>
                        {/* Круг вокруг точки (hover эффект) */}
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="12"
                            fill="#10b981"
                            opacity="0"
                            className="chart-point-hover"
                        />

                        {/* Основная точка */}
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill="#fff"
                            stroke="#10b981"
                            strokeWidth="3"
                            className="chart-point"
                        />

                        {/* Значение в мс над точкой */}
                        <text
                            x={point.x}
                            y={point.y - 20}
                            textAnchor="middle"
                            fill="#1e293b"
                            fontSize="14"
                            fontWeight="700"
                            className="chart-value-text"
                        >
                            {point.value} мс
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default LineChart;
