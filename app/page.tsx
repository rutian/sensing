"use client";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { useRef, useState } from "react";
import OrientationPlot from "./orientationPlot";
import AccelerationPlot from "./accelerationPlot";
import ParameterSlider from './parameterSlider';
import { Box } from '@mui/material';
import Game from './game';
import { Canvas } from '@react-three/fiber';

const gameTimeSeconds = 10;

export default function Home() {

  const initialTime = Date.now();

  const [distance, setDistance] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(gameTimeSeconds);
  const [gameState, setGameState] = useState<'notStarted' | 'running' | 'ended'>('notStarted');

  let intervalId: NodeJS.Timeout;

  const [deviceOrientationPermissionGranted, setDeviceOrientationPermissionGranted] = useState(false);

  const orientationTimeStampArray: number[] = [];
  const betaArray: number[] = [];
  const gammaArray: number[] = [];
  const [gamma, setGamma] = useState(0);

  const accelTimeStampArray: number[] = [];
  const accelZArray: number[] = [];
  const accelZFilteredArray: number[] = [];

  const lowPassAlpha = useRef<number>(0.2);
  const jumpThreshold = useRef<number>(3.0);

  let jumpDebounceTimeMillis = 300; 
  let lastJumpTimeMillis = 0;

  const maxDataPoints = 250;

  const handleMotion = (event: DeviceMotionEvent) => {

    if (accelTimeStampArray.length >= maxDataPoints) {
      accelTimeStampArray.shift();
      accelZArray.shift();
      accelZFilteredArray.shift();
    }

    // raw data
    accelZArray.push(event.acceleration?.z || 0);

    // filtered data
    let filteredValue = (lowPassAlpha.current * (event.acceleration?.z || 0)) +
      ((1 - lowPassAlpha.current) * (accelZFilteredArray.length > 0 ? accelZFilteredArray[accelZFilteredArray.length - 1] : 0));

    accelZFilteredArray.push(filteredValue);
    
    // time stamp
    accelTimeStampArray.push((event.timeStamp + initialTime) / 1000);

    // jump detection
    if (Math.abs(filteredValue) > jumpThreshold.current) {
      const currentTime = event.timeStamp;
      if (currentTime - lastJumpTimeMillis > jumpDebounceTimeMillis) {
        console.log("Jump detected at time:", currentTime);
        lastJumpTimeMillis = currentTime;

      }
    }
  }

  const startGame = () => {
    setGameState('running');
    intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setGameState('ended');
          return 0;
        }
        return(prevTime - 1);

      } )
    }, 1000);
  }

  const requestOrientationPermission = () => {
    if (gameState === 'notStarted') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((state: string) => {
          if (state === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
            window.addEventListener('devicemotion', handleMotion);
            setDeviceOrientationPermissionGranted(true);
            startGame();
          }
        })
        .catch(console.error)
    } else if (gameState === 'ended') {
      setDistance(0);
      setTimeRemaining(gameTimeSeconds);
       startGame();
    } else if (gameState === 'running') {
    }

  }

  const handleOrientation = (event: DeviceOrientationEvent) => {

    setGamma(event.gamma || 0);

    if (orientationTimeStampArray.length >= maxDataPoints) {
      orientationTimeStampArray.shift();
      betaArray.shift();
      gammaArray.shift();
    }

    orientationTimeStampArray.push((event.timeStamp + initialTime) / 1000);
    betaArray.push(event.beta || 0);
    gammaArray.push(event.gamma || 0);
  }


  let buttonText = "";
  if (gameState === 'notStarted') {
    buttonText = "Enable Motion Sensing To Start";
  } else if (gameState === 'running') {
    buttonText = "Game in Progress...";
  } else if (gameState === 'ended') {
    buttonText = "Game Over, replay?";
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>

      <Canvas shadows style={{ background: '#f2f2f2', height: '550px', width: '100%' }}>
        <Game steerInput={gamma} distance={distance} updateDistance={(val) => setDistance(val)} timeRemaining={timeRemaining} gameState={gameState} />
      </Canvas>
      
      <div className="h-8"></div>
      <Button onClick={()=>requestOrientationPermission()} variant="outlined" sx={{ borderRadius: '20px', display: 'block', margin: '0 auto' }}>{buttonText}</Button>

    
      <Box sx={{ position: 'absolute', top: 15, left: 15, width: '100%',  color: '#333' }}>
        <Typography variant="overline" sx={{fontSize: '1rem'}}> Distance Traveled: {distance.toFixed(0)} m </Typography>
        <div></div>
        <Typography variant="overline" sx={{fontSize: '1rem'}}> Time Remaining: {timeRemaining.toFixed(0)} seconds </Typography>
      </Box>
    
      <Typography variant="h4" gutterBottom>
        Telemetry
      </Typography>

      <div className="h-8"></div>
      
      {/* <OrientationPlot
        timeStamp={orientationTimeStampArray}
        pitch={betaArray}
        roll={gammaArray}
        /> */}

      <div className="h-8"></div>
{/* 
      <AccelerationPlot
        timeStamp={accelTimeStampArray}
        z={accelZArray}
        filteredZ={accelZFilteredArray}/> */}

      <div className="h-8"></div>
      
      <Typography variant="h4"  sx={{ mt: 4 }}>
        Tunable Parameters
      </Typography>

      <ParameterSlider initialValue={lowPassAlpha.current}
        min={0} max={1}
        label='Low-pass filter alpha'
        onChange={(value) => {
          console.log("Setting lowPassAlpha to ", value);
          lowPassAlpha.current = value;
        }} />
      
      <ParameterSlider initialValue={jumpThreshold.current}
        min={0} max={20}
        label='Jump Detection Threshold (m/s²)'
        onChange={(value) => {
          console.log("Setting jumpThreshold to ", value);
          jumpThreshold.current = value;
        }} />


    </Box>


  );
}
