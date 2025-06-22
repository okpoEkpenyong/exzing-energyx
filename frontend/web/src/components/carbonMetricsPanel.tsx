import { Separator, Stack, Text, Shimmer, ProgressIndicator } from '@fluentui/react';
import React from 'react';
import { dashboardPanelStyles, stackGaps } from '../ux/styles';
import { CarbonMetrics } from '../services/mockDashboardData';



interface CarbonMetricsPanelProps {
    loading?: boolean;
    data?: CarbonMetrics | null;
};

const CarbonMetricsPanel: React.FC<CarbonMetricsPanelProps> = ({ loading, data }) => {
    return (
          // <Stack tokens={stackGaps} styles={dashboardPanelStyles}>
        <Stack tokens={{ childrenGap: 10, padding: 20 }}>

        <Text variant="xLargePlus">Carbon Metrics</Text>
            <Separator />
            <Shimmer isDataLoaded={!loading}>
                <Stack tokens={stackGaps}>
                <Text>Total CO₂ Emissions: {data?.totalCO2 ?? '—'} tons</Text>
                <Text>Average Emissions Per Vessel: {data?.avgPerVessel ?? '—'} tons</Text>
                <Text>Offset via Green Credits: {data?.percentOffset ?? '—'} tons</Text>
                <Text variant="mediumPlus">Weekly Carbon Trend</Text>
                <ProgressIndicator label="Trend" percentComplete={0.6} />
                </Stack>
            </Shimmer>

        </Stack>
    );
};
export default CarbonMetricsPanel;
