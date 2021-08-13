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
	vec2 TexCoord = CalcTexCoord();

	vec3 cColor = texture(gCompositeMap, TexCoord).xyz;
	vec3 cEmission = texture(gEmissionMap, TexCoord).xyz;

	finalColor = vec4(cColor + cEmission, 1.0);
}
