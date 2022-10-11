/**
 * 示例代码
 * 用户列表模块mock-curd接口
 */
const Router = require("koa-router");
const Mock = require("mockjs");
const send = require("koa-send"); 

const router = new Router({
  //设置接口前缀
  prefix: "/user"
});

// 循环mock数据
let userList = [];
const count = 8;
for (let i = 0; i < count; i++) {
  userList.push(
    Mock.mock({
      id: "@id",
      name: Mock.Random.cname(),
      isMale: "@integer(1, 2)",
      mail: "@email",
      address: "@county(true)"
    })
  );
}

// 查询list接口
//ctx.params 路由传值
//ctx.query  参数传值
//ctx.request.body Post参数
router.get("/list", async (ctx) => {
  // 定义过滤数组
  let filterlist = [];
  // 接收get传参
  const { selectVal } = ctx.query;
  if (selectVal) {
    // 根据查询条件过滤相应数据返回
    filterlist = userList.filter((item) => item.isMale.toString() === selectVal);
    ctx.body = {
      data: filterlist,
      resutCode: "1"
    };
  } else {
    // 如果没有查询条件则返回全部数据
    ctx.body = {
      data: userList,
      resutCode: "1"
    };
  }
});

// 删除delete接口
//ctx.params 路由传值
//ctx.query  参数传值
//ctx.request.body Post参数
router.post("/delete", async (ctx) => {
  // 接受post传参
  const { id } = ctx.request.body;
  // 判断id存在则根据id找到目标数据调用splice方式删除
  if (id) {
    const _index = userList.findIndex((item) => item.id === id);
    userList.splice(_index, 1);
    ctx.body = {
      data: "删除成功",
      resutCode: "1"
    };
  } else {
    // id不存在则返回错误信息
    ctx.body = {
      data: "未传id, 无法删除",
      resutCode: "0"
    };
  }
});

// 新增 / 编辑 => update接口
//ctx.params 路由传值
//ctx.query  参数传值
//ctx.request.body Post参数
router.post("/update", async (ctx) => {
  // 接受post传参
  const { row } = ctx.request.body;
  // 判断row.id存在则根据row.id找到目标数据调用splice方式替换
  if (row.id) {
    const _index = userList.findIndex((item) => item.id === row.id);
    userList.splice(_index, 1, row);
    ctx.body = {
      data: "编辑成功",
      resutCode: "1"
    };
  } else {
    // row.id不存在则视为新增数据，添加id字段将数据unshift
    row["id"] = Math.floor(Math.random() * 100 + 1);
    userList.unshift(row);
    ctx.body = {
      data: "新增成功",
      resutCode: "1"
    };
  }
});

// 导出 router 实例
module.exports = router;
