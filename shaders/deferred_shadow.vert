#version 330 core

layout(location = 0) in vec3 in_Position;
layout(location = 4) in vec4 boneWeight;
layout(location = 5) in ivec4 boneIndex;

uniform mat4 model;
uniform mat4 animation_matrix[33];
uniform int animated;
uniform mat4 depthMVP;
 
void main(){
    vec4 animated_pos = vec4(in_Position, 1.0);
    if (animated == 1) {
        animated_pos  = (animation_matrix[boneIndex.x] * vec4(in_Position, 1.0)) * boneWeight.x;
        animated_pos += (animation_matrix[boneIndex.y] * vec4(in_Position, 1.0)) * boneWeight.y;
        animated_pos += (animation_matrix[boneIndex.z] * vec4(in_Position, 1.0)) * boneWeight.z;

        float finalWeight = 1.0f - ( boneWeight.x + boneWeight.y + boneWeight.z );
        animated_pos += (animation_matrix[boneIndex.w] * vec4(in_Position, 1.0)) * finalWeight;
    }
	
 gl_Position =  depthMVP * (model * animated_pos);
}