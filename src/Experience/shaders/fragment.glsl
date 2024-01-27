uniform float uTime;

uniform vec3 uColor;
uniform vec3 uColorStart;
uniform float uColorProgress;

uniform float uOpacity;

varying vec2 vUv;

float PI = 3.1415926535897932384626433832795;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
	uv -= disc_center;
	float dist = sqrt(dot(uv, uv));
	return smoothstep(disc_radius + border_size, disc_radius - border_size, dist);
}

float aastep(float threshold, float value) {
    #ifdef GL_OES_standard_derivatives
	float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
	return smoothstep(threshold - afwidth, threshold + afwidth, value);
    #else
	return step(threshold, value);
    #endif
}

float stroke(float x, float size, float w) {
	float d = smoothstep(size - 0.1, size + 0.1, x + w * .5) - smoothstep(size - 0.1, size + 0.1, x - w * .5);
	// step(size, x - w * .5);
	// aastep(size, x + w * .5) - aastep(size, x - w * .5);
	return clamp(d, 0., 1.);
}

void main() {
	vec3 red = vec3(1.0, 0.0, 0.0);
	vec3 green = vec3(0.0, 1.0, 0.0);

	// Line
	float line = stroke(vUv.x, 0.5, 1.);

	// Progress y axis
	float progress = sin(uTime * 0.0005);
	float progressY = stroke(vUv.y, 0.5 + (progress * 0.5), .2);

	// Final
	// colorFinal = mix(red, green, progressY);

	float alpha = mix(0.1, 1.0, 1.);

	vec3 colorFinal = mix(uColorStart, uColor, uColorProgress);

	gl_FragColor = vec4(colorFinal, uOpacity);
}