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
uniform mat3x4 animation_bones[33];
uniform int animated;

out vec2 TexCoord0;
out vec3 Normal0;
out vec3 WorldPos0;
out vec4 Color;

void main(void) {
	vec3 animated_pos = in_Position;
	vec3 animated_norm = in_Norm;
	if (animated == 1) {
		float finalWeight = 1.0f - (boneWeight.x + boneWeight.y + boneWeight.z);
		mat3x4 bonedata = animation_bones[boneIndex.x];
		animated_pos  = boneWeight.x * (bonedata[1].xyz + quat_rotate(bonedata[0], in_Position + bonedata[2].xyz));
		animated_norm = boneWeight.x * quat_rotate(bonedata[0], in_Norm);
		bonedata = animation_bones[boneIndex.y];
		animated_pos += boneWeight.y * (bonedata[1].xyz + quat_rotate(bonedata[0], in_Position + bonedata[2].xyz));
		animated_norm+= boneWeight.y * quat_rotate(bonedata[0], in_Norm);
		bonedata = animation_bones[boneIndex.z];
		animated_pos += boneWeight.z * (bonedata[1].xyz + quat_rotate(bonedata[0], in_Position + bonedata[2].xyz));
		animated_norm+= boneWeight.z * quat_rotate(bonedata[0], in_Norm);
		bonedata = animation_bones[boneIndex.w];
		animated_pos += finalWeight * (bonedata[1].xyz + quat_rotate(bonedata[0], in_Position + bonedata[2].xyz));
		animated_norm+= finalWeight * quat_rotate(bonedata[0], in_Norm);
	}

	vec3 world_pos = model_position + quat_rotate(model_quat, model_scale * animated_pos);
	vec4 p_pos = projection * vec4(quat_rotate(view_quat, world_pos + view_pos), 1.0);
	gl_Position = p_pos;

	TexCoord0 = in_UV;
	Normal0 = quat_rotate(model_quat, animated_norm);
	WorldPos0 = world_pos;
	Color = in_Color;
}
