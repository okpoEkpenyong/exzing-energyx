// frontend\web\src\components\vesselStatusPanel.tsx

import { Separator, Stack, Text, Shimmer, ProgressIndicator } from '@fluentui/react';
import React from 'react';
import { stackGaps } from '../ux/styles';
import { DashboardMetrics } from '../services/metricsServices';

interface DashboardPanelProps {
    loading: boolean;
    data?: DashboardMetrics | null;
}


const DashboardPanel: React.FC<DashboardPanelProps> = ({ loading, data }) => {
    return (
        <Stack tokens={{ childrenGap: 10, padding: 20 }}>
            <Text variant="xLargePlus">Dashboard Metrics</Text>
            <Separator />
            <Shimmer isDataLoaded={!loading}>
            <Stack tokens={stackGaps}>
            <Text>Total CO2: {data?.totalCO2 ?? '—'}</Text>
            <Text>Avg Per Vessel: {data?.avgPerVessel ?? '—'}</Text>
            <Text>Percent Offset: {data?.percentOffset ?? '—'}</Text>
            <Text>Active Vessels: {data?.activeVessels ?? '—'}</Text>
            {/* <Text>Idle Vessels: {data?.idleVessels ?? '—'}</Text> */}
            
            <Text>Utilization Rate: {data?.utilizationRate ?? '—'}</Text>
            <Text variant="mediumPlus">Fleet Utilization</Text>
            <ProgressIndicator label="Utilization progress" percentComplete={0.85} />
            </Stack>
        </Shimmer>
        </Stack>
    );
};

export default DashboardPanel;
