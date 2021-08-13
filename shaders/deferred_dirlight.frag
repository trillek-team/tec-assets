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

vec4 CalcLightInternal(BaseLight Light, vec3 LightDirection, vec3 WorldPos, vec3 Normal) {
	vec4 AmbientColor = vec4(Light.Color * Light.AmbientIntensity, 1.0);
	float DiffuseFactor = dot(Normal, -LightDirection);

	vec4 DiffuseColor  = vec4(0, 0, 0, 0);
	vec4 SpecularColor = vec4(0, 0, 0, 0);

	if (DiffuseFactor > 0.0) {
		DiffuseColor = vec4(Light.Color * Light.DiffuseIntensity * DiffuseFactor, 1.0);

		vec3 VertexToEye = normalize(-view_pos - WorldPos);
		vec3 LightReflect = normalize(reflect(LightDirection, Normal));
		float SpecularFactor = dot(VertexToEye, LightReflect);
		if (SpecularFactor > 0.0) {
			SpecularFactor = pow(SpecularFactor, gSpecularPower);
			SpecularColor = vec4(Light.Color * gMatSpecularIntensity * SpecularFactor, 1.0);
		}
	}

	return (AmbientColor + DiffuseColor + SpecularColor);
}

vec4 CalcDirectionalLight(vec3 WorldPos, vec3 Normal) {
	return CalcLightInternal(
			gDirectionalLight.Base,
			gDirectionalLight.Direction,
			WorldPos,
			Normal);
}

vec2 CalcTexCoord() {
	return gl_FragCoord.xy * gScreenSize;
}

void main() {
	vec2 TexCoord = CalcTexCoord();
	vec3 WorldPos = texture(gPositionMap, TexCoord).xyz;
	vec3 Color = texture(gColorMap, TexCoord).xyz;
	vec3 Normal = texture(gNormalMap, TexCoord).xyz;
	Normal = normalize(Normal);

	FragColor = vec4(Color, 1.0) * CalcDirectionalLight(WorldPos, Normal);
}
