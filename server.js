const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const bodyParser = require("koa-bodyparser");
app.use(bodyParser());

// 将koa和中间件连起来
app.use(router.routes()).use(router.allowedMethods());

// user Api
const user = require("./state/user/index");
app.use(user.routes(), user.allowedMethods());

// 设置启动端口
// http://localhost:3000
let port = 3000;
app.listen(port, (ctx) => {
  console.log("服务启动成功:http://localhost:" + port);
  router.get("/", async (ctx, next) => {
    ctx.body = `<h1>当你看到此页面时表示服务启动成功</h1>`;
  });
});
