import React from 'react';
import { useEffect, useRef } from 'react';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';

interface OrientationData {
  timeStamp: number[];
  pitch?: number[];
  roll: number[];
  yaw?: number[];
}

export const OrientationPlot = React.memo((props: OrientationData)=> {

  const options: uPlot.Options = {
    width: 300,
    height: 300,
    pxAlign: false,
    legend: {
      show: true,
    },
    scales: {
      x: {
        time: true,
        auto: true,
      },
      y: {
        auto: false,
        range: [-50, 50],
      },
    },
    axes: [
      {
        show: true,
      }],

    series: [
      { show: false },
      {
        stroke: "green",
        fill: "rgba(0, 255, 0, 0.1)",
      },
    ],
  };

  const data: uPlot.AlignedData = [
    props.timeStamp,
    props.roll,
  ];

  const chartRef = useRef<uPlot | null>(null);

  const updatePlot = () => {
    if (chartRef.current) {
      chartRef.current.setData(data, true);
      chartRef.current.redraw(false)
    }
  };

  useEffect(() => {
    console.log('using effect..., how often does this run?');
    setInterval(updatePlot, 20);
  }, []);


  return (
    <>
      <UplotReact
        options={options}
        data={data}
        onCreate={(chart) => {
          chartRef.current = chart;
          console.log('recreating chart...')
        }}
        onDelete={(chart) => { }}
      />
    </>
  );;

}, ()=> true );