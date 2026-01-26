"use client";

import { useEffect, useState } from "react";

export default function Home() {

  const [alpha, setAlpha] = useState(0);
  const [beta, setBeta] = useState(0);
  const [gamma, setGamma] = useState(0);

  const handleOrientation = (event: DeviceOrientationEvent) => {
    setAlpha(event.alpha || 0);
    setBeta(event.beta || 0);
    setGamma(event.gamma || 0);
  }

  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        Yaw: {alpha.toFixed(0)}  Roll: {gamma.toFixed(0)}  Pitch: {beta.toFixed(0)}
      </h1>
      <div onClick={() => {

        (DeviceOrientationEvent as any).requestPermission()
          .then((state: string) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          })
          .catch(console.error)
      }}
        className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
      >
        Enable Motion
      </div>
    </main>


  );
}
