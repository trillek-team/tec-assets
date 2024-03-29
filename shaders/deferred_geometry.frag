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

void main() {
	vec4 sparam = texture(mSPMap, TexCoord0);
	float metallic = sparam.r;
	float roughness = sparam.g;
	WorldPosOut = vec4(WorldPos0, metallic);
	DiffuseOut = vec4(texture(mColorMap, TexCoord0).xyz, 0.0);
	NormalOut = vec4(Normal0, roughness);
	EmissionOut = vec4(0.0);
}
