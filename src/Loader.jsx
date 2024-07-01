import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

export default function Loader({ started, setStarted, loaded, setLoaded }) {
	const { progress } = useProgress();

	const [showDiveButton, setShowDiveButton] = useState(false);

	const handleLoaded = () => {
		setLoaded(true);

		setTimeout(() => {
			setShowDiveButton(true);
		}, 6000);
	};

	const handleStarted = () => {
		setStarted(true);
	};

	useEffect(() => {
		console.log(progress);
	}, [progress]);

	return (
		<>
			{!started && (
				// classname active if loaded
				<div className={`interface ${loaded ? "active" : ""}`}>
					<div>
						{!loaded && (
							<div className="loading">
								<div className="loader">
									<div
										className="circle"
										style={{
											"--progress": progress / 100,
										}}
									>
										<div className="wave"></div>
									</div>
									<div className="progress">{Math.round(progress)}%</div>
								</div>
								<button disabled={progress < 100} onClick={handleLoaded}>
									<span>Enter</span>
								</button>
							</div>
						)}
						{showDiveButton && (
							<button className="dive" onClick={handleStarted}>
								Dive into the ocean
							</button>
						)}
					</div>
				</div>
			)}
		</>
	);
}
