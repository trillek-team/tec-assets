#version 330

uniform sampler2D gColorMap;
uniform sampler2D gNormalMap;
uniform sampler2D gEmissionMap;
uniform sampler2D gDepthMap;
uniform sampler2D gCompositeMap;
uniform vec2 gScreenSize;

out vec4 finalColor;

vec2 CalcTexCoord() {
	return gl_FragCoord.xy * gScreenSize;
}

void main() {
	const float GAMMA = 2.2;
	vec2 TexCoord = CalcTexCoord();

	vec3 cColor = texture(gCompositeMap, TexCoord).xyz;
	vec3 cEmission = texture(gEmissionMap, TexCoord).xyz;

	cColor += cEmission;
	cColor = cColor / (cColor + vec3(1.0));
	cColor = pow(cColor, vec3(1.0 / GAMMA));
	finalColor = vec4(cColor, 1.0);
}
