const Model = require("./model");

module.exports = class Expand extends Model {
	static next = null;
	
	static getList() {
		return new Promise((resolve, reject) => {
			let sql = "SELECT * FROM expand";
			let query = this.query(sql)
			.then(results => resolve(results))
			.catch(err => {
				console.log('获取拓展列表失败：' + err.message);
				Expand.next();
			});
		});
	}
	
	// 删除拓展
	static delete(id) {
		return new Promise((resolve, reject) => {
			let sql = "delete from expand where id=?";
			let query = this.query(sql, id)
			.then(results => resolve(results))
			.catch(err => {
				console.log('删除列表失败：' + err.message);
				this.res.send({text: "删除列表失败"});
				this.next();
			});
		});
	}

	// 更新拓展
	static update(arr) {
		return new Promise((resolve, reject) => {
			let sql = "update expand set imgSrc=?, title=?, path=? where id=?";
			let query = this.query(sql, arr)
			.then(results => resolve(results))
			.catch(err => {
				console.log('删除列表失败：' + err.message);
				this.res.send({text: "删除列表失败"});
				this.next();
			});
		});
	}
	
	// 添加拓展
	static add(info) {
		return new Promise((resolve, reject) => {
			let sql = "insert into expand(imgSrc, title, path) values(?,?,?)";
			let query = this.query(sql, info)
			.then(results => resolve(results))
			.catch(err => {
				console.log('添加拓展失败：' + err.message);
				this.res.send({text: "添加拓展失败"});
				this.next();
			});
		});
	}
}