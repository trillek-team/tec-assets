
struct BRDFParam {
	vec3 ViewDir;
	float ViewAngle;
	vec3 LightDir;
	float LightAngle;
	vec3 Normal;
	vec3 Half;
	float Distance;
};

const vec3 diaelec_FR0 = vec3(0.04);
const float PI = 3.14159265359;

BRDFParam CalcPointLightParams(vec3 WorldPos, vec3 Normal) {
	BRDFParam r;
	r.Normal = Normal;
	vec3 LightDirection = model[3].xyz - WorldPos; // points towards light source
	r.Distance = length(LightDirection);
	r.LightDir = normalize(LightDirection);
	r.LightAngle = dot(r.Normal, r.LightDir);
	if (r.LightAngle < 0.0) {
		discard;
	}
	r.ViewDir = normalize(-view_pos - WorldPos); // points towards viewport
	r.ViewAngle = max(0.0, dot(r.Normal, r.ViewDir));
	r.Half = normalize(r.LightDir + r.ViewDir);
	return r;
}

BRDFParam CalcDirLightParams(vec3 WorldPos, vec3 Normal, vec3 DirNormal) {
	BRDFParam r;
	r.Normal = Normal;
	vec3 LightDirection = normalize(-DirNormal); // point towards light source
	r.Distance = length(LightDirection);
	r.LightDir = normalize(LightDirection);
	r.LightAngle = dot(r.Normal, r.LightDir);
	if (r.LightAngle < 0.0) {
		discard;
	}
	r.ViewDir = normalize(-view_pos - WorldPos); // points towards viewport
	r.ViewAngle = max(0.0, dot(r.Normal, r.ViewDir));
	r.Half = normalize(r.LightDir + r.ViewDir);
	return r;
}

vec3 PhongLightBRDF(BRDFParam param, vec3 SpecularIntensity, float SpecularPower) {
	vec3 LightReflect = reflect(-param.LightDir, param.Normal);

	float SpecularFactor = max(0.0, dot(param.ViewDir, LightReflect));
	SpecularFactor = max(0.0, pow(SpecularFactor, SpecularPower));

	return SpecularIntensity * SpecularFactor;
}

vec3 BlinnPhongLightBRDF(BRDFParam param, vec3 SpecularIntensity, float SpecularPower) {
	float SpecularFactor = max(0.0, dot(param.Normal, param.Half));
	SpecularFactor = max(0.0, pow(SpecularFactor, SpecularPower));

	return SpecularIntensity * SpecularFactor;
}

vec3 SchlickFresnelBRDF(BRDFParam param, vec3 FR0) {
	return FR0 + (1.0 - FR0) * pow(max(0.0, 1.0 - dot(param.Half, param.ViewDir)), 5.0);
}

float TrowbridgeReitzGGX_NDF(BRDFParam param, float roughness) {
	float Alpha2 = roughness * roughness;
	float HalfAngle = dot(param.Half, param.Normal);
	float HalfSquare = HalfAngle * HalfAngle;
	float Div = HalfSquare * (Alpha2 - 1.0) + 1.0;
	return Alpha2 / (PI * Div * Div);
}

float SchlickGGX(float angle, float K) {
	return angle / (angle * (1.0 - K) + K);
}

float Direct_Smith_GMF(BRDFParam param, float roughness) {
	float AlphaDirect = roughness + 1;
	float K = (AlphaDirect * AlphaDirect) / 8.0;
	return SchlickGGX(param.ViewAngle, K) * SchlickGGX(param.LightAngle, K);
}

float IBL_Smith_GMF(BRDFParam param, float roughness) {
	float K = (roughness * roughness) / 2.0;
	return SchlickGGX(param.ViewAngle, K) * SchlickGGX(param.LightAngle, K);
}

float CookTorrance_GMF(BRDFParam param, float roughness) {
	float HalfAngle = dot(param.Half, param.Normal);
	float ViewHalf = 1.0 / dot(param.ViewDir, param.Half);
	float ViewH = 2.0 * HalfAngle * param.ViewAngle * ViewHalf;
	float LightH = 2.0 * HalfAngle * param.LightAngle * ViewHalf;
	return min(1.0, min(LightH, ViewH));
}
