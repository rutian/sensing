import { useRef } from 'react';
import uPlot from 'uplot';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';

interface OrientationData {
  timeStamp: number[];
  pitch: number[];
  roll: number[];
  yaw?: number[];
}

export default function OrientationPlot(props: OrientationData) {

  const options: uPlot.Options = {
    title: "Device Orientation Over Time",
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
        range: [-90, 90],
      },
    },
    axes: [
      {
        show: true,
      }],

    series: [
      { show: false },
      {
        label: "Pitch (Beta)",
        stroke: "blue",
        fill: "rgba(0, 0, 255, 0.1)",
      },
      {
        label: "Roll (Gamma)",
        stroke: "green",
        fill: "rgba(0, 255, 0, 0.1)",
      },

    ],
  };

  const data: uPlot.AlignedData = [
    props.timeStamp,
    props.pitch,
    props.roll,
  ];

  const chartRef = useRef<uPlot | null>(null);

  const updatePlot = () => {
    if (chartRef.current) {
      chartRef.current.setData(data, true);
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