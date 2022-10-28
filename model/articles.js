const Model = require("./model");

/**
 * 文章数据模型
 */

module.exports = class Articles extends Model {
  
	// { start, end}
  static getList(obj) {
    return new Promise((resolve, reject) => {
      // 获取全部数据
      let sql = 'SELECT * FROM articles ORDER BY createDate DESC';
      let query = null;
      // 获取前n条数据
      if (obj.hasOwnProperty("end")  && !obj.hasOwnProperty("start")) {
        sql = 'SELECT * FROM articles ORDER BY createDate DESC LIMIT 0,?';
        query = this.query(sql, parseInt(obj.end));
      } else if (obj.hasOwnProperty("end")  && obj.hasOwnProperty("start")) {
        sql = 'SELECT * FROM articles ORDER BY createDate DESC LIMIT ?,?';
        query = this.query(sql, [parseInt(obj.end), parseInt(obj.start)]);
      } else {
        query = this.query(sql);
      }
			query.then(results => resolve(results))
			.catch(err => console.log('获取列表失败' + err.message));
    });
  }
	// 获取指定文章
	static getArticle(id = 0) {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT * FROM articles WHERE id=?';
			this.query(sql, id).then(results => resolve(results))
			.catch(err => console.log('获取指定文章失败' + err.message));
		});
	}
	
	// 获取文章id列表
	static getArticleIDList() {
		return new Promise((resolve, reject) => {
			let sql = 'SELECT id, title FROM articles';
			this.query(sql).then(results => resolve(results))
			.catch(err => console.log('获取指定文章ID列表失败' + err.message));
		});
	}
	
	// 更新数量
	static updateCount(rowName, article_id, z) {
		return new Promise((resolve, reject) => {
			let sql = `update articles set ${rowName}=${rowName}${z}1 where id=?`;
			let query = this.query(sql, article_id)
			.then(results => resolve(results))
			.catch(err => {
				console.log(`更新${rowName}数失败：` + err.message);
				this.next();
			});
		});
	}
	
	// 获取指定字段
	static getArticleRow(key, whereName ,id) {
		return new Promise((resolve, reject) => {
			let sql = `select ${key} from articles where ${whereName}=?`;
			let query = this.query(sql, id)
			.then(results => resolve(results))
			.catch(err => console.log(`查询${key}失败` + err.message));
		});
	}
	
	// 搜索文章
	static getArticleList(keyword) {
		return new Promise((resolve, reject) => {
			let sql = keyword !== '' ?  `select * from articles where type=? or title like "%?%" or type='*'` : 'select * from articles';
			let query = keyword !== '' ? this.query(sql, [keyword, keyword]) :
			this.query(sql)
			
			query
			.then(results => resolve(results))
			.catch(err => {
				console.log(`查询文章列表失败` + err.message);
				this.next();
			});
		} )
	} 
	
	// 删除某行数据
	static deleteRow(id) {
		return new Promise((resolve, reject) => {
			let sql = `delete from articles where id=?`;
			let query = this.query(sql, id)
			.then(results => resolve(results))
			.catch(err => { 
				console.log(`删除文章失败` + err.message)
				this.res.status(200).send({text: "删除文章失败"})
			});
		});
	}
	
	// 更新文章
	static updateArticle(arr) {
		return new Promise((resolve, reject) => {
			let sql = `update articles set title=?, type=?, author=?, imgSrc=?, content=? where id=?`;
			let query = this.query(sql, arr)
			.then(results => resolve(results))
			.catch(err => {
				console.log(`更新文章失败` + err.message);
				this.res.status(200).send({text: "更新文章失败"})
			});
		});
	}
	
	// 插入文章
	static insertArticle(arr) {
		return new Promise((resolve, reject) => {
			let sql = `insert into articles(type, title, author, imgSrc, content) values(?,?,?,?,?)`;
			let query = this.query(sql, arr)
			.then(results => resolve(results))
			.catch(err => {
				console.log(`发布文章失败` + err.message);
				return this.res.status(200).send({text: "发布文章失败"})
			});
		});
	}
}