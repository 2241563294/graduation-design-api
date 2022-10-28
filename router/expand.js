const Expand = require("../model/expand");
const { isLogin } = require("../util");

module.exports = itemRouter => {
	
	itemRouter.get("/expandlist", async (req, res, next) => {
		Expand.next = next;
		const data = await Expand.getList();
		res.status(200).send(data);
	});
	
	// 删除拓展
	itemRouter.post('/delexpand', async (req, res, next) => {
		Expand.next = next;
		Expand.res = res;
		const { id, token } = req.body;
		isLogin(token, res);
		const data = await Expand.delete(id);
		res.send({text: "删除拓展成功"});
	});
	
	// 更新拓展
	itemRouter.post('/updateexpand', async (req, res, next) => {
		Expand.next = next;
		Expand.res = res;
		const { imgSrc, title, path, id, token } = req.body;
		isLogin(token, res);
		const data = await Expand.update([imgSrc, title, path, id]);
		res.send({text: "更新拓展成功"});
	});
	
	// 发布拓展
	itemRouter.post('/addexpand', async (req, res, next) => {
		Expand.next = next;
		Expand.res = res;
		const { imgSrc, title, path, token } = req.body;
		isLogin(token, res);
		const data = await Expand.add([imgSrc, title, path]);
		res.send({text: "添加拓展成功"});
	});
}