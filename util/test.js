// 单元测试
// const Token = require("./jwt");
const util = require("./index.js");

let data = "等鱼";
let token = util.Token.encrypt({useraccount: data});

console.log(token);

let dec = util.Token.decrypt(token);
console.log(dec);
console.log(util.isEmpty("123"));;
// 评论
{
	text: "",
	createTime: "",
	children:[
		{
			username1: "", // 发送
			username2: "", // 回复
			text: "",
			createTime: "",
		}
	]
}