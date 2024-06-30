import { Canvas } from "@react-three/fiber";
import Experience from "./Experience";
import Loader from "./Loader";

export default function App() {
	return (
		<>
			<Canvas camera={{ position: [0, 0, 200], fov: 75, far: 10000 }}>
				<Experience />
			</Canvas>

			<Loader />
		</>
	);
}
