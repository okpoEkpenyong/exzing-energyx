import { Separator, Stack, Text } from '@fluentui/react';
import React from 'react';

interface VesselStatusPanelProps {
    loading: boolean;
}

const VesselStatusPanel: React.FC<VesselStatusPanelProps> = ({ loading }) => {
    return (
        <Stack tokens={{ childrenGap: 10 }} padding={20}>
            <Text variant="xLargePlus">Vessel Status</Text>
            <Separator />
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <Text>Live vessel tracking and operational emissions data will appear here.</Text>
            )}
        </Stack>
    );
};

export default VesselStatusPanel;
