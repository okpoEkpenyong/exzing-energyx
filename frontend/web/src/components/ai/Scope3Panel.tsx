import React, { useState, useEffect } from "react";
import {
  Stack,
  PrimaryButton,
  DetailsList,
  IColumn,
  Text,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import { predictScope3 } from "../../services/aiService";
import Papa from "papaparse";

const columns: IColumn[] = [
  { key: "supplier", name: "Category", fieldName: "category", minWidth: 100 },
  { key: "pred", name: "Predicted (kgCO₂e)", fieldName: "predicted_kgco2e", minWidth: 140 },
  { key: "unc", name: "Uncertainty (kgCO₂e)", fieldName: "uncertainty_kgco2e", minWidth: 140 },
  { key: "risk", name: "Risk Level", fieldName: "riskLevel", minWidth: 100 },
];

const Scope3Panel: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  

  const [modelStatus, setModelStatus] = useState(null);
  const [trainingFile, setTrainingFile] = useState(null);
  const [predictionFile, setPredictionFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [predictions, setPredictions] = useState(null);

  

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) ?? "https://exzing-energyx.onrender.com";


    useEffect(() => {
      let mounted = true;
      const load = async () => {
        setLoading(true);
        setError(null);
        try {
          // const d = await fetchDashboardMetrics();
          const fetchStatus = async () => {
            try {

              const res = await fetch(`${API_BASE_URL}/model-status`)
              const data = await res.json();
              setModelStatus(data);
            } catch (err) {
              setError("Failed to fetch model status");
            }
          };
          console.log({model_data: data})
          if (!mounted) return;
          setMetrics(data ?? null);
        } catch (err: any) {
          console.error("Model load error:", err);
          if (mounted) setError(String(err?.message ?? err));
        } finally {
          if (mounted) setLoading(false);
        }
      };
      load();
      return () => {
        mounted = false;
      };
    }, [API_BASE_URL]);
  
   
  
    const handleTrain = async () => {
      if (!trainingFile) return;
  
      setLoading(true);
      setError(null);
  
      const formData = new FormData();
      formData.append("file", trainingFile);
  
      try {
        const res = await fetch(`${API_BASE_URL}/scope3/train`, {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
  
        if (!res.ok) throw new Error(data.detail || "Training failed");
  
        setMetrics(data.metrics);
        await fetchStatus();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const handlePredict = async () => {
      if (!predictionFile) return;
  
      setLoading(true);
      setError(null);
  
      const formData = new FormData();
      formData.append("file", predictionFile);
  
      try {
        const res = await fetch(`${API_BASE_URL}/scope3/predict`, {
          method: "POST",
          body: formData,
        });
  
        const data = await res.json();
  
        if (!res.ok) throw new Error(data.detail || "Prediction failed");
  
        setPredictions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    const downloadPredictions = () => {
      if (!predictions?.predictions) return;
  
      const rows = predictions.predictions.map((p, i) => ({
        id: i + 1,
        predicted_scope3: p,
      }));
  
      const csv =
        "id,predicted_scope3\n" +
        rows.map((r) => `${r.id},${r.predicted_scope3}`).join("\n");
  
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
      a.download = "scope3_predictions.csv";
      a.click();
    };

    const handleFileUpload = (e: any) => {
      const file = e.target.files[0];
  
      Papa.parse(file, {
        header: true,
        complete: async (parsed) => {
          try {
            const response = await predictScope3(parsed.data);
            const enriched = response.results.map((r: any) => {
              const ratio = r.uncertainty_kgco2e / r.predicted_kgco2e;
              let risk = "Low";
              if (ratio > 0.25) risk = "High";
              else if (ratio > 0.1) risk = "Medium";
  
              return { ...r, riskLevel: risk };
            });
  
            setResults(enriched);
          } catch (err: any) {
            setError(err.message);
          }
        },
      });
    };
  
    return (
      <div className="p-6 rounded-2xl shadow-lg bg-white space-y-6">
        <h2 className="text-2xl font-semibold">Scope 3 AI Engine</h2>
  
        {/* Model Status */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <h3 className="font-medium mb-2">Model Status</h3>
          {modelStatus?.models_trained > 0 ? (
            <div className="text-green-600">
              ✔ Model Ready (v{modelStatus.latest_model.version})
            </div>
          ) : (
            <div className="text-yellow-600">
              ⚠ No trained model found
            </div>
          )}
        </div>
  
        {/* Training Section */}
        <div className="space-y-3">
          <h3 className="font-medium">Train Model</h3>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setTrainingFile(e.target.files[0])}
          />
          <button
            onClick={handleTrain}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Training..." : "Train & Save Model"}
          </button>
  
          {metrics && (
            <div className="text-sm text-gray-700">
              <p>R²: {metrics.r2?.toFixed(4)}</p>
              <p>MAE: {metrics.mae?.toFixed(4)}</p>
            </div>
          )}
        </div>
  
        {/* Prediction Section */}
        <div className="space-y-3">
          <h3 className="font-medium">Predict Scope 3</h3>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setPredictionFile(e.target.files[0])}
          />
          <button
            onClick={handlePredict}
            disabled={loading || modelStatus?.models_trained === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Run Prediction"}
          </button>
  
          {predictions && (
            <div className="space-y-2">
              <div className="text-sm text-gray-700">
                Model Version: {predictions.model_version}
              </div>
              <button
                onClick={downloadPredictions}
                className="px-3 py-1 bg-gray-800 text-white rounded-md"
              >
                Download CSV
              </button>
            </div>
          )}
        </div>
  
        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }
  

  // return (
  //   <Stack tokens={{ childrenGap: 12 }}>
  //     <Text variant="xLarge">Bulk Scope 3 Estimation</Text>

  //     {error && (
  //       <MessageBar messageBarType={MessageBarType.error}>
  //         {error}
  //       </MessageBar>
  //     )}

  //     <input type="file" accept=".csv" onChange={handleFileUpload} />

  //     {results.length > 0 && (
  //       <DetailsList items={results} columns={columns} selectionMode={0} />
  //     )}
  //   </Stack>
  // );


export default Scope3Panel;
