import React from 'react';

interface CarbonMetric {
    label: string;
    value: number;
    unit: string;
}

interface CarbonMetricsPanelProps {
    metrics: CarbonMetric[];
}

const CarbonMetricsPanel: React.FC<CarbonMetricsPanelProps> = ({ metrics }) => {
    return (
        <section className="carbon-metrics-panel">
            <h2>Carbon Metrics</h2>
            <ul>
                {metrics.map((metric, idx) => (
                    <li key={idx} className="carbon-metric-item">
                        <span className="metric-label">{metric.label}:</span>
                        <span className="metric-value">{metric.value.toLocaleString()}</span>
                        <span className="metric-unit">{metric.unit}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default CarbonMetricsPanel;