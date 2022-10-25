/**
 * 示例代码
 * 用户列表模块mock-curd接口
 */
const Router = require("koa-router");
const Mock = require("mockjs");
const nodexlsx = require("node-xlsx");
const xlsx = require("xlsx");
const send = require("koa-send");
// 文件系统模块
const fs = require("fs");
const path = require("path");

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
  // 接收get传参
  const { selectVal } = ctx.query;
  if (selectVal) {
    // 定义过滤数组
    let filterlist = [];
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
    row["id"] = (Math.floor(Math.random() * 100 + 1)).toString();
    userList.unshift(row);
    ctx.body = {
      data: "新增成功",
      resutCode: "1"
    };
  }
});

// 下载接口 download
//ctx.params 路由传值
//ctx.query  参数传值
//ctx.request.body Post参数
router.get("/download", async (ctx) => {
  // excel 导出表数据
  let downloadList = [];
  // excel 表头数据
  const data = [["id", "名称", "性别", "邮箱", "地址"]];
  // 接受参数
  const { selectVal } = ctx.query;
  // 如果有查询参数根据条件过滤数据后生成xlsx
  if (selectVal) {
    // 根据查询条件过滤相应数据返回
    downloadList = userList.filter((item) => item.isMale.toString() === selectVal);
  } else {
    // 如果没有查询参数直接生成xlsx
    downloadList = JSON.parse(JSON.stringify(userList));
  }
  // 将list数据根据行转换为二维数组
  downloadList.forEach((item, i) => {
    item['isMale'] = item['isMale'] == 2 ? '女' : '男'
    data.push([]);
    for (let key in item) {
      data[i + 1].push(item[key]);
    }
  });
  // 生成xlsx
  var _buffer = nodexlsx.build([
    {
      name: "sheet1",
      data: data
    }
  ]);
  // 调用writeFileSync 生成download.xlsx，_buffer为文件内容
  fs.writeFileSync("download" + ".xlsx", _buffer);
  // xlsx文件位置
  const path = "/download.xlsx";
  // 根据path生成附件
  ctx.attachment(path);
  // 调用send方式进行导出
  await send(ctx, path);
});

// 读取excel文件
function getFile(reader, upStream) {
  return new Promise(function (result) {
    let stream = reader.pipe(upStream); // 可读流通过管道写入可写流
    stream.on("finish", function (err) {
      result(err);
    });
  });
}

// 上传单个文件 uploadfile
// ctx.request.files.file; 获取上传文件
router.post("/uploadfile", async (ctx, next) => {
  // 获取上传文件
  const file = ctx.request.files.file; 
  // 创建可读流
  const reader = fs.createReadStream(file.filepath);
  // 上传至path
  let filePath = path.join(__dirname, "../upload") + `/${file.originalFilename}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  //等待数据存储完成
  const getRes = await getFile(reader, upStream); 

  // 读取xls数据
  const datas = []
  if (!getRes) { //没有问题
    const workbook = xlsx.readFile(filePath);
    // 返回 ['sheet1', ...]
    const sheetNames = workbook.SheetNames; 
    // 可能存在sheet1, 2, 3 的情况需循环
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);
      datas.push(data);
    }
    // 导入新增的数据
    const addList = []
    // 组装数据
    datas.forEach((item) => {
      for (let key in item) {
        addList.push({
          id: Math.floor(Math.random() * 100 + 1),
          name: item[key]['名称'],
          isMale: item[key]['性别'] == '男' ? '1' : '2',
          mail: item[key]['邮箱'],
          address: item[key]['地址']
        })
      }
    })
    // 和userList合并
    userList = userList.concat(addList)
    ctx.body = {
      data: "上传成功",
      resutCode: "1"
    };
  } else {
     ctx.body = {
      data: "上传失败",
      resutCode: "0"
    };
  }
});

// 导出 router 实例
module.exports = router;
