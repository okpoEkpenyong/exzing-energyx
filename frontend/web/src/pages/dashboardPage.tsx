// src/pages/dashboardPage.tsx

import { Image, Stack, Text, IconButton, IIconProps, IContextualMenuProps, Shimmer, ShimmerElementType, ImageFit } from '@fluentui/react';
import { Fragment, useEffect, useState } from 'react';
import WithApplicationInsights from '../components/telemetryWithAppInsights.tsx';
import { stackGaps, stackPadding, titleStackStyles } from '../ux/styles.ts';
import CarbonMetricsPanel from '../components/carbonMetricsPanel.tsx'; 
import VesselStatusPanel from '../components/vesselStatusPanel.tsx';  
import {
    fetchCarbonMetrics, fetchVesselStatus,
    CarbonMetrics, VesselStatus
  } from '../services/mockDashboardData.ts';
  

const DashboardPage = () => {
    const [isReady, setIsReady] = useState(false);
    const [carbonData, setCarbonData] = useState<CarbonMetrics | null>(null);
    const [vesselData, setVesselData] = useState<VesselStatus | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
          setIsReady(false);
          const [carbon, vessel] = await Promise.all([
            fetchCarbonMetrics(),
            fetchVesselStatus()
          ]);
          setCarbonData(carbon);
          setVesselData(vessel);
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
          <Stack.Item>
            <Stack horizontal styles={titleStackStyles} tokens={stackPadding}>
              <Stack.Item grow={1}>
                <Shimmer width={300} isDataLoaded={isReady}
                  shimmerElements={[{ type: ShimmerElementType.line, height: 20 }]}>
                  <Fragment>
                    <Text block variant="xLarge">Carbon Intelligence Dashboards</Text>
                    <Text variant="small">We offer real-time overview of emissions, vessel activity, and sustainability indicators</Text>
                    <Image
                      src="/assets/vessel-gold.png"
                      alt="Exzing Logo"
                      width={320}
                      height="auto"
                      imageFit={ImageFit.contain}
                    />
                  </Fragment>
                </Shimmer>
              </Stack.Item>
              <Stack.Item>
                <IconButton menuProps={menuProps} iconProps={iconProps} title="Dashboard Actions" ariaLabel="Dashboard Actions" />
              </Stack.Item>
            </Stack>
          </Stack.Item>
    
          <Stack.Item tokens={stackPadding}>
            <CarbonMetricsPanel loading={!isReady} data={carbonData} />
          </Stack.Item>
    
          <Stack.Item tokens={stackPadding}>
            <VesselStatusPanel loading={!isReady} data={vesselData} />
          </Stack.Item>
        </Stack>
      );

};

const DashboardWithTelemetry = WithApplicationInsights(DashboardPage, 'DashboardPage');

export default DashboardWithTelemetry;
