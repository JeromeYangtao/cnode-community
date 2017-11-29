// 判断token是否过期，登录状态管理
const JWT = require('jsonwebtoken')
const JWT_SECRET = require('../cipher').JWT_SECRET
module.exports = function (options) {
  return function (req, res, next) {
    try {
      let auth = req.get('Authorization')
      if (!auth || auth.length < 2) {
        next(new Error('no auth'))
        return
      }
      let authList = auth.split(' ')
      const token = authList[1]
      // 解密
      let obj = JWT.verify(token, JWT_SECRET)
      if (!obj || !obj._id || !obj.expire) {
        throw new Error('No auth')
      }
      if (Date.now() - obj.expire > 0) {
        throw new Error('token is expired')
      }
      next()
    } catch (e) {
      res.statusCode = 401
      next(e)
    }
  }
}