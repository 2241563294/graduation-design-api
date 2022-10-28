const Review = require("../model/review");
const Articles = require("../model/articles");
const util = require("../util");

function getInfo(article_id, username, avatar, content, time, article_title) {
	return [ parseInt(article_id), username, avatar, JSON.stringify(content), time, article_title ];
}

module.exports = itemRouter => {
	
	itemRouter.post("/insert", async (req, res, next) => {
		Review.next = next;
		const { token, article_id, username, avatar, content, time, article_title } = req.body;
		util.isLogin(token, res);
		const data = await Review.insert(getInfo(article_id, username, avatar, content, time, article_title));
		if (util.isEmpty(data)) return res.status(200).send("评论失败");
		Articles.updateCount("reviewCount", article_id, '+');
		res.status(200).send("评论成功");
	});
	
	// 获取评论列表
	itemRouter.get("/reviewlist", async (req, res, next) => {
		Review.next = next;
		const data = await Review.getList(req.query.article_id);
		if (util.isEmpty(data)) return res.status(200).send([]);;
		let tmpData = [];
		data.forEach(item => {
			item.content = JSON.parse(item.content);
			tmpData.push(item);
		} );
		res.status(200).send(data);
	});
	
	// 更新评论
	itemRouter.post("/update", async (req, res, next) => {
		Review.next = next;
		const { token, content, id } = req.body;
		util.isLogin(token, res);
		const data = await Review.update(id, JSON.stringify(content));
		if (util.isEmpty(data)) return res.status(200).send("回复失败");
		res.status(200).send("回复成功");
	});
	
	// 搜索评论
	itemRouter.get("/searchreview", async (req, res, next) => {
		Review.res = res;
		const { username, article_title, content } = req.query;
		let usernameStr = 'username';
		let titleStr = 'article_title';
		let contentStr = 'content';
		let key = '', val = '';
		if (req.query.hasOwnProperty(usernameStr)) {
			key = usernameStr, val = username
		} else if (req.query.hasOwnProperty(titleStr)) {
			key = titleStr, val = article_title
		} else if (req.query.hasOwnProperty(contentStr)) {
			key = contentStr, val = content
		} else return res.send([])
		const data = await Review.select(key, val);
		let tmpData = [];
		data.forEach(item => {
			item.content = JSON.parse(item.content);
			tmpData.push(item);
		} );
		res.send(data);
	});
	
	// 删除指定评论, 评论数 -1 
	itemRouter.post("/delreview", async (req, res, next) => {
		Review.next = next;
		const { token, id, article_id } = req.body;
		util.isLogin(token, res);
		const data = await Review.delete(id);
		Articles.updateCount("reviewCount", article_id, '-');
		res.status(200).send({text: "删除评论成功"});
	});
}