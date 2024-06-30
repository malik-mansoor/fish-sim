import { Perf } from "r3f-perf";
// import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import Fish from "./Fish";
import Sun from "./Sun";
import Sand from "./Sand";
import Ocean from "./Water";
import Fog from "./Fog";
import {
	EffectComposer,
	Vignette,
	Bloom,
	ToneMapping,
} from "@react-three/postprocessing";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import Absorption from "./Absorption";

function smoothstep(min, max, value) {
	// Clamp value between 0 and 1
	var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
	// Smooth interpolation function
	return x * x * (3 - 2 * x);
}

export default function Experience() {
	const { camera } = useThree();
	const vignetteRef = useRef();

	const [debug, setDebug] = useState(false);
	const [hasArrived, setHasArrived] = useState(false);
	const [animationProgress, setAnimationProgress] = useState(0);
	const [darkness, setDarkness] = useState(0);

	useEffect(() => {
		camera.position.y = 400;
		camera.position.z = 350;

		if (window.location.hash.includes("#debug")) {
			setDebug(true);
		}
	}, []);

	// Cubic Bezier function for ease-in and ease-out
	// This specific curve starts slow, accelerates, and then slows down towards the end
	const easeInOutCubic = (t) =>
		t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

	useFrame((state, delta) => {
		camera.updateProjectionMatrix();

		if (!hasArrived) {
			const duration = 10; // Total duration in seconds
			setAnimationProgress((prevProgress) =>
				Math.min(prevProgress + delta / duration, 1)
			);

			// Apply the easing function to the animation progress
			const easedProgress = easeInOutCubic(animationProgress);

			// Calculate and set the new camera position
			camera.position.x = 0 + Math.sin(state.clock.elapsedTime * 0.5) * 15;
			camera.position.y =
				400 * (1 - easedProgress) + Math.sin(state.clock.elapsedTime * 1) * 30;
			camera.position.z = 350 * (1 - easedProgress) + 300;

			// Check if the animation has completed
			if (animationProgress >= 1) {
				setHasArrived(true);
			}
		} else {
			// Once arrived, move the camera up and down using a sine function
			camera.position.x = 0 + Math.sin(state.clock.elapsedTime * 0.5) * 15;
			camera.position.y = 0 + Math.sin(state.clock.elapsedTime * 1) * 30;
		}

		const distanceThreshold = 400;

		const cameraPosition = camera.position.y;

		let darkness = 0;

		if (cameraPosition < 350) {
			darkness =
				0.5 + 0.5 * smoothstep(0, 350, -cameraPosition + distanceThreshold);
		}

		setDarkness(darkness);
		console.log(darkness);

		if (vignetteRef.current) {
			vignetteRef.current.darkness = darkness;
		}
	});

	return (
		<>
			{debug && <Perf position="top-left" />}

			<OrbitControls />

			<EffectComposer>
				<Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={500} />
				<ToneMapping mode={ToneMappingMode.OPTIMIZED_CINEON} />
				{darkness > 0 && <Absorption darkness={darkness} />}
			</EffectComposer>

			<color attach="background" args={["#007590"]} />

			<ambientLight intensity={5} />

			<Fog />

			<Fish />

			{/* <Sparkles size={5} scale={[200, 200, 200]} speed={20} count={200} /> */}

			<Sun />

			<Ocean />

			<Sand />
		</>
	);
}
