// frontend/web/src/pages/reportsPage.tsx
import React from "react";
import { Stack, Text } from "@fluentui/react";

const ReportsPage: React.FC = () => {
  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { padding: 20 } }}>
      <Text variant="xxLarge">Reports</Text>
      <Text>Export PDF and Excel reports for selected date ranges. (Placeholder page)</Text>
    </Stack>
  );
};

export default ReportsPage;
