const { mock } = require("./config/mockConfig");

mock([
  {
    url: "v1/one",
    method: "get",
    defaultJson: "one.json",
    callback: (ctx) => {
      const query = ctx.query;
      if (query.age == 2) {
        return "two.json";
      }
    },
  },
  {
    url: "v2/one",
    method: "post",
    defaultJson: "one.json",
    callback: (ctx) => {
      const query = ctx.query;
      if (query.name == "小米") {
        return "two.json";
      }
    },
  },
]);
