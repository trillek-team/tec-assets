#version 330

#include <quaternion>

layout(location = 0) in vec3 in_Position;
layout(location = 3) in vec4 in_Color;

uniform vec3 model_position;
uniform vec3 model_scale;
uniform vec4 model_quat;
uniform mat4 view;
uniform mat4 projection;

out vec4 pass_Color;

void main(void) {
	vec3 w_pos = model_position + quat_rotate(model_quat, model_scale * in_Position);
	vec4 v_pos = view * vec4(w_pos, 1.0);
	vec4 p_pos = projection * v_pos;
	gl_Position = p_pos;

	pass_Color = in_Color;
}
