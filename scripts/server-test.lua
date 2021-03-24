print("server-side lua")

function onClientConnected(info_event)
	print("Client connected")
end

function onClientJoin(client)
	user = client.user
	print("Client joined (" .. tostring(user.entity_id) .. ")")
end

function onClientLeave(client)
	entity_id = client.user.entity_id
	print("Client left (" .. entity_id .. ")")
	
	user_list = save.user_list
	user_id = user_list:GetUserId(entity_id)
	if user_id ~= "" then
		user = user_list:GetUser(user_id)
	end
end

function onClientDisconnected(info_event)
	print("Client disconnected")
end

function onUserLogin(user_login_info)
	print("Login by (" .. user_login_info.user_id .. ") " .. user_login_info.username)
end

function onChatCommand(command, args) --args is of type vector
	print(command)
	for k=1, #args do
		v = args[k]
		print(v)
	end
	
	if command == "save" then
		save:save()
	end
end