const mock = (config, prefix = "api") => {
  const Koa = require("koa");
  const Router = require("koa-router");
  const glob = require("glob");
  const fs = require("fs");
  const logger = require("koa-logger");
  const cors = require("@koa/cors");
  const { resolve } = require("path");

  const app = new Koa();
  const router = new Router({ prefix: `/${prefix}` });

  /***
   * @url 请求的路径
   * @method  请求的方式
   * @defaultJson 默认显示的json数据
   * @callback 回调函数目的是，动态处理不同条件展示的json数据
   */
  const mockConfig = (url, method, defaultJson, callback) => {
    glob.sync(resolve(`./${prefix}`, `${url}.json`)).forEach((item, i) => {
      let apiJsonPath = item && item.split(`/${prefix}`)[1];
      let apiPath = apiJsonPath.replace(".json", "");
      router[method || "get"](apiPath, async (ctx, next) => {
        try {
          let finallJson = callback && callback(ctx);
          let changeFileUrl =
            finallJson && item && item.replace(defaultJson, finallJson);
          let jsonStr = fs.readFileSync(changeFileUrl || item).toString();
          await delayer();
          ctx.body = {
            data: JSON.parse(jsonStr),
            state: 200,
            type: "success",
          };
        } catch (err) {
          ctx.throw("服务器错误", 500);
        }
      });
    });
  };

  // 注册路由
  config.forEach((item) => {
    mockConfig(item.url, item.method, item.defaultJson, item.callback);
  });

  app
    .use(cors())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(logger());
  app.listen(3000);
};

const delayer = async (time = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

module.exports = {
  mock,
};
