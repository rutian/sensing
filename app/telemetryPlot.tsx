import React from 'react';
import { useEffect, useRef } from 'react';
import UplotReact from 'uplot-react';
import 'uplot/dist/uPlot.min.css';

interface TelemetryData {
  timeStamp: number[];
  data: number[][];
  label: string[];
  range: [number, number];
}

export const TelemetryPlot = React.memo((props: TelemetryData) => {

  if (props.data.length > 5) {
    throw new Error("TelemetryPlot only supports up to 5 data series");
  }

  if (props.data.length !== props.label.length) {
    throw new Error("TelemetryPlot data and label length mismatch");
  }

  const strokeColors = ["green", "blue", "red", "orange", "purple"];
  const fillColors = ["rgba(0, 255, 0, 0.1)", "rgba(0, 0, 255, 0.1)", "rgba(255, 0, 0, 0.1)", "rgba(255, 165, 0, 0.1)", "rgba(128, 0, 128, 0.1)"]; 

  const seriesLabelStrokeAndFill = props.data.map((_, index) => ({
    label: props.label[index],
    stroke: strokeColors[index],
    fill: fillColors[index],
  }));

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
        range: props.range,
      },
    },
    axes: [
      {
        show: true,
      }],

    series: [
      { show: false },
      ...seriesLabelStrokeAndFill,
    ],
  };

  const data: uPlot.AlignedData = [
    props.timeStamp,
    ...props.data,
  ];

  const chartRef = useRef<uPlot | null>(null);

  const updatePlot = () => {
    if (chartRef.current) {
      chartRef.current.setData(data, true);
      chartRef.current.redraw(false)
    }
  };

  useEffect(() => {
    setInterval(updatePlot, 20);
  }, []);

  return (
    <>
      <UplotReact
        options={options}
        data={data}
        onCreate={(chart) => {
          chartRef.current = chart;
        }}
        onDelete={(chart) => { }}
      />
    </>
  );;

}, () => true);