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

vec3 SimplePointLight(BRDFParam param, vec3 Color, float roughness, float metallic) {
	vec3 Ambient = vec3(gPointLight.Base.AmbientIntensity);
	vec3 Specular = BlinnPhongLightBRDF(param, mix(vec3(1.0), Color, metallic), mix(32, 0.5, roughness));
	vec3 Ks = SchlickFresnelBRDF(param, mix(diaelec_FR0, Color, metallic));
	vec3 Kd = vec3(1.0) - Ks;
	vec3 Diffuse = gPointLight.Base.DiffuseIntensity * param.LightAngle * Kd;
	vec3 Luminance = Color * (Ambient + Diffuse + Specular) * gPointLight.Base.Color;

	float LightAttenuation =
			gPointLight.Atten.Constant +
			gPointLight.Atten.Linear * param.Distance +
			gPointLight.Atten.Exp * param.Distance * param.Distance;
	return Luminance / max(LightAttenuation, 1.0);
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
	finalColor = vec4(SimplePointLight(CalcPointLightParams(WorldPos, Normal), Color, roughness, metallic), 1.0);
}
