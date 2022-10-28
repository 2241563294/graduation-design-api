const jwt = require("jsonwebtoken");

const Token = {
	// 加密 
	/**
	 * @param {Object} data { useraccount: "useraccount" }
	 * @param {number} n 小时
	 */
	encrypt(data, n = 5) {
		// 创建时间 秒                 60s * nm 
		let expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * n;
		return jwt.sign(data, 'token', {
			expiresIn: expirationTime
		});
	},
	// 解密
	decrypt(token) {
		try {
			let data = jwt.verify(token, "token");
			return {
				token: true,
				useraccount: data.useraccount
			}
		} catch (e) {
			return {
				token: false,
				data: e
			}
		}
	}
}
module.exports = Token;