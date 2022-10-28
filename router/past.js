const Past = require("../model/Past");
const util = require("../util");

function getPast(year, time, avatar, username, content) {
	return [year, time, avatar, username, content];
}

module.exports = itemRouter => {
	
	itemRouter.get("/list", async (req, res, next) => {
		Past.next = next;
		let { token } = req.query;
		util.isLogin(token, res);
		const data = await Past.getPastList();
		let tmpArr = [];
		// 组装成一个二维数组
		// 按年分级，然后里面按日期什么的分级
		data.forEach(item => {
			// 如果存在该对象
			let index = tmpArr.findIndex(a => a.year === item.year);
			if ( index === -1) {
				tmpArr.push({
					year: item.year,
					children: [item]
				})
			} else tmpArr[index].children.unshift(item); // 头插入保证最新的在前面
		});
		res.status(200).send(tmpArr);
	})
	
	// 发表留言
	itemRouter.post("/add", async (req, res, next) => {
		Past.next = next;
		let { token, year, time, avatar, username, content  } = req.body;
		util.isLogin(token, res);
		const data = await Past.insertPast(getPast(year, time, avatar, username, content));
		if (util.isEmpty(data)) return send("留言失败");
		res.status(200).send("留言成功");
	})
	
	// 删除留言
	itemRouter.post("/delPast", async (req, res, next) => {
		Past.res = res;
		let { token, id } = req.body;
		util.isLogin(token, res);
		const data = await Past.delete(id);
		res.status(200).send({text: "删除留言成功"});
	})
}