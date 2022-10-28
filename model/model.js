const mysql = require("mysql2");

module.exports = class Model {
  static connect = null;
	static next = null; // 可以传递回调函数，res.send("失败") or next 函数;
	static res = null;

  // 连接数据库
  static connection() {
    Model.connect = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "db_waitfish_blog"
    });
    Model.connect.connect(err => {
      if (err) console.log(`数据库连接失败${err}`);
    });
  } 

  // 关闭数据库连接
  static end() {
    if (Model.connect) Model.connect.end();
  }

  /**
   * 通用查询
   * @param {string} sql 执行的sql语句
   * @param {Array} params 给SQL语句的占位符进行赋值的参数数组
   * @returns 
   */
   static query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.connection();

      Model.connect.query(sql, params, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });

      this.end();
    })
  }
}