#version 330 core
in vec4 pass_Color;
in vec2 pass_UV;
out vec4 color;
uniform sampler2D tex;
 
void main(){
	if (textureSize(tex, 0).x > 0) {
		color = texture2D(tex, pass_UV);
	}
	else {
		color = pass_Color;
	}
}
