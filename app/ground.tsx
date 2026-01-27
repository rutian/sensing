export default function Ground() {

  return (
    <mesh
      position={[0, -5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow={true}
      >
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
}