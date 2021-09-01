#version 330

out vec4 FragColor;

struct BaseLight {
	vec3 Color;
	float AmbientIntensity;
	float DiffuseIntensity;
};

struct DirectionalLight {
	BaseLight Base;
	vec3 Direction;
};

uniform sampler2D gPositionMap;
uniform sampler2D gColorMap;
uniform sampler2D gNormalMap;
uniform DirectionalLight gDirectionalLight;
uniform vec2 gScreenSize;
uniform vec3 view_pos;
float gMatSpecularIntensity = 1.0;
float gSpecularPower = 1;

#include <BRDF>
#include <BRDF_Dir>

vec3 SimpleDirLight(BRDFParam param, vec3 Color, float roughness, float metallic) {
	vec3 Ambient = vec3(gDirectionalLight.Base.AmbientIntensity);
	vec3 Specular = BlinnPhongLightBRDF(param, mix(diaelec_FR0, Color, metallic), mix(32, 0.5, roughness));
	vec3 Ks = SchlickFresnelBRDF(param, mix(diaelec_FR0, Color, metallic));
	vec3 Kd = vec3(1.0) - Ks;
	vec3 Diffuse = gDirectionalLight.Base.DiffuseIntensity * param.LightAngle * Kd;
	vec3 Luminance = Color * (Ambient + Diffuse + Specular) * gDirectionalLight.Base.Color;

	return Luminance;
}

vec2 CalcTexCoord() {
	return gl_FragCoord.xy * gScreenSize;
}

void main() {
	vec2 TexCoord = CalcTexCoord();
	vec3 WorldPos = texture(gPositionMap, TexCoord).xyz;
	float metallic = texture(gPositionMap, TexCoord).w;
	vec3 Color = texture(gColorMap, TexCoord).xyz;
	vec3 Normal = normalize(texture(gNormalMap, TexCoord).xyz);
	float roughness = texture(gNormalMap, TexCoord).w;
	FragColor = vec4(SimpleDirLight(CalcDirLightParams(WorldPos, Normal, gDirectionalLight.Direction), Color, roughness, metallic), 1.0);
}
