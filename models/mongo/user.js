const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const bluebird = require('bluebird')
const pbkdf2Async = bluebird.promisify(crypto.pbkdf2)
const SALT = require('../../cipher').PASSWORD_SALT
const Errors = require('../../errors')
const logger = require('../../utils/logger').logger
mongoose.Promise = global.Promise
// 用户表单
const UserSchema = new Schema({
  loginName: {type: String, require: true, unique: true},
  age: {type: Number, max: [90, 'nobody is older than 90 years old'], min: [1, 'nobody is younger than 1 years old']},
  phoneNumber: String,
  password: String,
  avatar: String,
  openId: {type: String, index: true},
})
// 建立索引
UserSchema.index({loginName: 1}, {unique: true})
UserSchema.index({loginName: 1, age: 1})
// 0表示不显示
const DEFAULT_PROJECTION = {password: 0, phoneNumber: 0, __v: 0}
// 用户模型
let UserModel = mongoose.model('user', UserSchema)

// 创建新用户
async function createANewUser (params) {
  const user = new UserModel({
    loginName: params.loginName,
    age: params.age,
    phoneNumber: params.phoneNumber,
    openId: params.openId
  })
  if (params.password) {
    // 加密
    user.password = await pbkdf2Async(params.password, SALT, 512, 128, 'sha1')
      .then(r => r.toString())
      .catch(e => {
        console.log(e)
        throw new Error('something goes wrong inside the server')
      })
  }
  let created = await user.save()
    .catch(e => {
        logger.error('error creating user', e)
        switch (e.code) {
          case 11000:
            throw new Errors.DuplicatedUserNameError(params.loginName)
            break
          default:
            throw new Errors.ValidationError('user', `error creating user ${ JSON.stringify(params) }`)
            break
        }
      }
    )
  return {
    _id: created._id,
    loginName: created.loginName,
    age: created.age
  }
}

// 获取用户列表
// 设置默认值，分页,一次不抛出所有数据，减小服务器压力
async function getUsers (params = {page: 0, pageSize: 10}) {
  let flow = UserModel.find({})
  flow.select(DEFAULT_PROJECTION)
  flow.skip(params.page * params.pageSize)
  flow.limit(params.pageSize)
  return await flow
    .catch(e => {
      console.log(e)
      throw new Error('error getting users from db')
    })
}

// id获取单个用户
async function getUserById (userId) {
  return UserModel.findOne({_id: userId})
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      console.log(e)
      throw Error(`error getting user by id: ${userId}`)
    })
}
// loginName获取单个用户
async function getUserByLoginName (loginName) {
  return UserModel.findOne({loginName: loginName})
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      console.log(e)
      throw Error(`error getting user by id: ${loginName}`)
    })
}

// 修改用户信息
async function updateUserById (userId, update) {
  return await UserModel.findOneAndUpdate({_id: userId}, update, {new: true})
    .catch(e => {
        console.log(e)
        throw Error(`error updating user by id: ${userId}`)
      }
    )
}

// 电话，密码登录
async function login (phoneNumber, password) {
  password = await pbkdf2Async(password, SALT, 512, 128, 'sha1')
    .then(r => r.toString())
    .catch(e => {
      console.log(e)
      throw new Errors.InternalError('something goes wrong inside the server')
    })
  let user = await  UserModel.findOne({phoneNumber: phoneNumber, password: password})
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      console.log(`error logging in:phone ${phoneNumber}`)
      throw new Error('something wrong with the server')
    })
  if (!user) throw new Error('没找到用户')
  return user
}

// 微信登录
async function loginWithWechat (user) {
  let found = await UserModel.findOne({openId: user.openid})
  if (found) return found

  let created = await createANewUser({loginName: user.nickname, openId: user.openid})
  return created
}

// 增加积分
async function incrPoints (userId, points) {
  const user = await UserModel.findOneAndUpdate({_id: userId}, {$inc: {points: points}}, {
    new: true,
    fields: {points: 1}
  })
  return user.points
}

module.exports = {
  model: UserModel,
  createANewUser,
  getUsers,
  getUserById,
  updateUserById,
  getUserByLoginName,
  login,
  loginWithWechat,
  incrPoints
}
