
import * as THREE from 'three'
import { useRef, useState } from 'react'
import {useFrame, ThreeElements } from '@react-three/fiber'

interface carProps { 
    steerInput: number;
}

export default function Car(props: carProps) {

    const meshRef = useRef<THREE.Mesh>(null!)

    useFrame((state, delta) => {

        if (props.steerInput === undefined) {
            return;
        } else if (Math.abs(props.steerInput) < 2) {
            return;
        }

        meshRef.current.position.x += props.steerInput * delta/2;
    });

    return (
        <mesh
            position={[0,.6,10]}
            ref={meshRef}
            castShadow={true}
            receiveShadow={true} >
            <boxGeometry args={[1.5, 1.2, 2]} />
            <meshStandardMaterial color='#ffb845' />
        </mesh>)
}