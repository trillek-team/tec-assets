#version 330 

layout(location = 0) in vec3 in_Position;
layout(location = 1) in vec4 in_Color;
layout(location = 2) in vec3 in_Norm;
layout(location = 3) in vec2 in_UV;
layout(location = 4) in vec4 boneWeight;
layout(location = 5) in ivec4 boneIndex;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform mat4 animation_matrix[33];
uniform int animated;

out vec2 TexCoord0; 
out vec3 Normal0; 
out vec3 WorldPos0; 
out vec4 Color;

void main(void)
{
    vec4 animated_pos = vec4(in_Position, 1.0);
    vec4 animated_norm =  vec4(in_Norm, 0.0);
    if (animated == 1) {
        animated_pos  = (animation_matrix[boneIndex.x] * vec4(in_Position, 1.0)) * boneWeight.x;
        animated_norm = (mat3x4(animation_matrix[boneIndex.x]) * in_Norm) * boneWeight.x;
        animated_pos += (animation_matrix[boneIndex.y] * vec4(in_Position, 1.0)) * boneWeight.y;
        animated_norm+= (mat3x4(animation_matrix[boneIndex.y]) * in_Norm) * boneWeight.y;
        animated_pos += (animation_matrix[boneIndex.z] * vec4(in_Position, 1.0)) * boneWeight.z;
        animated_norm+= (mat3x4(animation_matrix[boneIndex.z]) * in_Norm) * boneWeight.z;

        float finalWeight = 1.0f - ( boneWeight.x + boneWeight.y + boneWeight.z );
        animated_pos += (animation_matrix[boneIndex.w] * vec4(in_Position, 1.0)) * finalWeight;
        animated_norm+= (mat3x4(animation_matrix[boneIndex.w]) * in_Norm) * finalWeight;
    }
	
    vec4 v_pos;
    v_pos = view * (model * animated_pos);
	vec4 p_pos = projection * v_pos;
	gl_Position = p_pos;
	
	TexCoord0 = in_UV;
	Normal0 = (model * animated_norm).xyz; 
	WorldPos0 = (model * animated_pos).xyz;
	Color = in_Color;
}