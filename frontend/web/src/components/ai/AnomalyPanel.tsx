import React, { useState } from "react";
import {
  Stack,
  PrimaryButton,
  DetailsList,
  IColumn,
  Text,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import Papa from "papaparse";
import { detectAnomaly } from "../../services/aiService";

const columns: IColumn[] = [
  { key: "score", name: "Anomaly Score", fieldName: "anomaly_score", minWidth: 120 },
  { key: "flag", name: "Flagged", fieldName: "is_anomaly", minWidth: 80 },
];

const AnomalyPanel: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: async (parsed) => {
        try {
          const response = await detectAnomaly(parsed.data);
          setResults(response.results);
        } catch (err: any) {
          setError(err.message);
        }
      },
    });
  };

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      <Text variant="xLarge">Fraud & Reporting Anomaly Detection</Text>

      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

      <input type="file" accept=".csv" onChange={handleUpload} />

      {results.length > 0 && (
        <DetailsList items={results} columns={columns} selectionMode={0} />
      )}
    </Stack>
  );
};

export default AnomalyPanel;
