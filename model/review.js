const Model = require("./model");

module.exports = class Review extends Model {
	static next = null;
	
	static getList(article_id = -1) {
		return new Promise((resolve, reject) => {
			let sql = article_id !== -1 ? "SELECT * FROM review where article_id=? ORDER BY createDate DESC" : "SELECT * FROM review";
			let query = article_id !== -1 ? this.query(sql, article_id) : this.query(sql);
			query.then(results => resolve(results))
			.catch(err => {
				console.log('获取评论列表失败：' + err.message);
				this.next();
			});
		});
	}
	
	static insert(info) {
		return new Promise((resolve, reject) => {
			let sql = "insert into review(article_id, username, avatar, content, time, article_title) values(?,?,?,?,?,?)";
			let query = this.query(sql, info)
			.then(results => resolve(results))
			.catch(err => {
				console.log('添加评论失败：' + err.message);
				this.next();
			});
		});
	}
	
	static update(id, content) {
		return new Promise((resolve, reject) => {
			let sql = "UPDATE review SET content=? where id=?";
			let query = this.query(sql, [ content, id ])
			.then(results => resolve(results))
			.catch(err => {
				console.log('添加回复失败：' + err.message);
				this.next();
			});
		});
	}
	
	// 搜索评论
	static select(key, value) {
		return new Promise((resolve, reject) => {
			let sql = `SELECT * FROM review where ${key} like "%${value}%" ORDER BY createDate DESC`;
			this.query(sql)
			.then(results => resolve(results))
			.catch(err => {
				console.log('搜索评论列表失败：' + err.message);
				this.res.send([]);
			});
		});
	}
	
	// 删除评论
	static delete(id) {
		return new Promise((resolve, reject) => {
			let sql = `delete from review where id=?`;
			this.query(sql, id)
			.then(results => resolve(results))
			.catch(err => {
				console.log('删除评论失败：' + err.message);
				this.res.send({text: "删除评论失败"});
			});
		});
	}
}