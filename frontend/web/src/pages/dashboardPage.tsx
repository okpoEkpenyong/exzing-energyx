// src/pages/dashboardPage.tsx

import { Stack, Text, IconButton, IIconProps, IContextualMenuProps, Shimmer, ShimmerElementType } from '@fluentui/react';
import { Fragment, useEffect, useState } from 'react';
import WithApplicationInsights from '../components/telemetryWithAppInsights.tsx';
// import { EnergyxContext } from '../components/energyxContext.ts';
// import { AppContext } from '../models/applicationState.ts';
import { stackGaps, stackPadding, titleStackStyles } from '../ux/styles.ts';
import CarbonMetricsPanel from '../components/carbonMetricsPanel.tsx';  // You’ll create this
import VesselStatusPanel from '../components/vesselStatusPanel.tsx';    // You’ll create this

const DashboardPage = () => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Simulate async loading (replace with real API call or context sync)
        const fetchDashboardData = async () => {
            await new Promise(resolve => setTimeout(resolve, 500)); // placeholder
            setIsReady(true);
        };

        fetchDashboardData();
    }, []);

    const iconProps: IIconProps = {
        iconName: 'Settings',
        styles: { root: { fontSize: 16 } }
    };

    const menuProps: IContextualMenuProps = {
        items: [
            {
                key: 'refresh',
                text: 'Refresh Dashboard',
                iconProps: { iconName: 'Refresh' },
                onClick: () => setIsReady(false) // Replace with real refresh
            }
        ]
    };

    return (
        <Stack tokens={stackGaps} styles={{ root: { padding: 20 } }}>
            <Text variant="xxLarge">Maritime Carbon Dashboard</Text>
            {/* <CarbonMetricsPanel />
            <VesselStatusPanel loading={false} /> */}
            <Stack.Item>
                <Stack horizontal styles={titleStackStyles} tokens={stackPadding}>
                    <Stack.Item grow={1}>
                        <Shimmer width={300}
                            isDataLoaded={isReady}
                            shimmerElements={[{ type: ShimmerElementType.line, height: 20 }]}
                        >
                            <Fragment>
                                <Text block variant="xLarge">Carbon Intelligence Dashboard</Text>
                                <Text variant="small">Real-time overview of emissions, vessel activity, and sustainability indicators</Text>
                            </Fragment>
                        </Shimmer>
                    </Stack.Item>
                    <Stack.Item>
                        <IconButton
                            menuProps={menuProps}
                            iconProps={iconProps}
                            title="Dashboard Actions"
                            ariaLabel="Dashboard Actions" />
                    </Stack.Item>
                </Stack>
            </Stack.Item>

            <Stack.Item tokens={stackPadding}>
                <CarbonMetricsPanel loading={!isReady} />
            </Stack.Item>

            <Stack.Item tokens={stackPadding}>
                <VesselStatusPanel loading={!isReady} />
            </Stack.Item>
        </Stack>
    );
};

const DashboardWithTelemetry = WithApplicationInsights(DashboardPage, 'DashboardPage');

export default DashboardWithTelemetry;
