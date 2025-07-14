import { Stack, Text } from '@fluentui/react';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { getTheme, IStackStyles } from '@fluentui/react';

const theme = getTheme();

const tileStyles: IStackStyles = {
  root: {
    width: 200,
    height: 100,
    background: theme.palette.themePrimary,
    color: theme.palette.white,
    borderRadius: 8,
    padding: 16,
    boxShadow: theme.effects.elevation4,
    justifyContent: 'space-between',
  }
};

const iconStyle = { fontSize: 24, marginBottom: 6 };

const SummaryMetricsPanel: React.FC = () => {
  const metrics = [
    { label: 'CO₂ This Month', value: '12,420 t', icon: 'GlobalNavButton' },
    { label: 'Active Vessels', value: '14', icon: 'Ship' },
    { label: 'Fuel Efficiency', value: '78%', icon: 'SpeedHigh' },
    { label: 'Compliance', value: '92%', icon: 'Shield' },
  ];

  return (
    <Stack horizontal wrap tokens={{ childrenGap: 20 }} styles={{ root: { marginBottom: 20 } }}>
      {metrics.map((m, index) => (
        <Stack key={index} styles={tileStyles} verticalAlign="center">
          <FontIcon iconName={m.icon} style={iconStyle} />
          <Text variant="medium">{m.label}</Text>
          <Text variant="xLarge">{m.value}</Text>
        </Stack>
      ))}
    </Stack>
  );
};

export default SummaryMetricsPanel;
