import { Effect } from "postprocessing";

const fragmentShader = /* glsl */ `
    uniform float darkness;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        float distance = distance(uv, vec2(0.5));

        vec4 color = inputColor;
        // color.rgb *= vec3(0.8, 1.0, 0.5);

        float vignette = pow(smoothstep(0., 1.0, distance), 2.);

        float r = 1. - 0.6 * darkness;
        float g = 1. - 0.4 * darkness;
        
        color.rgb *= (1. - vignette * (0.5 + darkness))  * vec3(r, g, 1.); 

        outputColor = color;
    }
`;

export default class AbsorptionEffect extends Effect {
	constructor({ darkness }) {
		super("AbsorptionEffect", fragmentShader, {
			uniforms: new Map([["darkness", { value: darkness }]]),
		});
	}
}
