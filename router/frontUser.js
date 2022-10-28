const multer  = require('multer');
const path = require("path");
const fs = require("fs");
const FrontUser = require("../model/front-user");
const util = require("../util"); // 工具模块
const upload = multer({ 
	dest: path.join(path.dirname(__dirname),  "assets", "upload")
 })

// 包装用户信息数组
function getUserInfo(avatar, { username, useraccount, password }) {
	return [ avatar, username, useraccount, util.encryption(password) ];
}

/**
 * 注册函数的响应体
 * databaseImgSrc数据库图片路径
 * post参数
 */
async function send(res, databaseImgSrc, obj) {
	let { username, useraccount, password } = obj;
	if (util.isEmpty(username) || util.isEmpty(useraccount) || util.isEmpty(password)) return res.status(202).send("注册失败");
	 let userInfo = getUserInfo(databaseImgSrc, obj);
	 let data = await FrontUser.insertFrontUser(userInfo);
	 if (data) return res.status(200).send("注册成功");
	 res.status(202).send("注册失败");
}

module.exports = itemRouter => {
	// 注册
	itemRouter.post("/register", upload.single("avatar") , function(req,res){
		// 存入数据库的图片路径
		var databaseImgSrc = "/images/fish.png";
		// 处理头像 
		if (req.hasOwnProperty("file")) {
			let { file } = req;
			// 获取后缀名
			const extName = path.extname(file.originalname);
			// 上传成功后的文件路径
			const filePath = file.path;
			// 上传成功后的文件名称
			const fileName = file.filename + extName;
			// 重命名
			fs.rename(filePath, path.join(path.dirname(filePath), fileName),  err => {
				if (!err) {
					// 新路径
					 databaseImgSrc = "/upload/" + fileName;
					 send(res, databaseImgSrc, req.body);
				}
			})// 因为异步问题只能使用 else
		} else send(res, databaseImgSrc, req.body);
	});

	// 获取用户名，判断是否存在用户名或者账号
	itemRouter.get("/frontinfo", async (req, res) => {
		const key = req.query.hasOwnProperty("username") ? "username" : "useraccount";
		const data = await FrontUser.getFrontRow(key, req.query[key]);
		res.send(data);
	});
	
	// 登录
	itemRouter.post("/login", async (req, res) => {
		let { useraccount, password } = req.body;
		if (util.isEmpty(useraccount) || util.isEmpty(password)) return res.status(202).send({text: "登录失败"});
		let data = await FrontUser.getFrontInfo(useraccount, util.encryption(password));
		if (util.isEmpty(data)) return res.status(200).send({ text: "账号或者密码不正确" });
		const token = util.Token.encrypt({ "useraccount": data[0].useraccount});
		// 返回全部信息
		// let sendData = Object.assign(data[0], { token });
		res.send({ text: "登录成功", token});
	})
	
	// token判断
	itemRouter.post("/islogin", async (req, res) => {
		let { token } = req.body;
		if (util.isEmpty(token)) return res.status(401).send({text: "登录失效"});
		// 解密返回数据
		const info = util.Token.decrypt(token);
		if (!info.token) return res.status(401).send({text: "登录失效"});
		 const data = await FrontUser.getFrontInfo(info.useraccount, "waitfish_");
		res.status(200).send(data[0]);
	});
	
	// 后台登录 waitfish 只有这个账号可以登录后台
	itemRouter.post("/backlogin", async (req, res) => {
		let { useraccount, password } = req.body;
		if (util.isEmpty(useraccount) || util.isEmpty(password) || useraccount !== "waitfish") return res.status(202).send({text: "登录失败"});
		let data = await FrontUser.getFrontInfo(useraccount, util.encryption(password));
		if (util.isEmpty(data)) return res.status(200).send({ text: "账号或者密码不正确" });
		const token = util.Token.encrypt({ "useraccount": data[0].useraccount});
		// 返回全部信息
		// let sendData = Object.assign(data[0], { token });
		res.send({ text: "登录成功", token});
	})
	
	// 获取用户列表
	itemRouter.post("/userlist", async (req, res) => {
		let { token } = req.body;
		if (util.isEmpty(token)) return res.status(401).send({text: "登录失效"});
		// 解密返回数据
		const info = util.Token.decrypt(token);
		if (!info.token) return res.status(401).send({text: "登录失效"});
		 const data = await FrontUser.getList();
		res.status(200).send(data);
	})
	
	// 通过账号获取列表
	itemRouter.get("/searchuser", async (req, res) => {
		FrontUser.res = res;
		let { useraccount } = req.query;
		let data = null;
		if (!util.isEmpty(useraccount)) data = await FrontUser.getFrontInfo(useraccount, "waitfish_");
		else data = await FrontUser.getList();
		res.status(200).send(data);
	})
	
	// 修改用户名或者账号
	itemRouter.post("/updateuser", async (req, res) => {
		FrontUser.res = res;
		let { username, useraccount, oldUseraccount } = req.body;
		if (util.isEmpty(username) || util.isEmpty(useraccount) || util.isEmpty(oldUseraccount)) return res.status(200).send({text: "更新用户信息失败"});
		const data = await FrontUser.update(username, useraccount, oldUseraccount);
		res.status(200).send({text: "更新用户信息成功"});
	})
	
	// 删除用户名
	itemRouter.post("/deleteuser", async (req, res) => {
		FrontUser.res = res;
		let { useraccount, token } = req.body;
		util.isLogin(token, res);
		const data = await FrontUser.delete(useraccount);
		res.status(200).send({text: "删除用户成功"});
	})
}