// src/pages/dashboardPage.tsx

import { Image, Stack, Text, Shimmer, ShimmerElementType, ImageFit } from '@fluentui/react';
import { Fragment, useEffect, useState } from 'react';
import WithApplicationInsights from '../components/telemetryWithAppInsights.tsx';
import { stackGaps, stackPadding, titleStackStyles } from '../ux/styles.ts';
import CarbonTrendsChart from '../components/carbonTrendsChart.tsx';
import SummaryMetricsPanel from '../components/summaryMetricsPanel.tsx';
// import EmissionForm from '../components/emissionForm.tsx';
// import EmissionsList from '../components/emissionList.tsx';
import { fetchDashboardMetrics, DashboardMetrics } from '../services/metricsServices.ts';
import CreditsDashboard from './creditsDashboard.tsx';
import VesselSnapshot from './vesselSnapshot.tsx';
// import VoyageLog from './voyageLog.tsx';


const DashboardPage = () => {
    const [isReady, setIsReady] = useState(false);
    const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
          setIsReady(false);
  
          const dashboard = await fetchDashboardMetrics();

          setDashboardData(dashboard);
          setIsReady(true);
          
        };
    
        fetchDashboardData();

      }, []);

      console.log("fetched dashboardData:", dashboardData);
    


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
                        styles={{
                          root: {
                            maxWidth: '100%',
                            height: 'auto',
                            marginTop: 10,
                            borderRadius: 4,
                          },
                        }}
                        imageFit={ImageFit.contain}
                      />
                  </Fragment>
                </Shimmer>
              </Stack.Item>
              <Stack.Item>
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Text variant="xLarge">Dashboard Metrics</Text>
          <Stack.Item tokens={stackPadding}>
           <SummaryMetricsPanel loading={!isReady} data={dashboardData} />
          </Stack.Item>

          <Stack.Item tokens={stackPadding}>
            <CarbonTrendsChart loading={!isReady} 
            data={dashboardData ? { labels: dashboardData.labels, values: dashboardData.weeklyTrend } : undefined}
            />
          </Stack.Item>
    
            {/* <Stack.Item tokens={stackPadding}>
              <VesselUtilizationChart loading={!isReady} 
              data={dashboardData ? { labels: dashboardData.labels, values: dashboardData.utilizationSeries } : undefined}
              />
            </Stack.Item> */}
 
            <Stack 
              horizontal
              wrap
              tokens={{ childrenGap: 20 }}
              styles={{
                root: {
                  width: '100%',
                  '@media (max-width: 768px)': {
                    flexDirection: 'column',
                  },
                },
              }}
          >
          {/* <Stack.Item grow styles={{ root: { minWidth: 300 } }}>
            <EmissionForm />
          </Stack.Item>

          <Stack.Item grow styles={{ root: { minWidth: 300 } }}>
            <EmissionsList />
          </Stack.Item> */}
          <Stack.Item grow styles={{ root: { minWidth: 300 } }}>
            <CreditsDashboard />
            <VesselSnapshot />
            {/* <VoyageLog /> */}
          </Stack.Item>
            </Stack>
        </Stack>
      );

        //  { to: "/voyage", label: "Voyage Log" },
        //   { to: "/vessels", label: "Vessels" },
        //   { to: "/credits", label: "Credits" },

};

const DashboardWithTelemetry = WithApplicationInsights(DashboardPage, 'DashboardPage');

export default DashboardWithTelemetry;
