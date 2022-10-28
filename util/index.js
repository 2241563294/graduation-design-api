const isEmpty = require("./empty"); // 判空
const encryption = require("./encryption"); //密码加密
const Token = require("./jwt"); // token 
const isLogin = require("./isLogin"); // 是否登录 
module.exports = {
	isEmpty,
	encryption,
	Token,
	isLogin
}