
// this is an addon file, not a standalone shader

vec3 quat_rotate(vec4 q, vec3 v) {
	vec3 r = cross(q.xyz, v);
	r += r; // 2 * r
	return v + (q.www * r) + cross(q.xyz, r);
}
