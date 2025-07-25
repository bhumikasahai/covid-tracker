import React, { useEffect, useState } from 'react'
import {Line} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  TimeScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
// Register everything needed
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  TimeScale,       // This is critical for "time" scale
  LinearScale,
  Tooltip,
  Legend
);
import numeral from 'numeral';

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return numeral(context.parsed.y).format("+0,0");
        },
      },
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        format: "MM/DD/YY",
        tooltipFormat: "ll",
      },
      title: {
        display: true,
        text: "Date",
      },
    },
    y: {
      ticks: {
        stepSize: 10000,
        callback: function (value) {
          return numeral(value).format("0a");
        },
      },
      title: {
        display: true,
        text: "Cases",
      },
    },
  },
};

//here it was for last 120 days
/*const buildChartData = (data, casesType='cases') =>{
        const chartData = [];
        let lastDataPoint;

        for(let date in data.cases) {
            if(lastDataPoint){
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }*/

    //here i used 2020's 4 months to portray the graph i.e. april 2020 to july 2020
    const buildChartData = (data, casesType = 'cases') => {
    const chartData = [];
    let lastDataPoint;

    const startDate = new Date('2020-04-01');
    const endDate = new Date('2020-07-31');

    for (let date in data[casesType]) {
        const [month, day, year] = date.split('/').map((part) => parseInt(part));
        const formattedDate = new Date(2000 + year, month - 1, day); // Fix: construct date manually

        if (formattedDate >= startDate && formattedDate <= endDate) {
        if (lastDataPoint !== undefined) {
            chartData.push({
            x: formattedDate,
            y: data[casesType][date] - lastDataPoint,
            });
        }
        }
        lastDataPoint = data[casesType][date];
    }

  return chartData;
};


function LineGraph() {
    const[data, setData] = useState({});
 
    // https://disease.sh/v3/..
    // covid-19/historical/all?lastdays=120

    useEffect(() => {
        const fetchData = async() =>{
       // await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all')
        .then(response => response.json())
        .then((data) => {
            //clever stuff here
            let chartData = buildChartData(data,'cases');
            console.log(data);
            //const chartData = buildChartData(data);
            setData(chartData);
        });
        }
        fetchData(); 
    },[]);

    

  return (
    <div>
        {data?.length>0 && (
            <div style={{ height: '180px', width: '300px' }}>
        <Line
            key={JSON.stringify(data)}
            options={options}
            data={{
            datasets: [{
                backgroundColor: 'rgba(204,16,52,0)',
                borderColor: '#CC1034',
                data: data
            }],
            }}
        />
        </div>
        )}
        
        {/*Line Data Option*/}
    </div>
  )
}

export default LineGraph
