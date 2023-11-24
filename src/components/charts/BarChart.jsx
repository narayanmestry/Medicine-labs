import React from 'react';
import { Chart as ChartJS, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend} from 'chart.js';
import {Bar} from 'react-chartjs-2';
import{ sliceStrings }from '../../shared/helper'
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


const BarChart = ({locationData}) => {
  let labelsName = sliceStrings(Object?.keys(locationData)) 
  const completedData = Object.keys(locationData).map(key => locationData[key].filter( task => task.complete === true).length);
  const inCompletedData = Object.keys(locationData).map(key => locationData[key].filter( task => task.complete === false).length);
    const data = {
        labels: labelsName,
        datasets: [{ 
            label: 'Completed',
            data: completedData,
            borderColor: ['#6A0DAD'],
            backgroundColor: '#6A0DAD',
            borderWidth: 2,
            tension:0.4
          },
          {
            label: 'incomplete',
            data: inCompletedData,
            borderColor: ['#3C9AFB'],
            backgroundColor: '#3C9AFB',
            borderWidth: 2,
            tension:0.4
          }]
      };

      const options = {
        maintainAspectRatio: false,
        plugins: {
            legend: {
              position: 'top',
              align:'end',
              labels: {
                usePointStyle: true,
                pointStyle:'rect',
              },
              onClick: () => {},
            },
        },
          scales: {
            x: {
                grid: {
                  display: false,
                },
              },
            y: {
                grid:{
                    color: '#EEF1F5'
                },
                beginAtZero: true,
                ticks: {
                    // callback: function (value) {
                    //     return value + ' times'; 
                    // },
                    // stepSize: 1,
                },
                border:{
                    display:false
                  }
              },
        },

        legend: {
            label: {
                fontSize : 26
            }
        }
      }

  return (
    <>
            <Bar
                height={'100%'}
                width={'100%'}
                data={data}
                options={options}
            />
    </>
  )
}

export default BarChart