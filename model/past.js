const Model = require("./model.js");

module.exports =  class Past extends Model {
	static next = null;
	
	static getPastList() {
		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM past ORDER BY year DESC";
			let query = this.query(sql)
			.then(results => resolve(results))
			.catch(err => {
				console.log('获取留言失败：' + err.message);
				this.next();
			});
		});
	}
	
	static insertPast(info) {
		return new Promise((resolve, reject) => {
			let sql = "insert into past(year, time, avatar, username, content) values(?,?,?,?,?)";
			let query = this.query(sql, info)
			.then(results => resolve(results))
			.catch(err => {
				console.log('添加留言失败：' + err.message);
				this.next();
			});
		});
	}
	
	// 删除留言
	static delete(id) {
		return new Promise((resolve, reject) => {
			let sql = `delete from past where id=?`;
			this.query(sql, id)
			.then(results => resolve(results))
			.catch(err => {
				console.log('删除留言失败：' + err.message);
				this.res.send({text: "删除留言失败"});
			});
		});
	}
}