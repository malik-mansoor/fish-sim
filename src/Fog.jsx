import { useFrame, useThree } from "@react-three/fiber";
import React, { useState } from "react";

export default function Fog() {
	// const color = "#009ec1";
	const [color, setColor] = useState("#87CEEB");

	const { camera } = useThree();

	useFrame(() => {
		if (camera.position.y < 350) {
			setColor("#009ec1");
		}
	});

	return (
		<>
			<fog attach="fog" args={[color, 1, 1200]} />
			<color attach="background" args={[color]} />
		</>
	);
}
