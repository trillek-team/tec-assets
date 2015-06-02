#version 330 
layout(location = 0) in vec3 in_Position;
layout(location = 1) in vec4 in_Color;
layout(location = 2) in vec2 in_UV;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
out vec4 pass_Color;
out vec2 pass_UV;
void main(void)
{
mat4 mvp = projection * view * model;
gl_Position = mvp * vec4(in_Position, 1.0);
pass_Color = in_Color;
pass_UV = in_UV;
}
