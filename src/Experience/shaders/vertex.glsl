uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;

float PI = 3.1415926535897932384626433832795;

float aastep(float threshold, float value) {
    #ifdef GL_OES_standard_derivatives
	float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
	return smoothstep(threshold - afwidth, threshold + afwidth, value);
    #else
	return step(threshold, value);
    #endif
}

// float stroke(float x, float size, float w) {
// 	float d = aastep(size, x + w * .5) - aastep(size, x - w * .5);
// 	return clamp(d, 0., 1.);
// }
float stroke(float x, float size, float w) {
	float d = smoothstep(size - 0.1, size + 0.1, x + w * .5) - smoothstep(size - 0.1, size + 0.1, x - w * .5);
	// step(size, x - w * .5);
	// aastep(size, x + w * .5) - aastep(size, x - w * .5);
	return clamp(d, 0., 1.);
}

void main() {
	vec3 newposition = position;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(newposition, 1.0);

	vUv = uv;
}