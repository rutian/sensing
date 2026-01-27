
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three'
import { useEffect, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

import Ground from './game_ground';
import Car from './game_car';
import BoostPad from './game_boostPad';

interface gameProps {
    steerInput: number;
    distance: number;
    gameState: 'notStarted' | 'running' | 'ended';
    updateDistance: (newDistance: number) => void;
    timeRemaining: number;
    // You can add props if needed
}
export default function Game(props: gameProps) {

    const [velocity, setVelocity] = useState(0);

    const rerenderZThreshold = 20;
    const shadowSize = 20;
    const furthestZ = -100;


    // setup the camera
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(0, 10, 15);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix();
    }, [camera])

    useFrame((state, delta) => {
        props.updateDistance(props.distance + velocity * delta);
        if (props.gameState !== 'running') {
            setVelocity(0);
        } else {
            setVelocity(10);
        }
    });

    const fogColor = '#f1f1f1';
    const nearDistance = 30;
    const farDistance = 90

    return (
        <>
            <fog attach="fog" args={[fogColor, nearDistance, farDistance]} />
            <Car steerInput={props.steerInput} />

            <Ground />

            <BoostPad initialX={1} initialZ={0} velocity={velocity} rerenderZThreshold={rerenderZThreshold} updateVelocity={function (newVelocity: number): void {
                throw new Error('Function not implemented.');
            }} furthestZ={furthestZ} />

            <BoostPad initialX={3} initialZ={-50} velocity={velocity} rerenderZThreshold={rerenderZThreshold} updateVelocity={function (newVelocity: number): void {
                throw new Error('Function not implemented.');
            }} furthestZ={furthestZ} />

            <BoostPad initialX={-2} initialZ={-100} velocity={velocity} rerenderZThreshold={rerenderZThreshold} updateVelocity={function (newVelocity: number): void {
                throw new Error('Function not implemented.');
            }} furthestZ={furthestZ} />



            <ambientLight intensity={0.4} />

            <directionalLight position={[2, 5, 0]} castShadow={true} intensity={Math.PI / 2} color={"#fffbf3"}>
                <orthographicCamera
                    attach="shadow-camera"
                    args={[-shadowSize, shadowSize, shadowSize, -shadowSize, .1, 10]} // left, right, top, bottom, near, far
                />
            </directionalLight>
        </>)
};