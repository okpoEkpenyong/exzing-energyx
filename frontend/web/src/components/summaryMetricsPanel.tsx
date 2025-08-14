// frontend\web\src\components\summaryMetricsPanel.tsx

import { Stack, Text } from '@fluentui/react';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { getTheme, IStackStyles } from '@fluentui/react';
import { DashboardMetrics } from '../services/metricsServices';

import React from 'react';

const theme = getTheme();
// linear-gradient(to right, #FFD700, #5B6D2D);
const tileStyles: IStackStyles = {
  root: {
    width: 200,
    height: 100,
    // background: linear-gradient(to right, #FFD700, #5B6D2D),
    background: '#bf9b30', // Changed to a more suitable color
    // background: theme.palette.blueDark, // Changed to a more suitable color
    // background: theme.palette.themePrimary,
    color: theme.palette.white,
    borderRadius: 8,
    padding: 16,
    boxShadow: theme.effects.elevation4,
    justifyContent: 'space-between',
  }
};

const iconStyle = { fontSize: 24, marginBottom: 6 };

interface DashboardPanelProps {
    loading: boolean;
    data?: DashboardMetrics | null;
}



const SummaryMetricsPanel: React.FC<DashboardPanelProps> = ({ loading, data }) => {
  if (!data && loading) return [];
  const metrics = [
    { label: 'CO₂ This Month', value: `${data?.totalCO2 ?? '—'} ton`, icon: 'DrillDownSolid' },
      { label: 'Active Vessels', value: `${data?.activeVessels ?? '—'}`, icon: 'Ferry' },
      { label: 'Avg Per Vessel', value: `${data?.avgPerVessel ?? '—'} ton`, icon: 'RedEye' },
      { label: 'Percent Offset', value: `${((data?.percentOffset ?? 0)*100).toFixed(1)}%`, icon: 'Trophy' },
      { label: 'Utilization Rate', value: `${((data?.utilizationRate ?? 0)*100).toFixed(1)}%`, icon: 'BarChartVertical' },
      { label: 'Fuel Efficiency', value: '78%', icon: 'Fuel' },
      { label: 'Compliance', value: '92%', icon: 'Shield' }
  ];


  return (
    <Stack horizontal wrap tokens={{ childrenGap: 20 }} styles={{ root: { marginBottom: 20 } }}>
      {metrics.map((m, index) => (
        <Stack key={index} styles={tileStyles} verticalAlign="center" >
          <FontIcon iconName={m.icon} style={iconStyle} />
          <Text variant="medium">{m.label}</Text>
          <Text variant="xLarge">{m.value}</Text>
        </Stack>
      ))}
    </Stack>
  );
};

export default SummaryMetricsPanel;


