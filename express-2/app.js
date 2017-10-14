const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const index = require('./routes/index')
const user = require('./routes/user')
const topicRouter = require('./routes/topic')
const mongoose = require('./services/mongoose_service')

require('./services/mongoose_service')
const Errors = require('./errors')
const logger = require('./utils/logger').logger

const app = express()

// 视图层位置和模板引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public'))) //静态资源位置
app.use(require('./middlewares/req_log').logRequests()) //请求日志
// 路由
app.use('/', index)
app.use('/user', user)
app.use('/topic', topicRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// 错误处理
app.use(function (err, req, res, next) {
  if (err instanceof Errors.BaseHTTPError) {
    res.statusCode = err.httpCode
    // 以json格式返回数据
    res.json({
      code: err.OPCode,
      msg: err.httpMsg,
    })
  } else {
    res.statusCode = 500
    res.json({
      code: Errors.BaseHTTPError.DEFAULT_OPCODE,
      msg: '服务器好像出错了耶，一会儿再试试吧~'
    })
  }
  logger.error('response error to user', err)
})

module.exports = app