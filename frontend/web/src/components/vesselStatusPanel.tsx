import { Separator, Stack, Text, Shimmer, ProgressIndicator } from '@fluentui/react';
import React from 'react';
import { dashboardPanelStyles, stackGaps } from '../ux/styles';
import { VesselStatus } from '../services/mockDashboardData';

interface VesselStatusPanelProps {
    loading: boolean;
    data?: VesselStatus | null;
}

const VesselStatusPanel: React.FC<VesselStatusPanelProps> = ({ loading, data }) => {
    return (
        <Stack tokens={{ childrenGap: 10 }} padding={20}>
            <Text variant="xLargePlus">Vessel Status</Text>
            <Separator />
            <Shimmer isDataLoaded={!loading}>
            <Stack tokens={stackGaps}>
            <Text>Active Vessels: {data?.activeVessels ?? '—'}</Text>
            <Text>Idle Vessels: {data?.idleVessels ?? '—'}</Text>
            <Text>Utilization Rate: {data?.utilizationRate ?? '—'}</Text>
            <Text variant="mediumPlus">Fleet Utilization</Text>
            <ProgressIndicator label="Utilization progress" percentComplete={0.85} />
            </Stack>
        </Shimmer>
        </Stack>
    );
};

export default VesselStatusPanel;
