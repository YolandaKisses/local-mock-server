const Router = require("koa-router");
const Mock = require("mockjs");

const router = new Router({
  //设置前缀
  prefix: "/user"
});

let userList = [];
const count = 15;
for (let i = 0; i < count; i++) {
  userList.push(
    Mock.mock({
      id: "@id",
      name: Mock.Random.cname(),
      isMale:'@boolean',
      mail: "@email",
      address:'@county(true)',
    })
  );
}
//ctx.params 路由传值
//ctx.query  参数传值
//ctx.request.body Post参数
router.get("/list", async (ctx) => {
  ctx.body = {
    data: userList,
    resutCode: "1"
  };
});

// 导出 router 实例
module.exports = router;
