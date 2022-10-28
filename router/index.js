const express = require('express');
const router = express.Router();
// 子项路由器
const itemRouter = express.Router({mergeParams: true});

router.use("/articles", itemRouter);
require("./articles")(itemRouter);

router.use("/user", itemRouter);
require("./frontUser")(itemRouter);

router.use("/past", itemRouter);
require("./past")(itemRouter);

router.use("/expand", itemRouter);
require("./expand")(itemRouter);

router.use("/review", itemRouter);
require("./review")(itemRouter);

module.exports = router;