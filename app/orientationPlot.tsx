import { useRef } from 'react';
import uPlot from 'uplot';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';

interface OrientationData {
  timeStamp: number[];
  pitch: number[];
  roll: number[];
  yaw: number[];
}

export const orientationPlot = (props: OrientationData) => {

  const options: uPlot.Options = {
    title: "Device Orientation Over Time",
    width: 300,
    height: 300,
    scales: {
      x: {
        time: true,
        auto: false,
      },
      y: {
        auto: false,
        range: [-90, 90],
      },
    },
    series: [
      {},
      {
        label: "Pitch (Beta)",
        stroke: "blue",
        width: 5,
      },
      {
        label: "Roll (Gamma)",
        stroke: "green",
        width: 5,
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
      chartRef.current.setData(data);
    }
  };

  setInterval(updatePlot, 200);

  const Chart = () => (
    <UplotReact
      options={options}
      data={data}
      onCreate={(chart) => {
        chartRef.current = chart;
      }}
      onDelete={(chart) => { }}
    />
  );

  return (<Chart />);

}