import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
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

	const textures = useMemo(() => {
		const settings = (tex) => {
			tex.repeat.set(2, 2);
			tex.wrapS = THREE.RepeatWrapping;
			tex.wrapT = THREE.RepeatWrapping;
			return tex;
		};

		return [
			settings(texture),
			settings(armTexture),
			settings(displacementTexture),
			settings(normalTexture),
		];
	}, [texture, armTexture, displacementTexture, normalTexture]);

	return (
		<mesh position-y={-350} rotation={[-Math.PI / 2, 0, 0]}>
			<planeGeometry args={[5000, 2000, 100, 100]} />
			<meshStandardMaterial
				map={textures[0]}
				aoMap={textures[1]}
				roughnessMap={textures[1]}
				metalnessMap={textures[1]}
				displacementMap={textures[2]}
				normalMap={textures[3]}
				displacementScale={2}
			/>
		</mesh>
	);
}
