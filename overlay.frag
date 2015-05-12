#version 330 core
in vec3 pass_Color;
out vec4 color;
 
void main(){
    gl_FragCoord.z - (1.0f / 1600000.0);
    color = vec4(0.0,0.0,0.0,1.0);
}
