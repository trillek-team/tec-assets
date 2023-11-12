-- test.lua	
require "schematics/core"
require "key_codes"
require "util"

foo = 4
bar = {}
bar[3] = "hi"
bar["key"] = "there"

print("test")

print(dumpTable(schematics))

function onUpdate(delta)
--  print(tostring(delta)) -- noisy, just showing example
end

local placeables = {
	[KEY_1] = schematics.core.vidstand,
	[KEY_2] = schematics.core.bob,
	[KEY_3] = schematics.core.triangle,
	[KEY_4] = schematics.core.cube
}

function onKeyUp(key_code)
	local placeable = placeables[key_code]
	if placeable ~= nil then
		placement_manipulator:set_mesh(placeable.mesh_name)
	end
end