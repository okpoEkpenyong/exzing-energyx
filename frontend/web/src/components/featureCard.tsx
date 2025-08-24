import React from "react";
import { Stack, Text } from "@fluentui/react";

interface Props {
  title: string;
  body: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const FeatureCard: React.FC<Props> = ({ title, body, icon, onClick }) => {
  return (
    <Stack
      onClick={onClick}
      tokens={{ childrenGap: 8 }}
      styles={{
        root: {
          minWidth: 260,
          maxWidth: 360,
          padding: 16,
          border: "1px solid #bf9b30",   // <-- border shorthand -> visible
          // boxShadow: "0 6px 18px rgba(2,6,23,0.12)",
          boxShadow: `0 6px 18px rgba(2,6,23,0.12), 0 0 0 3px rgba(191,155,48,0.08)`,
          transition: "transform 160ms ease, box-shadow 160ms ease",
          // cursor: onClick ? "pointer" : "default",
        },
      }}
    >
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
        <div style={{ width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>
          {icon}
        </div>
        <Text variant="large">{title}</Text>
      </Stack>
      <Text variant="small">{body}</Text>
    </Stack>
  );
};

export default FeatureCard;
