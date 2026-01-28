
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { useFrame, ThreeElements } from '@react-three/fiber'

interface carProps {
    steerInput: number;
    jumping: boolean;
    meshRef: React.Ref<THREE.Mesh>;
}

export default function Car(props: carProps) {


    const range = 5;

    useFrame((state, delta) => {
        let meshRef = props.meshRef as React.RefObject<THREE.Mesh>;
        meshRef.current.position.x += props.steerInput * delta / 2;

        if (props.jumping) {
            meshRef.current.position.y += .5;
            if (meshRef.current.position.y > 3) {
                meshRef.current.position.y = 3;
            }
        } else {
            meshRef.current.position.y -= .5;
            if (meshRef.current.position.y < 0.6) {
                meshRef.current.position.y = 0.6;
            }
        }

        if (props.steerInput === undefined) {
            return;
        } else if (Math.abs(props.steerInput) < 2) {
            return;
        }



        if (meshRef.current.position.x > range) {
            meshRef.current.position.x = -range;
        } else if (meshRef.current.position.x < -range) {
            meshRef.current.position.x = range;
        }


    });

    return (
        <mesh
            position={[0, .6, 10]}
            ref={props.meshRef}
            castShadow={true}
            receiveShadow={true} >
            <boxGeometry args={[1.5, 1.2, 2]} />
            <meshStandardMaterial color='#ffb845' />
        </mesh>)
}