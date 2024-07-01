import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import Loader from "./Loader";
import { useState, Suspense, useEffect } from "react";
import { Leva } from "leva";

export default function App() {
	const [started, setStarted] = useState(false);
	const [loaded, setLoaded] = useState(false);

	const [showLeva, setShowLeva] = useState(false);

	useEffect(() => {
		if (started) {
			setTimeout(() => {
				setShowLeva(true);
			}, 10000);
		}
	}, [started]);

	return (
		<>
			<Canvas camera={{ position: [0, 400, 600], fov: 75, far: 10000 }}>
				<Suspense fallback={null}>
					<Experience started={started} loaded={loaded} />
				</Suspense>
			</Canvas>

			<Leva collapsed hidden={!showLeva} />

			{!started && (
				<Loader setStarted={setStarted} loaded={loaded} setLoaded={setLoaded} />
			)}
		</>
	);
}
