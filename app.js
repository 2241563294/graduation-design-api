const express = require("express");
const app = express();
const port = 80;


// 解析以 application/json 和 application/x-www-form-urlencoded 提交的数据
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// assets 公开资源，路径不用接上assets
app.use(express.static('assets'));
// 解决跨域
app.use(require("./miaddleware/header"));
app.use(require('./router'));

// 监听服务
require("./miaddleware/server")(app);

app.get("/", (req, res) => res.send("waitfishAPI,hello!"));

app.listen(port, () => console.log(`http://localhost:${port}`));