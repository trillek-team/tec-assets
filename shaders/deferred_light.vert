#version 330

#include <quaternion>

layout (location = 0) in vec3 in_Position;

uniform mat4 model;
uniform vec3 view_pos;
uniform vec4 view_quat;
uniform mat4 projection;

void main() {
	gl_Position = projection * vec4(quat_rotate(view_quat, view_pos + (model * vec4(in_Position, 1.0)).xyz), 1.0);
}
