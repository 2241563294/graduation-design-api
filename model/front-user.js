const Model = require("./model");

module.exports = class FrontUser extends Model {
	static res = null
	// 插入用户信息
	static insertFrontUser(info) {
		return new Promise((resolve, reject) => {
			let sql = "insert into front_user(avatar, username, useraccount, password) values(?,?,?,?)";
			let query = this.query(sql, info)
			.then(results => resolve(results))
			.catch(err => console.log('注册用户失败' + err.message));
		});
	}
	
	// 获取字段 密码，账号，用户名
	static getFrontRow(key, value) {
		return new Promise((resolve, reject) => {
			let sql = `select ${key} from front_user where ${key}=?`;
			let query = this.query(sql, value)
			.then(results => resolve(results))
			.catch(err => console.log(`查询${key}` + err.message));
		});
	}
	
	// 获取用户信息
	static getFrontInfo(useraccount, password) {
		return new Promise((resolve, reject) => {
			let sql = `select avatar,username,useraccount from front_user where `  + (password === "waitfish_" ? `useraccount=?` :`useraccount=? and password=?`);
			let val = password === "waitfish_" ? useraccount : [useraccount, password];
			let query = this.query(sql, val)
			.then(results => resolve(results))
			.catch(err => {
				console.log(`查询用户信息失败` + err.message)
				this.res.status(200).send([]);
			});
		});
	}
	
	// 获取用户是否点赞
	static getGoodList(useraccount) {
		return new Promise((resolve, reject) => {
			let sql = `select article_id_list from front_user where useraccount=? limit 0,1`;
			let query = this.query(sql, useraccount)
			.then(results => resolve(results))
			.catch(err => console.log(`查询点赞列表失败` + err.message));
		});
	}
	
	// 更新点赞列表
	static updateGoodList(useraccount, article_id_list) {
		return new Promise((resolve, reject) => {
			let sql = `update front_user set article_id_list=? where useraccount=?`;
			let query = this.query(sql, [article_id_list, useraccount])
			.then(results => resolve(results))
			.catch(err => console.log(`更新点赞列表失败` + err.message));
		});
	}
	
	// 获取用户列表
	static getList() {
		return new Promise((resolve, reject) => {
			let sql = `select * from front_user`;
			let query = this.query(sql)
			.then(results => resolve(results))
			.catch(err => console.log(`获取用户列表失败` + err.message));
		});
	}
	
	// 更新用户
	static update(username, useraccount, oldUseraccount) {
		return new Promise((resolve, reject) => {
			let sql = `update front_user set username=?, useraccount=? where useraccount=?`;
			let query = this.query(sql, [username, useraccount, oldUseraccount])
			.then(results => resolve(results))
			.catch(err => { 
				console.log(`更新用户失败` + err.message)
				this.res.status(200).send({text: "更新用户信息失败"})
			});
		});
	}
	
	// 删除某行数据
	static delete(useraccount) {
		return new Promise((resolve, reject) => {
			let sql = `delete from front_user where useraccount=?`;
			let query = this.query(sql, useraccount)
			.then(results => resolve(results))
			.catch(err => { 
				console.log(`删除用户失败` + err.message)
				this.res.status(200).send({text: "删除用户操作失败"})
			});
		});
	}
}