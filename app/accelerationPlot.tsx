import { useRef } from 'react';
import uPlot from 'uplot';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';

interface accelerationData{
  timeStamp: number[];
  x: number[];
  y: number[];
  z: number[];
}

export default function accelerationPlot (props: accelerationData){

  const options: uPlot.Options = {
    title: "Device Acceleration Over Time",
    width: 300,
    height: 300,
    pxAlign: false,
    scales: {
      x: {
        time: true,
        auto: true,
      },
      y: {
        auto: false,
        range: [-10, 10],
      },
    },
    axes: [
      {
        show: true,
      }],
    
    series: [
      {show: false},
      {
        label: "X",
        stroke: "blue",
        fill: "rgba(0, 0, 255, 0.1)",
      },
      {
        label: "Y",
        stroke: "green",
        fill: "rgba(0, 255, 0, 0.1)",
      },
      {
        label: "Z",
        stroke: "red",
        fill: "rgba(255, 0, 0, 0.1)",
      }

    ],
  };

  const data: uPlot.AlignedData = [
    props.timeStamp,
    props.x,
    props.y,
    props.z,
  ];

  const chartRef = useRef<uPlot | null>(null);

  const updatePlot = () => {
    if (chartRef.current) {
      
      chartRef.current.setData(data, true);
      console.log('updating accel plot');
      chartRef.current.redraw(false)
    }
  };

  return (
    <UplotReact
      options={options}
      data={data}
      onCreate={(chart) => {
        chartRef.current = chart;
        setInterval(updatePlot, 10);
      }}
      onDelete={(chart) => { }}
    />
  );;

}