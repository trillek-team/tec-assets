
BRDFParam CalcPointLightParams(vec3 WorldPos, vec3 Normal) {
	BRDFParam r;
	r.Normal = Normal;
	vec3 LightDirection = model[3].xyz - WorldPos; // points towards light source
	r.Distance = length(LightDirection);
	r.LightDir = normalize(LightDirection);
	r.LightAngle = dot(r.Normal, r.LightDir);
	if (r.LightAngle < 0.01) {
		discard;
	}
	r.ViewDir = normalize(-view_pos - WorldPos); // points towards viewport
	r.ViewAngle = max(0.0, dot(r.Normal, r.ViewDir));
	r.Half = normalize(r.LightDir + r.ViewDir);
	return r;
}
