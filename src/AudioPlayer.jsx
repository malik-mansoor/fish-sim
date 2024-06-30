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

	const underwater = useAudio("./sounds/underwater.mp3", true);
	const ocean = useAudio("./sounds/ocean.mp3", true);
	const submerge = useAudio("./sounds/submerge.mp3");

	const underWaterPlaying = useRef(false);
	const oceanPlaying = useRef(false);
	const submergePlaying = useRef(false);

	useFrame(() => {
		if (loaded) {
			if (camera.position.y < 350) {
				if (!underWaterPlaying.current) {
					underwater.current.play();
					underWaterPlaying.current = true;
					ocean.current.pause();
					oceanPlaying.current = false;
				}
			} else {
				if (!oceanPlaying.current) {
					ocean.current.play();
					oceanPlaying.current = true;
					underwater.current.pause();
					underWaterPlaying.current = false;
				}
			}
			if (camera.position.y < 365 && camera.position.y > 350) {
				if (!submergePlaying.current) {
					submerge.current.play();
					submergePlaying.current = true;
				}
			} else {
				submergePlaying.current = false;
			}
		}
	});

	return null;
}
