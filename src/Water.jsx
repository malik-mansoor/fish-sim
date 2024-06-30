import { useLoader, useFrame, extend, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Water } from "three-stdlib";

extend({ Water });

export default function Ocean() {
	const ref = useRef();
	const gl = useThree((state) => state.gl);

	const waterNormals = useLoader(
		THREE.TextureLoader,
		"./textures/waternormals.jpeg"
	);
	waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

	const geom = useMemo(() => new THREE.PlaneGeometry(10000, 10000), []);

	const config = useMemo(
		() => ({
			textureWidth: 512,
			textureHeight: 512,
			waterNormals,
			sunDirection: new THREE.Vector3(),
			sunColor: 0x87ceeb,
			waterColor: 0x009ec1,
			distortionScale: 3.7,
			fog: true,
			format: gl.encoding,
			side: THREE.DoubleSide,
		}),
		[waterNormals]
	);

	useFrame(
		(state, delta) => (ref.current.material.uniforms.time.value += delta)
	);

	return (
		<water
			position={[0, 350, -100]}
			ref={ref}
			args={[geom, config]}
			rotation-x={-Math.PI / 2}
		/>
	);
}
