#version 330

in vec4 ShadowCoord; 
out vec4 finalColor;

struct BaseLight
{
	vec3 Color;
	float AmbientIntensity;
	float DiffuseIntensity;
};

struct DirectionalLight
{
	BaseLight Base;
	vec3 Direction;
};

uniform mat4 DepthBiasMVP;
uniform mat4 gCameraPos;
uniform sampler2D gPositionMap;
uniform sampler2D gColorMap;
uniform sampler2D gNormalMap;
uniform sampler2D gShadowMap;
uniform DirectionalLight gDirectionalLight;
uniform vec2 gScreenSize;
uniform vec3 gEyeWorldPos;
float gMatSpecularIntensity = 1.0;
float gSpecularPower = 32;

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

        vec3 VertexToEye = normalize(gEyeWorldPos - WorldPos);
        vec3 LightReflect = normalize(reflect(LightDirection, Normal));
        float SpecularFactor = dot(VertexToEye, LightReflect);
        SpecularFactor = pow(SpecularFactor, gSpecularPower);
        if (SpecularFactor > 0) {
            SpecularColor = vec4(Light.Color, 1.0f) * gMatSpecularIntensity * SpecularFactor;
        }
    }

    return (AmbientColor + DiffuseColor + SpecularColor);
}

vec4 CalcDirectionalLight(vec3 WorldPos, vec3 Normal)
{
    return CalcLightInternal(gDirectionalLight.Base,
							 gDirectionalLight.Direction,
							 WorldPos,
							 Normal);
}


vec2 CalcTexCoord()
{
    return gl_FragCoord.xy / gScreenSize;
}

void main()
{
	vec2 TexCoord = CalcTexCoord();
	vec3 WorldPos = texture(gPositionMap, TexCoord).xyz;
	vec3 Color = texture(gColorMap, TexCoord).xyz;
	vec3 Normal = texture(gNormalMap, TexCoord).xyz * 2.0 - 1.0;
	float visibility = 1.0;
	
	vec4 projectedEyeDir = DepthBiasMVP * vec4(WorldPos, 1.0);
	vec3 Shadow = texture(gShadowMap, projectedEyeDir.xy).xyz;
	if ( Shadow.z < (ShadowCoord.z - 0.0001)){
		visibility = 0.5;
	}
	
	finalColor = vec4(Color, 1.0) * CalcDirectionalLight(WorldPos, Normal) * visibility;
}