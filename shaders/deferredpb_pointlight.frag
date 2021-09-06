#version 330

#include <quaternion>

struct BaseLight {
	vec3 Color;
	float AmbientIntensity;
	float DiffuseIntensity;
};

struct Attenuation {
	float Constant;
	float Linear;
	float Exp;
};

struct PointLight {
	BaseLight Base;
	Attenuation Atten;
};

uniform vec3 view_pos;
uniform vec4 view_quat;
uniform mat4 model;
uniform sampler2D gPositionMap;
uniform sampler2D gColorMap;
uniform sampler2D gNormalMap;
uniform PointLight gPointLight;
uniform vec2 gScreenSize;

#include <BRDF>
#include <BRDF_Point>

out vec4 finalColor;

vec3 PBRPointLight(BRDFParam param, vec3 Color, float roughness, float metallic) {
	//vec3 Luminance = vec3(param.LightAngle);
	float NDF = TrowbridgeReitzGGX_NDF(param, roughness);
	float GMF = Direct_Smith_GMF(param, roughness);
	vec3 FRN = SchlickFresnelBRDF(param, mix(diaelec_FR0, Color, metallic));
	vec3 Specular = vec3(GMF * NDF * FRN) / (4.0 * param.ViewAngle * param.LightAngle);
	vec3 Kd = vec3(1.0) - FRN; // using FRN as the Ks term
	vec3 Diffuse = (Color * Kd) / PI;
	vec3 Luminance = (Diffuse + Specular) * param.LightAngle * gPointLight.Base.Color * gPointLight.Base.DiffuseIntensity;

	float LightAttenuation = param.Distance * param.Distance;
	return Luminance / max(LightAttenuation, 0.5);
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
	finalColor = vec4(PBRPointLight(CalcPointLightParams(WorldPos, Normal), Color, roughness, metallic), 1.0);
}
