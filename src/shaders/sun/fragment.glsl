uniform float uTime;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
    vec4 tt = texture(uTexture, vUv);

    vec2 godray = vWorldPosition.xy - vec2(0., 10.);
    float uvDirection = atan(godray.y, godray.x);

    float c = texture2D(uTexture, vec2(uvDirection, 0.) + 0.04 * uTime * 0.5).x;
    float c1 = texture2D(uTexture, vec2(0.1, uvDirection) + 0.04 * uTime * 1.).x;

    float alpha = min(c, c1);

	float fadeX = 1.-smoothstep(0., 7.5, abs(vWorldPosition.x));
	float fadeY = 1.-smoothstep(0., 4., abs(vWorldPosition.y - 2.));
    float fade = fadeY * fadeX;

    gl_FragColor = vec4(0.25, 0.88, 0.82,  alpha * fade);
    // gl_FragColor = vec4(1, 0, 0,  fade);
}