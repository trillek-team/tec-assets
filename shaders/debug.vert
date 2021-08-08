#version 330

layout(location = 0) in vec3 in_Position;
layout(location = 1) in vec4 in_Color;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec4 pass_Color;

void main(void) {
	vec4 v_pos = view * (model * vec4(in_Position, 1.0));
	vec4 p_pos = projection * v_pos;
	gl_Position = p_pos;

	pass_Color = in_Color;
}
