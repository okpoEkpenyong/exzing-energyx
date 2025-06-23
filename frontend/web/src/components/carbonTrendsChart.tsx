import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import { Stack, Text } from '@fluentui/react';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface Props {
  loading: boolean;
}

const CarbonTrendsChart: React.FC<Props> = ({ loading }) => {
  if (loading) return <Text>Loading Carbon Trends...</Text>;

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Total CO₂ (tons)',
        data: [320, 290, 310, 330, 280, 260, 310],
        borderColor: '#0392ff',
        backgroundColor: 'rgba(3, 146, 255, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <Stack>
      <Text variant="large">Carbon Emissions Trend</Text>
      <Line data={data} />
    </Stack>
  );
};

export default CarbonTrendsChart;
