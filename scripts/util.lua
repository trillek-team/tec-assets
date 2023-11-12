function dumpTable(o, depth)
	local current_depth = (depth == nil and 0) or depth
	if type(o) == 'table' then
		local s = '{\n'
		for k,v in pairs(o) do
			if type(k) ~= 'number' then k = '"'..k..'"' end
			s = s .. string.rep("  ", current_depth + 1) .. '['..k..'] = ' .. dump(v, current_depth + 1) .. ',\n'
		end
		return s .. string.rep("  ", current_depth) .. '}'
	elseif type(o) == 'number' or type(o) == 'boolean' then
		return tostring(o)
	else
		return '"' .. tostring(o) .. '"'
	end
end
