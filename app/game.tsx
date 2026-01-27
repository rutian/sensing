
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three'
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import Ground from './ground';


export default function Game() {

    const shadowSize = 15;

    // setup the camera
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(0, 15, 5);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        camera.updateProjectionMatrix();
    }, [camera])

    
    // froggy fog
    const fogColor = '#f7f6f6';
    const nearDistance = 30;
    const farDistance = 50

    return (
        <>
            <fog attach="fog" args={[fogColor, nearDistance, farDistance]} />

            <mesh>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color='#ffb236' />
            </mesh>

            <Ground />
            <ambientLight intensity={0.1} />
            <directionalLight position={[-15, 15, 0]} castShadow={true} intensity={Math.PI}>
                <orthographicCamera
                    attach="shadow-camera"
                    args={[-shadowSize, shadowSize, shadowSize, -shadowSize, 0.1, 50]} // left, right, top, bottom, near, far
                />
            </directionalLight>
        </>)
};