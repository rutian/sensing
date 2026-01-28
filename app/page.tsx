"use client";

import { useRef, useState } from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { Canvas } from '@react-three/fiber';

import ParameterSlider from './parameterSlider';
import Game from './game';
import { TelemetryPlot } from './telemetryPlot';

const totalTimePerGameSeconds = 15;

export default function Home() {

  const initialTime = Date.now();

  const [distance, setDistance] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(totalTimePerGameSeconds);
  const [gameState, setGameState] = useState<'notStarted' | 'running' | 'ended'>('notStarted');

  const [isJumping, setIsJumping] = useState(false);
  const [numberOfJumps, setNumberOfJumps] = useState(0);
  const [numberOfPossibleJumps, setNumberOfPossibleJumps] = useState(0);

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
  const jumpThreshold = useRef<number>(3.5);
  const possibleJumpThreshold = 2.0;

  const jumpDebounceTimeMillis = 300;
  let lastJumpTimeMillis = 0;
  let lastPossibleJumpTimeMillis = 0;

  const maxDataPoints = 250;

  const handleMotion = (event: DeviceMotionEvent) => {

    // not a great circular buffer but works for demo purposes
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
    if (filteredValue > jumpThreshold.current) {
      const currentTime = event.timeStamp;
      if (currentTime - lastJumpTimeMillis > jumpDebounceTimeMillis) {
        console.log("Jump detected at time:", currentTime);
        lastJumpTimeMillis = currentTime;
        setNumberOfJumps((prev) => prev + 1);
        setIsJumping(true);
        setTimeout(() => {
          setIsJumping(false);
        }, 100);
      }
    }

    // detect all possible jumps for telemetry
    if (filteredValue > possibleJumpThreshold) {
      const currentTime = event.timeStamp;
      if (currentTime - lastPossibleJumpTimeMillis > jumpDebounceTimeMillis) {
        lastPossibleJumpTimeMillis = currentTime;
        setNumberOfPossibleJumps((prev) => prev + 1);
      }
    }

  }

  const startGame = () => {
    setGameState('running');
    
    // reinitialize our jump counter
    setNumberOfJumps(0);
    setNumberOfPossibleJumps(0);

    intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setGameState('ended');
          return 0;
        }
        return (prevTime - 1);
      })
    }, 1000);
  }

  const handleStartGameButton = () => {
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
      setTimeRemaining(totalTimePerGameSeconds);
      startGame();
    } else if (gameState === 'running') {
      // do nothing
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
    buttonText = "Time's up, replay?";
  }

  return (
    <Box sx={{ p: 0, maxWidth: 800, margin: '0 auto' }}>

      <Box sx={{ position: 'relative', width: '100%', height: '100vh' , maxHeight: 900 }}>
        <Canvas shadows style={{ background: '#f2f2f2', height: '100%', width: '100%' }}>
          <Game jumpInput={isJumping} steerInput={gamma} distance={distance} updateDistance={(val) => setDistance(val)} timeRemaining={timeRemaining} gameState={gameState} />
        </Canvas>
        {(gameState != 'running') ?
          <Button onClick={() => handleStartGameButton()} variant="contained" sx={{ background: '#818584', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '15px' }}>{buttonText}</Button> :
          <></>}
      </Box>

      <Box sx={{ position: 'absolute', top: 15, left: 15, width: '100%', color: '#333' }}>
        <Typography variant="overline" sx={{ lineHeight: '1rem', fontSize: '1rem' }}> Distance Traveled: {distance.toFixed(0)} m </Typography>
        <br></br>
        <Typography variant="overline" sx={{ lineHeight: '1rem' ,fontSize: '1rem' }}> Time Remaining: {timeRemaining.toFixed(0)} seconds </Typography>
      </Box>


      <Box sx={{ pt: 12, pl: 4, pr:4,  maxWidth: 800, margin: '0 auto' }}>

        <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
          Telemetry
        </Typography>

        <Typography variant="h5" gutterBottom sx={{  mb: 0 }}>
          Orientation for steering
        </Typography>

        <TelemetryPlot 
          timeStamp={orientationTimeStampArray}
          label={["Roll"]}
          data={[gammaArray]}
          range={[-90, 90]} />

        <Typography variant="h5" gutterBottom sx={{  mt: 2 }}>
          Acceleration for jump detection
        </Typography>

        <TelemetryPlot
          timeStamp={accelTimeStampArray}
          label={["raw accel", "filtered accel"]}
          data={[accelZArray, accelZFilteredArray]}
          range={[-15, 15]} />

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

        <Typography variant="overline" gutterBottom sx={{ fontSize: '.8rem', mt: 2 }}>
          # of Jumps: {numberOfJumps}
        </Typography>
        <div />
        <Typography variant="overline" gutterBottom sx={{ fontSize: '.8rem', mt: 2 }}>
          # of Possible Jumps: {numberOfPossibleJumps}
        </Typography>
        <div />
        <Typography variant="overline" gutterBottom sx={{ fontSize: '.8rem', mt: 2 }}>
          "Sensitivity": {(numberOfJumps / (numberOfPossibleJumps)).toFixed(1)}
        </Typography>

      </Box>
    </Box>

  );
}
