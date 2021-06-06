function dofile (filename)
  local f = assert(loadfile("./assets/scripts/schematics/" .. filename))
  return f()
end

schematics = {
	core = {
		vidstand = dofile("vidstand.lua"),
		bob = dofile("bob.lua"),
		triangle = dofile("build-block-tri.lua"),
		cube = dofile("build-block-cube.lua")
	}
}
