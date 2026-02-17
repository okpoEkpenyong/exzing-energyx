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
import { generateRecommendations } from "../../services/aiService";

const columns: IColumn[] = [
  { key: "supplier", name: "Supplier", fieldName: "supplier", minWidth: 120 },
  { key: "rec", name: "Recommendation", fieldName: "recommendation", minWidth: 300 },
];

const RecommendationPanel: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: async (parsed) => {
        try {
          const response = await generateRecommendations(parsed.data);
          setResults(response.recommendations);
        } catch (err: any) {
          setError(err.message);
        }
      },
    });
  };

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      <Text variant="xLarge">AI Reduction Recommendations</Text>

      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}

      <input type="file" accept=".csv" onChange={handleUpload} />

      {results.length > 0 && (
        <DetailsList items={results} columns={columns} selectionMode={0} />
      )}
    </Stack>
  );
};

export default RecommendationPanel;
