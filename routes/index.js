const express = require('express')
const router = express.Router()
const User = require('../models/mongo/user.js')
const JWT = require('jsonwebtoken')
const JWT_SECRET = require('../cipher').JWT_SECRET
const Errors = require('../errors')
const WechatService = require('../services/wechat_service')
const fs = require('fs')
const path = require('path')

// 首页
router.get('/', function (req, res, next) {
  let htmlPath = path.resolve(process.cwd(), 'views/site/dist/index.html')
  let body = fs.readFileSync(htmlPath)
  res.end(body)
})

//管理后台页面
router.get('/management', function (req, res, next) {
  let htmlPath = path.resolve(process.cwd(), 'views/management/dist/index.html')
  let body = fs.readFileSync(htmlPath)
  res.end(body)
})

// 登录
/**
 *
 * @api POST /login 登录
 * @apiDescription 社区账号密码登录
 * @apiParam {String=110} phoneNumber 手机号
 * @apiParam {Integer} password 密码
 *
 */
router.post('/login', (req, res, next) => {
  !(async () => {
    if (!req.body.password) throw new Errors.ValidationError('password', '密码不能为空')
    if (typeof req.body.password !== 'string') throw new Errors.ValidationError('password', '密码必须是string')
    if (req.body.password.length < 8) throw new Errors.ValidationError('password', 'password must longer than 8 characters')
    if (req.body.password.length > 32) throw new Errors.ValidationError('password', 'password can not be longer than 32 characters')

    let user = await User.login(req.body.phoneNumber, req.body.password)
    // 加密过的token
    let token = JWT.sign({_id: user.id, iat: Date.now(), expire: Date.now() + 24 * 60 * 60 * 1000}, JWT_SECRET)
    console.log(user)
    return {
      code: 0,
      data: {
        user: user,
        token: token
      }
    }
  })()
    .then(r => {
      res.json(r)
    })
    .catch(e => {
      next(e)
    })
})
// 微信登录
router.post('/wechat/login', (req, res, next) => {
  (async () => {
    const {code} = req.body
    const user = await WechatService.getUserInfoByCode(code)
    const foundOrCreated = await User.loginWithWechat(user)
    const token = JWT.sign({_id: user._id, iat: Date.now(), expire: Date.now() + 24 * 60 * 60 * 1000}, JWT_SECRET)

    return {
      code: 0,
      data: {
        user: foundOrCreated,
        token: token,
      }
    }
  })()
    .then(r => {
      res.data = r
      response(req, res, next)
    })
    .catch(e => {
      next(e)
    })
})
module.exports = router
