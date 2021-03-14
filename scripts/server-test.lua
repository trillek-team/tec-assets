print("server-side lua")

function onClientConnected()
	print("Client connected")
end

function onClientDisconnected()
	print("Client disconnected")
end

function onChatCommand(command, args) --args is of type vector
	print(command)
	for k=1, #args do
		v = args[k]
		print(v)
	end
end