#version 330

struct BaseLight
{
	vec3 Color;
	float AmbientIntensity;
	float DiffuseIntensity;
};

struct Attenuation
{
	float Constant;
	float Linear;
	float Exp;
};

struct PointLight
{
    BaseLight Base;
	Attenuation Atten;
};

uniform mat4 view;
uniform mat4 model;
uniform sampler2D gPositionMap;
uniform sampler2D gColorMap;
uniform sampler2D gNormalMap;
uniform PointLight gPointLight;
uniform vec2 gScreenSize;
float gMatSpecularIntensity = 0.5;
float gSpecularPower = 0.5;

out vec4 finalColor;

vec4 CalcLightInternal(BaseLight Light,
					   vec3 LightDirection,
					   vec3 WorldPos,
					   vec3 Normal)
{
	vec4 AmbientColor = vec4(Light.Color, 1.0f) * Light.AmbientIntensity;
	float DiffuseFactor = dot(Normal, -LightDirection);

	vec4 DiffuseColor  = vec4(0, 0, 0, 0);
	vec4 SpecularColor = vec4(0, 0, 0, 0);

	if (DiffuseFactor > 0) {
		DiffuseColor = vec4(Light.Color, 1.0f) * Light.DiffuseIntensity * DiffuseFactor;

		vec3 VertexToEye = normalize(view[3].xyz - WorldPos);
		vec3 LightReflect = normalize(reflect(LightDirection, Normal));
		float SpecularFactor = dot(VertexToEye, LightReflect);
		SpecularFactor = pow(SpecularFactor, gSpecularPower);
		if (SpecularFactor > 0) {
			SpecularColor = vec4(Light.Color, 1.0f) * gMatSpecularIntensity * SpecularFactor;
		}
	}

	return (AmbientColor + DiffuseColor + SpecularColor);
}

vec4 CalcPointLight(vec3 WorldPos, vec3 Normal)
{
	vec3 LightDirection = WorldPos - model[3].xyz;
	float Distance = length(LightDirection);
	LightDirection = normalize(LightDirection);

	vec4 Color = CalcLightInternal(gPointLight.Base, LightDirection, WorldPos, Normal);

	float LightAttenuation =	gPointLight.Atten.Constant +
								gPointLight.Atten.Linear * Distance +
								gPointLight.Atten.Exp * Distance * Distance;

	LightAttenuation = max(LightAttenuation, 1.0);

	return Color / LightAttenuation;
}


vec2 CalcTexCoord()
{
    return gl_FragCoord.xy / vec2(gScreenSize.x, gScreenSize.y);
}

void main()
{
	vec2 TexCoord = CalcTexCoord();
	vec3 WorldPos = texture(gPositionMap, TexCoord).xyz;
	vec3 Color = texture(gColorMap, TexCoord).xyz;
	vec3 Normal = texture(gNormalMap, TexCoord).xyz;// * 2.0 - 1.0;
	Normal = normalize(Normal);

	finalColor = vec4(Color, 1.0) * CalcPointLight(WorldPos, Normal);
}