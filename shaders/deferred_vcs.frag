#version 330

in vec2 TexCoord0;
in vec3 Normal0;
in vec3 WorldPos0;
in vec4 Color;

layout (location = 0) out vec4 WorldPosOut;
layout (location = 1) out vec4 DiffuseOut;
layout (location = 2) out vec4 NormalOut;
layout (location = 3) out vec4 EmissionOut;

uniform sampler2D mColorMap;
uniform sampler2D mSPMap;
uniform int vertex_group;

void main() {
	vec3 fColor = texture(mColorMap, TexCoord0).xyz;
	vec4 sparam = texture(mSPMap, TexCoord0);
	float metallic = 0.0;
	float roughness = 0.2;
	if(vertex_group == 0) {
		DiffuseOut = vec4(0.01, 0.01, 0.02, 0.0);
		EmissionOut = vec4(fColor * vec3(0.8), 0.0);
	}
	else {
		metallic = 1.0;
		roughness = 0.27;
		DiffuseOut = vec4(fColor, 0.0);
		EmissionOut = vec4(0.0);
	}
	WorldPosOut = vec4(WorldPos0, metallic);
	NormalOut = vec4(Normal0, roughness);
}
