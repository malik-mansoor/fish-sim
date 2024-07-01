import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

// Custom hook for audio management
function useAudio(src, loop = false) {
	const audioRef = useRef(new Audio(src));

	useEffect(() => {
		const audio = audioRef.current;
		audio.loop = loop;
		return () => {
			audio.pause();
			audio.currentTime = 0; // Reset time
			audio.src = ""; // Clear src to release memory
		};
	}, [src, loop]);

	return audioRef.current;
}

export default function AudioPlayer({ started, loaded }) {
	const { camera } = useThree();

	const underWaterRef = useRef(null);
	const oceanRef = useRef(null);
	const submergeRef = useRef(null);

	const underWaterPlaying = useRef(false);
	const oceanPlaying = useRef(false);
	const submergePlaying = useRef(false);

	useEffect(() => {
		const underwater = new Audio("./sounds/underwater.mp3");
		const ocean = new Audio("./sounds/ocean.mp3");
		const submerge = new Audio("./sounds/submerge.mp3");

		underwater.loop = true;
		ocean.loop = true;
		submerge.loop = false;

		underWaterRef.current = underwater;
		oceanRef.current = ocean;
		submergeRef.current = submerge;

		return () => {
			underwater.pause();
			ocean.pause();
			submerge.pause();
		};
	}, []);

	useFrame(() => {
		if (loaded) {
			if (camera.position.y < 350) {
				if (!underWaterPlaying.current) {
					underWaterRef.current.play();
					underWaterPlaying.current = true;
					oceanRef.current.pause();
					oceanPlaying.current = false;
				}
			} else {
				if (!oceanPlaying.current) {
					oceanRef.current.play();
					oceanPlaying.current = true;
					underWaterRef.current.pause();
					underWaterPlaying.current = false;
				}
			}
			if (camera.position.y < 365 && camera.position.y > 350) {
				if (!submergePlaying.current) {
					submergeRef.current.play();
					submergePlaying.current = true;
				}
			} else {
				submergePlaying.current = false; // Reset so it can play again next time
			}
		}
	});

	return null;
}
