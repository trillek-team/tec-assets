
BRDFParam CalcDirLightParams(vec3 WorldPos, vec3 Normal, vec3 DirNormal) {
	BRDFParam r;
	r.Normal = Normal;
	vec3 LightDirection = normalize(-DirNormal); // point towards light source
	r.Distance = 1.0;
	r.LightDir = LightDirection;
	r.LightAngle = dot(r.Normal, LightDirection);
	if (r.LightAngle < -0.001) {
		discard;
	}
	r.ViewDir = normalize(-view_pos - WorldPos); // points towards viewport
	r.ViewAngle = max(0.0, dot(r.Normal, r.ViewDir));
	r.Half = normalize(r.LightDir + r.ViewDir);
	return r;
}
