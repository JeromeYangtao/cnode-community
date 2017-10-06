// 错误处理
class BaseHTTPError extends Error {
  //msg 是调试信息，OPCode 错误码 httpCode 状态码 httpMsg 告知用户的错误信息
  //基础http错误
  constructor (msg, OPCode, httpCode, httpMsg) {
    super(msg)
    this.OPCode = OPCode
    this.httpCode = httpCode
    this.httpMsg = httpMsg
    this.name = 'BaseHTTPError'
  }

  static get['DEFAULT_OPCODE'] () {
    return 1000000
  }
}

class InternalError extends BaseHTTPError {
  constructor (msg) {
    const OPCode = 1000001
    const httpMsg = '服务器好像开小差了，一会儿再试试？'
    super(msg, OPCode, 500, httpMsg)
  }
}

class ValidationError extends BaseHTTPError {
  //参数错误
  //path 出错的参数，如password
  constructor (path, reason) {
    const OPCode = 2000000
    const httpCode = 400
    super(`error validating param, path: ${path}, reason: ${reason}`, OPCode,
      httpCode, '参数错误，请检查后再重试~')
    this.name = 'ValidationError'
  }
}

// 用户名重复
class DuplicatedUserNameError extends ValidationError {
  constructor (username) {
    super('username', `duplicate user name: ${username}`)
    this.httpMsg = '这个昵称已经被使用啦，不如换一个吧~'
    this.OPCode = 2000001
  }
}

class WechatAPIError extends BaseHTTPError {
  constructor (msg) {
    super(`wechat api error: ${msg}`, 3000001, 500, '微信服务调用失败')
  }
}

class RedisError extends BaseHTTPError {
  constructor (msg) {
    super(`redis error: ${msg}`, 4000001, 500, '服务器内部异常')
  }
}

class NeverLikedError extends BaseHTTPError {
  constructor (userId, attachedId) {
    const msg = `user ${userId} never liked content ${attachedId}, but called dislike`
    super(`never liked error: ${msg}`, 6000001, 400, '还没有点过赞呢，不能取消呦')
  }
}

class AlreadyLikedError extends BaseHTTPError {
  constructor (userId, attachedId) {
    const msg = `user ${userId} already liked content ${attachedId}, but called like`
    super(`already liked error: ${msg}`, 6000002, 400, '已经点过赞啦')
  }
}

module.exports = {
  BaseHTTPError,
  ValidationError,
  DuplicatedUserNameError,
  InternalError,
  WechatAPIError,
  RedisError,
  NeverLikedError,
  AlreadyLikedError,
}
