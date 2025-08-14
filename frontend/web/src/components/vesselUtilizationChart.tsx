// frontend\web\src\components\vesselUtilizationChart.tsx

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Stack, Text } from '@fluentui/react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  loading: boolean;
  data?: { labels: string[]; values: number[] }; // values are expected 0..1 (percent)
}

const VesselUtilizationChart: React.FC<Props> = ({ loading, data }) => {
  if (loading) return <Text>Loading Vessel Utilization...</Text>;

  const labels = data?.labels ?? ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  // If data values are 0..1, convert to percentages for chart
  const values = data?.values ? data.values.map(v => v * 100) : [85, 90, 92, 87];

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Utilization (%)',
        data: values,
        backgroundColor: '#bf9b30',
      },
    ],
  };

  return (
    <Stack>
      <Text variant="large">Vessel Utilization Rate</Text>
      <Bar data={chartData} />
    </Stack>
  );
};


export default VesselUtilizationChart;
