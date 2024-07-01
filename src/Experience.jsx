import { Perf } from "r3f-perf";
import Fish from "./Fish";
import Sun from "./Sun";
import Sand from "./Sand";
import Ocean from "./Water";
import Fog from "./Fog";
import { useEffect, useState } from "react";
import {
	EffectComposer,
	Bloom,
	ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import Absorption from "./Absorption";
import AudioPlayer from "./AudioPlayer";
import CameraEffect from "./CameraEffect";

export default function Experience({ started, loaded }) {
	const [debug, setDebug] = useState(false);
	const [darkness, setDarkness] = useState(0);

	useEffect(() => {
		if (window.location.hash.includes("#debug")) {
			setDebug(true);
		}
	}, []);

	return (
		<>
			{/* <Perf position="top-left" /> */}

			<EffectComposer>
				<Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={500} />
				<ToneMapping mode={ToneMappingMode.OPTIMIZED_CINEON} />
				{darkness > 0 && <Absorption darkness={darkness} />}
			</EffectComposer>

			<color attach="background" args={["#007590"]} />

			<ambientLight intensity={8} />

			<Fog />

			<Fish />

			<Sun />

			<Ocean />

			<Sand />

			<AudioPlayer started={started} loaded={loaded} />
			<CameraEffect
				started={started}
				darkness={darkness}
				setDarkness={setDarkness}
			/>
		</>
	);
}
