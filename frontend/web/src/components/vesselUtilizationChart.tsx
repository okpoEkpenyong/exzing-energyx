import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Stack, Text } from '@fluentui/react';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Props {
  loading: boolean;
}

const VesselUtilizationChart: React.FC<Props> = ({ loading }) => {
  if (loading) return <Text>Loading Vessel Utilization...</Text>;

  const data = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Utilization (%)',
        data: [85, 90, 92, 87],
        backgroundColor: '#ffd700', // gold
      },
    ],
  };

  return (
    <Stack>
      <Text variant="large">Vessel Utilization Rate</Text>
      <Bar data={data} />
    </Stack>
  );
};

export default VesselUtilizationChart;
