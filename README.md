# local-mock-server

## Mock-Server setup

```
yarn mock / npm run mock / cmd 启动nodemon server.js / cmd 启动node server.js
```

## Directory Structure

```
├─ local-mock-server
│  └─ state // 存放接口文件
│   └─ common // 公共数据
│     └─ metadata.js // 元数据字典值
│   └─ user // 存放示例curd接口
│  └─ server.js // 服务核心代码
├─ .gitignore
└─ package.json
```

## Usage Mode

```
/state下编写完接口后需要在server.js中引入，详见user示例接口

// user Api  ===> 用户列表相关mock
const user = require("./state/user/index");
app.use(user.routes(), user.allowedMethods());
```
