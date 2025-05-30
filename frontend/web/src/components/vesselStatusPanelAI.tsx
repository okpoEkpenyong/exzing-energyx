import React from "react";

interface VesselStatusPanelAIProps {
    vesselName: string;
    status: "operational" | "maintenance" | "offline";
    lastUpdated: string;
    aiPrediction: string;
}

const statusColors: Record<string, string> = {
    operational: "#4caf50",
    maintenance: "#ff9800",
    offline: "#f44336",
};

const VesselStatusPanelAI: React.FC<VesselStatusPanelAIProps> = ({
    vesselName,
    status,
    lastUpdated,
    aiPrediction,
}) => {
    return (
        <div
            style={{
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                padding: 20,
                maxWidth: 400,
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
        >
            <h2 style={{ margin: 0 }}>{vesselName}</h2>
            <div style={{ display: "flex", alignItems: "center", margin: "12px 0" }}>
                <span
                    style={{
                        display: "inline-block",
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: statusColors[status],
                        marginRight: 8,
                    }}
                />
                <span style={{ fontWeight: 500, textTransform: "capitalize" }}>
                    {status}
                </span>
            </div>
            <div style={{ color: "#757575", fontSize: 14, marginBottom: 12 }}>
                Last updated: {lastUpdated}
            </div>
            <div>
                <strong>AI Prediction:</strong>
                <div style={{ marginTop: 4 }}>{aiPrediction}</div>
            </div>
        </div>
    );
};

export default VesselStatusPanelAI;