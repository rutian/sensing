
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { useFrame, ThreeElements } from '@react-three/fiber'

interface boostPadProps {
    initialX: number,
    initialZ: number,
    velocity: number,
    rerenderZThreshold: number;
    furthestZ:number;
    carMeshRef: React.Ref<THREE.Mesh>;
    deboost?: boolean;
    updateVelocity: () => void;
}

export default function BoostPad( props: boostPadProps ) {
    
    const meshRef = useRef<THREE.Mesh>(null!)
    const [intersectsCar, setIntersectsCar] = useState(false);

    useFrame((state, delta) => {
        meshRef.current.position.z += props.velocity * delta;

        // put it back to the farthest position when it falls off the screen
        if (meshRef.current.position.z > props.rerenderZThreshold) {
            meshRef.current.position.z = props.furthestZ + (Math.random() - .5) * 20;
            meshRef.current.position.x = (Math.random() - .5) * 2;
        }

        const boostPadBoundingBox = new THREE.Box3().setFromObject(meshRef.current);
        const carBoundingBox = new THREE.Box3().setFromObject((props.carMeshRef as React.RefObject<THREE.Mesh>).current);

        if (boostPadBoundingBox.intersectsBox(carBoundingBox)) {
            setIntersectsCar(true);
            props.updateVelocity();
        } else {
            setIntersectsCar(false);
        }

    });

    const boostColor = intersectsCar ? "#00ff91" : "#a7ffd9";
    const deboostColor = intersectsCar ? "#ff0044" : "#ff7a87";

    return (
        <mesh
            position={[props.initialX, 1, props.initialZ]}
            ref={meshRef}
            rotation={[0, 0, 0]}
            receiveShadow={true}
        >
            <coneGeometry args={[1, 1]} />
            <meshStandardMaterial color={props.deboost ? deboostColor : boostColor} />
        </mesh>
    );
}