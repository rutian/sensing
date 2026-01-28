
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface carProps {
    steerInput: number;
    jumping: boolean;
    meshRef: React.Ref<THREE.Mesh>;
}

export default function Car(props: carProps) {

    const steeringInputDeadBand = 2;
    const maxLeftOrRight = 5;

    useFrame((state, delta) => {

        let meshRef = props.meshRef as React.RefObject<THREE.Mesh>;

        if (props.jumping) {
            meshRef.current.position.y += .5;
            if (meshRef.current.position.y > 5) {
                meshRef.current.position.y = 5;
            }
        } else {
            meshRef.current.position.y -= .5;
            if (meshRef.current.position.y < 0.6) {
                meshRef.current.position.y = 0.6;
            }
        }

        if (props.steerInput === undefined) {
            return;
        } else if (Math.abs(props.steerInput) < steeringInputDeadBand) {
            return;
        } else {
            meshRef.current.position.x += props.steerInput * delta / 2;
        }

        // wrap around if the car goes out of bounds
        if (meshRef.current.position.x > maxLeftOrRight) {
            meshRef.current.position.x = -maxLeftOrRight;
        } else if (meshRef.current.position.x < -maxLeftOrRight) {
            meshRef.current.position.x = maxLeftOrRight;
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
        </mesh>
    )
}