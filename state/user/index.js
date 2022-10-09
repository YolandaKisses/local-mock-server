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
      isMale: "@integer(1, 2)",
      mail: "@email",
      address: "@county(true)"
    })
  );
}
//ctx.params 路由传值
//ctx.query  参数传值
//ctx.request.body Post参数
router.get("/list", async (ctx) => {
  let filterlist = [];
  const { selectVal } = ctx.query
  if (selectVal) {
    filterlist = userList.filter((item) => item.isMale.toString() === selectVal);
    ctx.body = {
      data: filterlist,
      resutCode: "1"
    };
  } else {
    ctx.body = {
      data: userList,
      resutCode: "1"
    };
  }
});

router.post("/delete", async (ctx) => {
  const { id } = ctx.request.body
  if (id) {
    const _index = userList.findIndex(item => item.id === id)
    userList.splice(_index, 1)
    ctx.body = {
      data: '删除成功',
      resutCode: "1"
    };
  } else {
    ctx.body = {
      data: "未传id, 无法删除",
      resutCode: "0"
    };
  }
});

// 导出 router 实例
module.exports = router;
