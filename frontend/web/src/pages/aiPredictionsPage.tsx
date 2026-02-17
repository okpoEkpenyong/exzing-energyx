import React from "react";
import { Stack, Text, Separator, Pivot, PivotItem } from "@fluentui/react";
import Scope3Panel from "../components/ai/Scope3Panel";
import AnomalyPanel from "../components/ai/AnomalyPanel";
import RecommendationPanel from "../components/ai/RecommendationPanel";

const AiPredictionsPage: React.FC = () => {
  return (
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 24, maxWidth: 1300, margin: "0 auto" } }}>
      <Text variant="xxLarge">AI Carbon Intelligence Engine</Text>
      <Separator />

      <Pivot>
        <PivotItem headerText="Scope 3 Estimator">
          <Scope3Panel />
        </PivotItem>

        <PivotItem headerText="Anomaly Detection">
          <AnomalyPanel />
        </PivotItem>

        <PivotItem headerText="AI Recommendations">
          <RecommendationPanel />
        </PivotItem>
      </Pivot>
    </Stack>
  );
};

export default AiPredictionsPage;
