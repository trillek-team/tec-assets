#version 330 core

in vec4 pass_Color;

layout (location = 1) out vec3 DiffuseOut;

void main() {
	DiffuseOut = pass_Color.xyz;
}
