const crypto = require("crypto");

module.exports = function encryption(password) {
	let ID = "waitFish";
	let md5 = crypto.createHash("md5");
	if (!!password) return md5.update(password + ID).digest("hex");
}