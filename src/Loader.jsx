import { useState } from "react";

export default function Loader() {
	const music = new Audio(
		"/sounds/531505__andrewkn__ambient-meditation-in-eternity-loop.wav",
		{ loop: true },
		{ volume: 0.1 }
	);
	const ambience = new Audio(
		"./sounds/408191__170084__underwater-ambience-with-bubbles.wav",
		{ loop: true }
	);

	const [isPlaying, setIsPlaying] = useState(false);

	const playMusic = () => {
		music.play();
		// volume up ambience
		ambience.play();
		setIsPlaying(true);
		console.log("clicked");
	};
	return (
		<>
			{!isPlaying && (
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						color: "white",
						fontSize: "2rem",
						textAlign: "center",
					}}
					onClick={playMusic}
				>
					Enter
				</div>
			)}
		</>
	);
}
