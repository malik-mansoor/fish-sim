import { useFrame, useThree } from "@react-three/fiber";
import React, { useState, useRef } from "react";

export default function Fog() {
	const initialColor = "#87CEEB";
	const { camera } = useThree();
	const [color, setColor] = useState(initialColor);
	const previousColor = useRef(initialColor);

	useFrame(() => {
		const newColor = camera.position.y < 352 ? "#009ec1" : initialColor;
		if (previousColor.current !== newColor) {
			previousColor.current = newColor;
			setColor(newColor);
		}
	});

	return (
		<>
			<fog attach="fog" args={[color, 1, 1200]} />
			<color attach="background" args={[color]} />
		</>
	);
}
