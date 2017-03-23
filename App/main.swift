import Vapor
import Foundation

let drop = Droplet(workDir: workDir) 

drop.get("/") { req in
    return try drop.view.make("welcome.html")
}
let room = Room()

var messages = [""]
drop.socket("chat") { req, ws in
    var username: String? = nil
	var chat_name = ""

    ws.onText = { ws, text in
        let json = try JSON(bytes: Array(text.utf8))

        if let u = json.object?["username"]?.string {
            username = u
            room.connections[u] = ws
        }
	if let v = json.object?["chat_name"]?.string{
	chat_name = v
	}

        if let u = username, let m = json.object?["message"]?.string {
            try room.send(name: u, message: m)
		messages.append(u+":"+m)
        }
    

    ws.onClose = { ws, _, _, _ in
        guard let u = username else {
            return
        }

	let filemanager = FileManager()
	var file = filemanager.currentDirectoryPath+"/Public/"+chat_name
	do{
	var all_contents = "<html>";
		for i in messages
		{
			all_contents+="<p>"
			all_contents+=i
			all_contents+="</p>"
		}
	all_contents+="</html>"	
	try all_contents.write(toFile:file,atomically:true,encoding:String.Encoding.utf8)
	}
	catch let error as NSError{
	for i in messages
	{
	print(i)
	}


        room.connections.removeValue(forKey: u)
    }
}
}
}

drop.run()

