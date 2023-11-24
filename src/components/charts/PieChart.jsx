import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title} from 'chart.js';
import {Pie} from 'react-chartjs-2';
import{ sliceStrings }from '../../shared/helper'
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    ArcElement
)

const PieChart = (props) => {
  const {locationData} = props;
  const completedData = Object.keys(locationData).map(key => locationData[key].filter( task => task.complete === true).length);
  let labelsName = sliceStrings(Object?.keys(locationData))

    const data = {
        labels:  labelsName,
        datasets: [{
          label: 'Completion count',
          data: completedData,
          backgroundColor: [  
                          '#6A0DAD',
                          '#F69B7E',
                          '#00C0A3',
                          '#FF6969',
                        ],
          borderColor: [
                          '#6A0DAD',
                          '#F69B7E',
                          '#00C0A3',
                          '#FF6969',
                        ],
          borderWidth: 1
        }]
      };

      const options = {
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
        maintainAspectRatio: false,
        legend: {
            label: {
                fontSize : 26
            }
        },
      }

  return (
        <Pie
            height={'100%'}
            data={data}
            options={options}
        />
  )
}

export default PieChart