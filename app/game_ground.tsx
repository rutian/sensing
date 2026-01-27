export default function Ground() {

  return (
    <mesh
      position={[0, 0, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow={true}
      >
      <planeGeometry args={[8, 500]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
}