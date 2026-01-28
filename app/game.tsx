
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';

import Ground from './game_ground';
import Car from './game_car';
import BoostPad from './game_boostPad';

interface gameProps {
    steerInput: number;
    jumpInput: boolean;
    distance: number;
    gameState: 'notStarted' | 'running' | 'ended';
    updateDistance: (newDistance: number) => void;
    timeRemaining: number;
    // You can add props if needed
}

export default function Game(props: gameProps) {

    const [velocity, setVelocity] = useState(0);

    // store the child mesh here, so that we can intersection test it with other sibling objects in the scene
    const carMesh = useRef<THREE.Mesh>(null!);

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

    useEffect(() => {
        if (props.gameState !== 'running') {
            setVelocity(0);
        } else {
            setVelocity(10);
        }
    }, [props.gameState])

    useFrame((state, delta) => {
        props.updateDistance(props.distance + velocity * delta);
    });

    const incrementVelocity = () => {
        console.log("Boost pad hit! Increasing velocity: ", velocity + 1);
        setVelocity(velocity + 1);
    }

    const decrementVelocity = () => {
        setVelocity(velocity * .9);
    }

    const fogColor = '#f1f1f1';
    const nearDistance = 30;
    const farDistance = 90

    return (
        <>
            <fog attach="fog" args={[fogColor, nearDistance, farDistance]} />

            <Ground />

            <Car meshRef={carMesh} steerInput={props.steerInput} jumping={props.jumpInput} />
            <BoostPad initialX={1} initialZ={0} velocity={velocity} rerenderZThreshold={rerenderZThreshold} onIntersectWithCart={incrementVelocity} furthestZ={furthestZ} carMeshRef={carMesh} />
            <BoostPad initialX={3} initialZ={-50} velocity={velocity} rerenderZThreshold={rerenderZThreshold} onIntersectWithCart={incrementVelocity} furthestZ={furthestZ} carMeshRef={carMesh} />
            <BoostPad initialX={-2} initialZ={-100} velocity={velocity}  deboost={true} rerenderZThreshold={rerenderZThreshold} onIntersectWithCart={decrementVelocity} furthestZ={furthestZ} carMeshRef={carMesh} />
            <BoostPad initialX={-1.5} initialZ={-120} velocity={velocity}  deboost={true} rerenderZThreshold={rerenderZThreshold} onIntersectWithCart={decrementVelocity} furthestZ={furthestZ} carMeshRef={carMesh} />

            <ambientLight intensity={  .4} />

            <directionalLight position={[2, 5, 0]} castShadow={true} intensity={Math.PI / 2} color={"#fffbf3"}>
                <orthographicCamera
                    attach="shadow-camera"
                    args={[-shadowSize, shadowSize, shadowSize, -shadowSize, .1, 10]} // left, right, top, bottom, near, far
                />
            </directionalLight>
        </>)
};