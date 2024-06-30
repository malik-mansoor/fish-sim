import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

export default function Loader({ started, setStarted, loaded, setLoaded }) {
	const { progress } = useProgress();

	const handleLoaded = () => {
		setLoaded(true);
	};

	const handleStarted = () => {
		setStarted(true);
	};

	return (
		<>
			{!started && (
				<div
					style={{
						position: "absolute",
						fontSize: "2rem",
						textAlign: "center",
						color: "red",
						//backgorun dcolor black if not started else white
						backgroundColor: loaded ? "transparent" : "black",
						top: 0,
						left: 0,
						height: "100vh",
						width: "100vw",
						display: "flex",
						justifyContent: "center",
						transition: "background-color 1s",
					}}
				>
					<div>
						{progress === 100 && !loaded && (
							<>
								<button onClick={handleLoaded}>Click to start</button>
								{progress}%
							</>
						)}
						{loaded && (
							<button onClick={handleStarted}>Dive into the ocean</button>
						)}
					</div>
				</div>
			)}
		</>
	);
}
