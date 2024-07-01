import { useEffect, useMemo, useState } from "react";
import { useProgress } from "@react-three/drei";

export default function Loader({ setStarted, setLoaded }) {
	const { progress } = useProgress();

	const [state, setState] = useState({
		loaded: false,
		showDiveButton: false,
	});

	const handleLoaded = () => {
		setLoaded(true);
		setState({ ...state, loaded: true });

		setTimeout(() => {
			setState((prevState) => ({
				...prevState,
				showDiveButton: true,
			}));
		}, 5000);
	};

	const handleStarted = () => {
		setStarted(true);
	};

	const progressStyle = useMemo(
		() => ({ "--progress": progress / 100 }),
		[progress]
	);

	return (
		<div className={`interface ${state.loaded ? "active" : ""}`}>
			<div>
				{!state.loaded && (
					<div className="loading">
						<div className="loader">
							<div className="circle" style={progressStyle}>
								<div className="wave"></div>
							</div>
							<div className="progress">{Math.round(progress)}%</div>
						</div>
						<button disabled={progress < 100} onClick={handleLoaded}>
							<span>Enter</span>
						</button>
					</div>
				)}
				{state.showDiveButton && (
					<button className="dive" onClick={handleStarted}>
						Dive into the ocean
					</button>
				)}
			</div>
		</div>
	);
}
