#version 330

#include <quaternion>

layout(location = 0) in vec3 in_Position;
layout(location = 1) in vec3 in_Norm;
layout(location = 2) in vec2 in_UV;
layout(location = 3) in vec4 in_Color;
layout(location = 4) in vec4 boneWeight;
layout(location = 5) in ivec4 boneIndex;

uniform vec3 model_position;
uniform vec3 model_scale;
uniform vec4 model_quat;
uniform vec3 view_pos;
uniform vec4 view_quat;
uniform mat4 projection;
uniform mat4 animation_matrix[33];
uniform int animated;

out vec2 TexCoord0;
out vec3 Normal0;
out vec3 WorldPos0;
out vec4 Color;

void main(void) {
	vec4 animated_pos = vec4(in_Position, 1.0);
	vec3 animated_norm = in_Norm;
	if (animated == 1) {
		animated_pos  = (animation_matrix[boneIndex.x] * vec4(in_Position, 1.0)) * boneWeight.x;
		animated_norm = (mat3x3(animation_matrix[boneIndex.x]) * in_Norm) * boneWeight.x;
		animated_pos += (animation_matrix[boneIndex.y] * vec4(in_Position, 1.0)) * boneWeight.y;
		animated_norm+= (mat3x3(animation_matrix[boneIndex.y]) * in_Norm) * boneWeight.y;
		animated_pos += (animation_matrix[boneIndex.z] * vec4(in_Position, 1.0)) * boneWeight.z;
		animated_norm+= (mat3x3(animation_matrix[boneIndex.z]) * in_Norm) * boneWeight.z;

		float finalWeight = 1.0f - (boneWeight.x + boneWeight.y + boneWeight.z);
		animated_pos += (animation_matrix[boneIndex.w] * vec4(in_Position, 1.0)) * finalWeight;
		animated_norm+= (mat3x3(animation_matrix[boneIndex.w]) * in_Norm) * finalWeight;
	}

	vec3 world_pos;
	world_pos = model_position + quat_rotate(model_quat, model_scale * animated_pos.xyz);
	vec4 p_pos = projection * vec4(quat_rotate(view_quat, world_pos + view_pos), 1.0);
	gl_Position = p_pos;

	TexCoord0 = in_UV;
	Normal0 = quat_rotate(model_quat, animated_norm);
	WorldPos0 = world_pos;
	Color = in_Color;
}
