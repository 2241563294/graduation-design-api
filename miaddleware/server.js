module.exports = app => {
	const server = app.listen(4000);
	const io = require('socket.io').listen(server);
	let socketList = {};
	let userList = [];
	// let number = 0;
	
	io.sockets.on('connection', socket => {
		console.log("连接成功");
		
	    // 加入群聊广播
	    socket.on('enter', data => {
				let { username } = data;
				socket.name = username;
	      if (socketList[username] !== undefined) return;
	      socketList[username] = socket.id;
				userList.push(data);
	      // 别人和自己的的广播
	      socket.broadcast.emit('welcome', userList);
	      socket.emit('welcome', userList);
	    });
	
	    // 转发信息
	    socket.on('message', data => {
	      socket.broadcast.emit('sendMsg', data);
	    });
	
	    // 用户离开
	    socket.on('leave', data => {
	      if (socketList.hasOwnProperty(socket.name)) {
	        // 删除
	        delete socketList[socket.name];
					// 删除掉退出的用户名
					let userDel = userList.splice(userList.indexOf(data + "加入群聊"), 1);
					userDel[0].username = data + "退出群聊";
					userDel[0].key = new Date().getTime(); // 修改key
	        socket.broadcast.emit('leave', userList, userDel);
	      }
	    });
	  });
}