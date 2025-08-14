// frontend\web\src\components\carbonTrendsChart.tsx

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Stack, Text } from '@fluentui/react';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface Props {
  loading: boolean;
  data?: { labels: string[]; values: number[] };
}

const CarbonTrendsChart: React.FC<Props> = ({ loading, data }) => {
  if (loading) return <Text>Loading Carbon Trends...</Text>;

  // const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const labels = data?.labels ?? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const values = data?.values ?? [320, 290, 310, 330, 280, 260, 310];


  const chartData = {
    labels,
    datasets: [
      {
        label: 'Total CO₂ (tons)',
        data: values,
        borderColor: '#bf9b30',
        // backgroundColor: 'rgba(3, 146, 255, 0.2)',
        backgroundColor: '#bf9b30',
        tension: 0.3,
        fill: true,
      },
    ],
  };


  return (
    <Stack>
      <Text variant="large">Carbon Emissions Trend</Text>
      <Line data={chartData} />
    </Stack>
  );
};

export default CarbonTrendsChart;
