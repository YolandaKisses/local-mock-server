const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const koaBody = require("koa-body");

// 解析post请求数据到ctx.request.body的中间件
const bodyParser = require("koa-bodyparser");
app.use(bodyParser());

// 将koa和中间件连起来
// 在加了router.allowedMethods()中间件情况下，如果接口是get请求，而前端使用post请求，会返回405 Method Not Allowed ，提示方法不被允许 ，
// 并在响应头有添加允许的请求方式；
// 而在不加这个中间件这种情况下，则会返回 404 Not Found找不到请求地址，并且响应头没有添加允许的请求方式
app.use(router.routes()).use(router.allowedMethods());

// 引用koa-body中间件
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
    }
  })
);

// user Api  ===> 用户列表相关mock
const user = require("./state/user/index");
app.use(user.routes(), user.allowedMethods());

// 设置启动端口
// http://localhost:3000
let port = 3000;
// 监听当前mock服务启动
app.listen(port, (ctx) => {
  console.log("koa is listening in: http://localhost:" + port);
});
