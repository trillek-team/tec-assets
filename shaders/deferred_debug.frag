#version 330

// visualizer for gbuffer layers

uniform sampler2D gPositionMap;
uniform sampler2D gColorMap;
uniform sampler2D gNormalMap;
uniform sampler2D gDepthMap;
uniform vec2 gScreenSize;

out vec4 finalColor;

vec2 CalcTexCoord() {
	return gl_FragCoord.xy * gScreenSize;
}

void main() {
	vec2 TexCoord = CalcTexCoord();
	vec3 WorldPos = texture(gPositionMap, TexCoord).xyz;
	vec3 Color = texture(gColorMap, TexCoord).xyz;
	vec3 Normal = texture(gNormalMap, TexCoord).xyz;
	float Depth = texture(gDepthMap, TexCoord).x;
	Normal = vec3(0.5) + vec3(0.5) * normalize(Normal);

	vec3 DebugColor = Color;
	if (TexCoord.x < 0.5) {
		if (TexCoord.y >= 0.5) {
			DebugColor = WorldPos * vec3(0.01);
		}
	}
	else {
		if (TexCoord.y < 0.5) {
			DebugColor = Normal;
		}
		else {
			DebugColor = vec3(sqrt(Depth));
		}
	}
	finalColor = vec4(DebugColor, 1.0);
}
