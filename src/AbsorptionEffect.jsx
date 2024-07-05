import { Effect } from "postprocessing";
import fragmentShader from "./shaders/absorption/fragment.glsl";

export default class AbsorptionEffect extends Effect {
	constructor({ darkness }) {
		super("AbsorptionEffect", fragmentShader, {
			uniforms: new Map([["darkness", { value: darkness }]]),
		});
	}
}
