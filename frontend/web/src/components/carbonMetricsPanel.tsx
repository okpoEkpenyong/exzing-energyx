import { Separator, Stack, Text } from '@fluentui/react';
import React from 'react';

type CarbonMetricsPanelProps = {
    loading?: boolean;
};

const CarbonMetricsPanel: React.FC<CarbonMetricsPanelProps> = ({ loading }) => {
    return (
        <Stack tokens={{ childrenGap: 10 }} padding={20}>
            <Text variant="xLargePlus">Carbon Metrics</Text>
            <Separator />
            {loading ? (
                <Text>Loading...</Text>
                
            ) : (
                <Text>Coming soon: Emission graphs, credit generation, and reductions over time.</Text>
            )}
        </Stack>
    );
};
export default CarbonMetricsPanel;
