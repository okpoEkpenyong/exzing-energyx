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
          borderRadius: 8,
          // borderWidth: 20,
          // borderColor: "#bf9b30",
          // cursor: onClick ? "pointer" : "default",
          boxShadow: "0 6px 18px rgba(2,6,23,0.25)",
          transition: "transform 160ms ease",
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
