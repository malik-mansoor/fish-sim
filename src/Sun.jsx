import { useLoader, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import vertexShader from "./shaders/sun/vertex.glsl";
import fragmentShader from "./shaders/sun/fragment.glsl";

export default function Sun() {
	const planeMaterial = useRef();

	const [texture] = useLoader(THREE.TextureLoader, ["./textures/noise.jpg"]);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;

	const uniforms = useMemo(() => {
		return {
			uTime: { value: 0 },
			uTexture: { value: texture },
		};
	}, [texture]);

	useFrame(({ clock }) => {
		uniforms.uTime.value = clock.elapsedTime;
	});

	return (
		<mesh position={[-20, 129, 0]} rotation-x={-0.2}>
			<planeGeometry args={[2000, 450]} />
			<shaderMaterial
				ref={planeMaterial}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				transparent
			/>
		</mesh>
	);
}
