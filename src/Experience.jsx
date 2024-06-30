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
	Bloom,
	ToneMapping,
} from "@react-three/postprocessing";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { ToneMappingMode } from "postprocessing";
import Absorption from "./Absorption";
import AudioPlayer from "./AudioPlayer";

function smoothstep(min, max, value) {
	var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
	return x * x * (3 - 2 * x);
}

const easeInOutCubic = (t) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function Experience({ started, loaded }) {
	const { camera } = useThree();

	const [debug, setDebug] = useState(false);
	const [hasArrived, setHasArrived] = useState(false);
	const [animationProgress, setAnimationProgress] = useState(0);
	const [darkness, setDarkness] = useState(0);

	const [y, setY] = useState(400);
	const [z, setZ] = useState(600);

	useEffect(() => {
		if (window.location.hash.includes("#debug")) {
			setDebug(true);
		}
	}, []);

	useFrame((state, delta) => {
		camera.updateProjectionMatrix();

		camera.position.x = 0 + Math.sin(state.clock.elapsedTime * 0.25) * 15;
		camera.position.y = y + Math.sin(state.clock.elapsedTime * 0.5) * 30;
		camera.position.z = z;

		if (!hasArrived && started) {
			const duration = 10; // Total duration in seconds
			setAnimationProgress((prevProgress) =>
				Math.min(prevProgress + delta / duration, 1)
			);

			// Apply the easing function to the animation progress
			const easedProgress = easeInOutCubic(animationProgress);

			// Calculate and set the new camera position
			setY(400 * (1 - easedProgress));
			setZ(300 * (1 - easedProgress) + 300);

			// Check if the animation has completed
			if (animationProgress >= 1) {
				setHasArrived(true);
			}
		}

		const distanceThreshold = 400;

		const cameraPosition = camera.position.y;

		let darkness = 0;

		if (cameraPosition < 351) {
			darkness =
				0.5 + 0.5 * smoothstep(0, 350, -cameraPosition + distanceThreshold);
		}

		setDarkness(darkness);
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

			<AudioPlayer started={started} loaded={loaded} />
		</>
	);
}
