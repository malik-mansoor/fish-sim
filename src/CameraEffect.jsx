import { useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";

const easeInOutCubic = (t) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function CameraEffect({ started, darkness, setDarkness }) {
	const { camera } = useThree();

	const [y, setY] = useState(400);
	const [z, setZ] = useState(600);

	const [hasArrived, setHasArrived] = useState(false);
	const [animationProgress, setAnimationProgress] = useState(0);

	useFrame((state, delta) => {
		camera.updateProjectionMatrix();

		camera.position.x = 0 + Math.sin(state.clock.elapsedTime * 0.25) * 15;
		camera.position.y = y + Math.sin(state.clock.elapsedTime * 0.5) * 20;
		camera.position.z = z;
		camera.lookAt(0, 0, 0);

		if (!hasArrived && started) {
			const duration = 10; // Total duration in seconds
			const progress = Math.min(animationProgress + delta / duration, 1);
			setAnimationProgress(progress);

			// Apply easing function to the animation progress
			const easedProgress = easeInOutCubic(progress);

			// Calculate new camera position
			setY(400 * (1 - easedProgress));
			setZ(300 * (1 - easedProgress) + 300);

			// Check if animation has completed
			if (progress >= 1) {
				setHasArrived(true);
			}

			if (camera.position.y < 351 && darkness !== 1) {
				setDarkness(1);
			}
		}
	});

	return null;
}
