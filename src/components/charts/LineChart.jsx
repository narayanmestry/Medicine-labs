import { Chart as ChartJS, CategoryScale,
    LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
import {Line} from 'react-chartjs-2';
// import { locationLables, sampleData } from '../data/sampleData';
import{ sliceStrings }from '../../shared/helper'
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

let months =  ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const LineChart = (props) => {
  let labelsName = sliceStrings(Object?.keys(months))
    const data = {
        labels: labelsName,
        datasets: [{ 
          label: 'Completed',
          data: months.map( month => {
            if(!!props.monthsData.filter(_month => month === _month.month )[0]){
              return props.monthsData.filter(_month => month === _month.month )[0].completed
            } else {
              return 0
            }
          }),
          borderColor: ['#6A0DAD'],
          backgroundColor: '#6A0DAD',
          borderWidth: 2,
          tension:0.4
        },
        {
          label: 'incomplete',
          data: months.map( month => {
            if(!!props.monthsData.filter(_month => month === _month.month )[0]){
              return props.monthsData.filter(_month => month === _month.month )[0].incompleted
            } else {
              return 0
            }
          }),
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
              labels: {
                usePointStyle: true
              },
              onClick: () => {},
              position: 'top',
              align: 'end'
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
              ticks: {
                beginAtZero: true,
                // callback: function (value) {
                //       return value + ' times'; 
                //   },
                  // stepSize: 1,
              },
              border:{
                display:false
              }
            },
          },
      }
  return (
    <Line
        height={'100%'}
        data={data}
        options={options}
        plugins={[
          {
            beforeDraw(c) {
              var legends = c.legend.legendItems;
              legends[0].fillStyle = "#6A0DAD";
              legends[1].fillStyle = "#3C9AFB";
            }
          }
        ]}
    />
  )
}

export default LineChart