"use client";

import { useEffect, useState } from "react";
import OrientationPlot from "./orientationPlot";
import AccelerationPlot from "./accelerationPlot";

export default function Home() {

  const initialTime = Date.now();
  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [timeStamp, setTimeStamp] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const orientationTimeStampArray: number[] = [];
  const alphaArray: number[] = [];
  const betaArray: number[] = [];
  const gammaArray: number[] = [];


  const accelTimeStampArray: number[] = [];
  const accelXArray: number[] = [];
  const accelYArray: number[] = [];
  const accelZArray: number[] = [];

  const maxDataPoints = 250;

  const handleMotion = (event: DeviceMotionEvent) => {
    if (accelTimeStampArray.length >= maxDataPoints) {
      accelTimeStampArray.shift();
      accelXArray.shift();
      accelYArray.shift();
      accelZArray.shift();
    }
    accelXArray.push(event.acceleration?.x || 0);
    accelYArray.push(event.acceleration?.y || 0);
    accelZArray.push(event.acceleration?.z || 0);
    accelTimeStampArray.push((event.timeStamp + initialTime) / 1000);
  }

  const handleOrientation = (event: DeviceOrientationEvent) => {
    // setAlpha(event.alpha || 0);
    // setBeta(event.beta || 0);
    // setGamma(event.gamma || 0);
    // setTimeStamp(event.timeStamp / 1000);

    if (orientationTimeStampArray.length >= maxDataPoints) {
      orientationTimeStampArray.shift();
      alphaArray.shift();
      betaArray.shift();
      gammaArray.shift();
    }

    orientationTimeStampArray.push((event.timeStamp + initialTime) / 1000);
    alphaArray.push(event.alpha || 0);
    betaArray.push(event.beta || 0);
    gammaArray.push(event.gamma || 0);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-12">
    
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
      Telemetry
      </h1>
      
      <div className="h-5"></div>
      
      <OrientationPlot
        timeStamp={orientationTimeStampArray}
        pitch={betaArray}
        roll={gammaArray}
        yaw={alphaArray}/>

      <div className="h-5"></div>

      <AccelerationPlot
        timeStamp={accelTimeStampArray}
        x={accelXArray}
        y={accelYArray}
        z={accelZArray}/>

      
      {!permissionGranted ? (<div onClick={() => {
        (DeviceOrientationEvent as any).requestPermission()
          .then((state: string) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
              window.addEventListener('devicemotion', handleMotion); 
              setPermissionGranted(true);
            }
          })
          .catch(console.error)
      }}
        className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
      >
        Enable Motion Sensing
      </div>) : (null)}
    </main>


  );
}
