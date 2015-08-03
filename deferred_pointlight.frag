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

vec3 ExtractCameraPos(mat4 a_modelView)
{
  // Get the 3 basis vector planes at the camera origin and transform them into model space.
  //  
  // NOTE: Planes have to be transformed by the inverse transpose of a matrix
  //       Nice reference here: http://www.opengl.org/discussion_boards/showthread.php/159564-Clever-way-to-transform-plane-by-matrix
  //
  //       So for a transform to model space we need to do:
  //            inverse(transpose(inverse(MV)))
  //       This equals : transpose(MV) - see Lemma 5 in http://mathrefresher.blogspot.com.au/2007/06/transpose-of-matrix.html
  //
  // As each plane is simply (1,0,0,0), (0,1,0,0), (0,0,1,0) we can pull the data directly from the transpose matrix.
  //  
  mat4 modelViewT = transpose(a_modelView);
 
  // Get plane normals 
  vec3 n1 = modelViewT[0].xyz;
  vec3 n2 = modelViewT[1].xyz;
  vec3 n3 = modelViewT[2].xyz;
 
  // Get plane distances
  float d1 = modelViewT[0].w;
  float d2 = modelViewT[1].w;
  float d3 = modelViewT[2].w;
 
  // Get the intersection of these 3 planes
  // http://paulbourke.net/geometry/3planes/
  vec3 n2n3 = cross(n2, n3);
  vec3 n3n1 = cross(n3, n1);
  vec3 n1n2 = cross(n1, n2);
 
  vec3 top = (n2n3 * d1) + (n3n1 * d2) + (n1n2 * d3);
  float denom = dot(n1, n2n3);
 
  return top / -denom;
}

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

		vec3 eye_pos = ExtractCameraPos(view);
		vec3 VertexToEye = normalize(eye_pos - WorldPos);
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

	float Attenuation =	gPointLight.Atten.Constant +
						gPointLight.Atten.Linear * Distance +
						gPointLight.Atten.Exp * Distance * Distance;

	Attenuation = max(1.0, Attenuation);

	return Color / Attenuation;
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
	vec3 Normal = texture(gNormalMap, TexCoord).xyz;
	Normal = normalize(Normal);

	gl_FragColor = vec4(Color, 1.0) * CalcPointLight(WorldPos, Normal);
}