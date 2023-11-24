import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

ChartJS.register(
    Legend,
    Tooltip,
    ArcElement
)

const DoughnutChart = () => {
    
    const data = {
        // labels: ['CPR', 'Mental Health', 'ACLS', 'Emergency Response'],
        labels: ['Pune', 'Chennai', 'Mumbai'],
        datasets: [{
          label: 'Completion count',
          data: [7, 2, 3, 6],
          backgroundColor: [
            '#3C9AFB',
            '#F69B7E',
            '#6A0DAD',
            '#00C0A3',
          ],
          borderColor: [
            '#3C9AFB',
            '#F69B7E',
            '#6A0DAD',
            '#00C0A3'
          ],
          borderWidth: 1,
          cutout: '70%'
        }]
      };

      const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                pointStyle:'rect',
              },
              onClick: () => {},
            },
        },
        legend: {
            label: {
                fontSize : 26,
            }
        }
      }

  return (
    <Doughnut
        height={'100%'}
        data={data}
        options={options}
    />
  )
}

export default DoughnutChart