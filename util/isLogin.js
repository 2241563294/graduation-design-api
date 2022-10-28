const isEmpty = require("./empty");
const Token = require("./jwt");

module.exports = function(token, res) {
	if (isEmpty(token)) return !!res.status(401).send("登录失效");
	// 解密返回数据
	const info = Token.decrypt(token);
	if (!info.token) return !!res.status(401).send("登录失效");
	return true
}