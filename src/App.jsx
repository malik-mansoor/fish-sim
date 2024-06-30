import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import Loader from "./Loader";
import { useState, Suspense } from "react";

export default function App() {
	const [started, setStarted] = useState(false);
	const [loaded, setLoaded] = useState(false);

	return (
		<>
			<Canvas camera={{ position: [0, 0, 200], fov: 75, far: 10000 }}>
				<Suspense>
					<Experience started={started} loaded={loaded} />
				</Suspense>
			</Canvas>

			<Loader
				started={started}
				setStarted={setStarted}
				loaded={loaded}
				setLoaded={setLoaded}
			/>
		</>
	);
}
