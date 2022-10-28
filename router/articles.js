const Articles = require("../model/articles");
const FrontUser = require("../model/front-user");
const { Token, isLogin } = require("../util");
const urldeal = require("url");
const multer  = require('multer');
const path = require("path");
const fs = require("fs");
const upload = multer({ 
	dest: path.join(path.dirname(__dirname),  "assets", "upload")
})

module.exports = itemRouter => {
	
  itemRouter.get("/", async (req, res) => {
		// console.log(req.query);
		let data = null;
		/**
		 * 1.如果参数是 id 则通过 id 获取
		 * 否则 
		 * 	1.获取全部列表内容
		 * 	2.end 获取列表前n条
		 * 	3.start,end 获取列表 [start,end) 索引的内容
		 */
		if (req.query.hasOwnProperty("id")) {
			data = await Articles.getArticle(req.query.id);
		} else {
			data = await Articles.getList(req.query);
		}
    res.status(200).send(data);
  });
	
	itemRouter.get("/idlist", async (req, res) => {
		const data = await Articles.getArticleIDList();
		res.status(200).send(data);
	});
	
	// 点赞变化
	itemRouter.get("/handlegood", async (req, res, next) => {
		const { token, article_id } = req.query;
		const { token: dec, useraccount } = Token.decrypt(token);
		if (!dec) res.status(202).send({text: "登录失效"});
		const arr = await FrontUser.getGoodList(useraccount);
		let list = arr[0].article_id_list;
		/**
		 * 如果等于 -1
		 * 该文章没有点赞
		 * 1.文章点赞 +1 
		 * 2.存入点赞列表
		 * 3.查询新的值
		 */
		let text = "";
		if (list.indexOf(article_id) === -1) {
			await Articles.updateCount("goodCount", article_id, '+');
			await FrontUser.updateGoodList(useraccount, list +  "," + article_id);
			text = "点赞成功";
		} else {
			await Articles.updateCount("goodCount", article_id, '-');
			list = list.replace(`,${article_id}`,"");
			await FrontUser.updateGoodList(useraccount, list);
			text = "已取消点赞";
		}
		let data = await Articles.getArticleRow("goodCount", "id", article_id);
		res.status(200).send({ text, goodCount: data[0].goodCount });
	});
	
	// 是否点赞
	itemRouter.get("/isgood", async (req, res) => {
		const { token, article_id } = req.query;
		const { token: dec, useraccount } = Token.decrypt(token);
		if (!dec) res.status(202).send({text: "登录失效"});
		const arr = await FrontUser.getGoodList(useraccount);
		let list = arr[0].article_id_list;
		let isGood = list.indexOf(article_id) === -1 ? false : true;
		res.status(200).send({ isGood });
	});
	
	// 阅读文章
	itemRouter.get("/handleread", async (req, res, next) => {
		Articles.next = next;
		const { article_id } = req.query;
		await Articles.updateCount("readCount", article_id, '+');
		const data = await Articles.getArticleRow("readCount", "id", article_id);
		res.status(200).send({ readCount: data[0].readCount });
	});

	// 搜索文章
	itemRouter.get("/search", async (req, res, next) => {
		Articles.next = next;
		let { keyword } = req.query;
		keyword = keyword === undefined ? '' : keyword;
		const data = await Articles.getArticleList(keyword);
		res.status(200).send(data);
	});
	
	// 删除文章
	itemRouter.post("/delarticle", async (req, res, next) => {
		Articles.res = res;
		let { id, token } = req.body;
		await Articles.deleteRow(id);
		res.status(200).send({text: '删除文章成功'});
	});
	
	// 接收上传图片
	itemRouter.post("/upload", upload.single("file"), async (req, res, next) => {
		Articles.res = res;
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
					 var databaseImgSrc = "/upload/" + fileName;
					 res.send({text: "上传成功", url:databaseImgSrc});
				}
			})// 因为异步问题只能使用 else
		} else res.send({text: "上传失败"});
	});
	
	// 更新文章
	itemRouter.post("/updatearticle", async (req, res, next) => {
		Articles.res = res;
		const { title, type, author, imgSrc, content, id } = req.body;
		let arr = [title, type, author, imgSrc, content, id];
		const data = Articles.updateArticle(arr);
		res.send({text: "更新文章成功"});
	});
	
	// 发布文章
	itemRouter.post("/insertarticle", async (req, res, next) => {
		Articles.res = res;
		const { type, title, author, imgSrc, content } = req.body;
		console.log(type, title, author, imgSrc, content);
		let arr = [type, title, author, imgSrc, content];
		const data = Articles.insertArticle(arr);
		res.send({text: "发布文章成功"});
	});
}