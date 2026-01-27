"use client";

import { useEffect, useState } from "react";
import { orientationPlot } from "./orientationPlot";

export default function Home() {

  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);
  const [timeStamp, setTimeStamp] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const timeStampArray: number[] = [];
  const alphaArray: number[] = [];
  const betaArray: number[] = [];
  const gammaArray: number[] = [];
  const maxDataPoints = 1000;
  const arrayIndex = 0;

  const handleOrientation = (event: DeviceOrientationEvent) => {
    setAlpha(event.alpha || 0);
    setBeta(event.beta || 0);
    setGamma(event.gamma || 0);
    setTimeStamp(event.timeStamp);

    if (timeStampArray.length >= maxDataPoints) {
      timeStampArray.shift();
      alphaArray.shift();
      betaArray.shift();
      gammaArray.shift();
    }

    timeStampArray.push(event.timeStamp/1000);
    alphaArray.push(event.alpha || 0);
    betaArray.push(event.beta || 0);
    gammaArray.push(event.gamma || 0);
  }

  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Roll: {gamma.toFixed(0)}  Pitch: {beta.toFixed(0)}
      </h1>
      {orientationPlot({timeStamp: timeStampArray, pitch: betaArray, roll: gammaArray, yaw: alphaArray})}
      {!permissionGranted ? (<div onClick={() => {
        (DeviceOrientationEvent as any).requestPermission()
          .then((state: string) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
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
