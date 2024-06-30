import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function Sand() {
	const [texture, armTexture, displacementTexture, normalTexture] = useLoader(
		THREE.TextureLoader,
		[
			"./textures/sand/sand_03_diff_2k.jpg",
			"./textures/sand/sand_03_arm_2k.jpg",
			"./textures/sand/sand_03_disp_2k.jpg",
			"./textures/sand/sand_03_nor_gl_2k.jpg",
		]
	);

	texture.repeat.set(2, 2);
	armTexture.repeat.set(2, 2);
	displacementTexture.repeat.set(2, 2);
	normalTexture.repeat.set(2, 2);

	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	armTexture.wrapS = THREE.RepeatWrapping;
	armTexture.wrapT = THREE.RepeatWrapping;
	displacementTexture.wrapS = THREE.RepeatWrapping;
	displacementTexture.wrapT = THREE.RepeatWrapping;
	normalTexture.wrapS = THREE.RepeatWrapping;
	normalTexture.wrapT = THREE.RepeatWrapping;

	return (
		<>
			<mesh position-y={-350} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[5000, 2000, 100, 100]} />
				<meshStandardMaterial
					map={texture}
					aoMap={armTexture}
					roughnessMap={armTexture}
					metalnessMap={armTexture}
					displacementMap={displacementTexture}
					normalMap={normalTexture}
					displacementScale={2}
				/>
			</mesh>
		</>
	);
}
