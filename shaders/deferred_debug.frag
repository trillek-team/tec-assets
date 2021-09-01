#version 330

// visualizer for gbuffer layers

uniform sampler2D gPositionMap;
uniform sampler2D gColorMap;
uniform sampler2D gNormalMap;
uniform sampler2D gDepthMap;
uniform sampler2D gEmissionMap;
uniform vec2 gScreenSize;

out vec4 finalColor;

vec2 CalcTexCoord() {
	return gl_FragCoord.xy * gScreenSize;
}

void main() {
	vec2 TexCoord = CalcTexCoord();
	vec4 tWorldPos = texture(gPositionMap, TexCoord);
	vec4 tColor = texture(gColorMap, TexCoord);
	vec4 tNormal = texture(gNormalMap, TexCoord);
	vec4 tEmission = texture(gEmissionMap, TexCoord);
	float Depth = texture(gDepthMap, TexCoord).x;
	vec3 Normal = vec3(0.5) + vec3(0.5) * normalize(tNormal.xyz);

	vec3 DebugColor = tColor.xyz;
	float diag = TexCoord.x - TexCoord.y;
	float diag2 = TexCoord.x + TexCoord.y;
	if (diag < 0.0) {
		DebugColor = vec3(tWorldPos.w, tNormal.w, tColor.w);
	}
	if (TexCoord.x < 0.5) {
		if (TexCoord.y >= 0.5) {
			DebugColor = tWorldPos.xyz * vec3(0.1);
			if (diag2 < 1.0) {
				DebugColor = tEmission.xyz;
			}
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
