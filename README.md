### 前言
项目灵感的最初来源是[cnode社区](https://cnodejs.org/)提供了一套开放API，很多前端就试着用它复现一遍cnode社区。不过访问cnode的大部分都是冲着学Node.js的，在学了点基础知识之后，就想着做个大一点的项目试试。正好看到社区提供了一套比较规范的接口，就试着自己实现一遍
### 技术栈
```
后端: express + mongodb + redis + JWT登录 + 单元测试 + 内存 + 性能调优 + 分布式 
前端: vue、vue-router、vuex、axios、es6开发，使用webpack构建工具编译打包项目 
```

### 使用项目
```
1.克隆项目：      git clone https://github.com/JeromeYangtao/cnode-community
2.安装nodejs
3.安装依赖：      npm install
4.启动服务：      npm start
```

### 功能
- [x] 首页列表，上拉加载
- [x] 主题详情，回复，点赞
- [x] 消息列表
- [x] 消息提醒
- [x] 消息标记为已读
- [x] 登录
- [x] 退出
- [x] 页面后退，数据还原
- [x] 页面后退，滚动位置还原
- [x] 启动图



### 项目目录说明
```
.
|-- bin                              // 脚步目录
|   |-- www.js                       // express启动文件
|-- logs                             // 日志
|-- middlewares                      //中间件
|-- mocks                            //测试用的模拟数据
|-- models                         
|-- profile
|-- public          
|-- routes                            //路由
|-- services                          //数据库
|-- tests                             //单元测试
|-- utils                             //封装一些小工具
|-- views                             //视图
|-- .gitignore
|-- app.js                            // 程序入口文件
|-- cipher.js                         //加密文件
|-- dump.rdb       
|-- errors.js
|-- package.json                      // 配置项目相关信息，通过执行 npm init 命令创建
|-- package-lock.json                 //npm 版本锁定
|-- README.md                         // 项目说明

.
```

### 预览

