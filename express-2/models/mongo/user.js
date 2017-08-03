const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const bluebird = require('bluebird')
const pbkdf2Async = bluebird.promisify(crypto.pbkdf2)
const SALT = require('../../cipher').PASSWORD_SALT
mongoose.Promise = global.Promise
// 用户表单
const UserSchema = new Schema({
    name: {type: String, require: true, unique: true},
    age: {type: Number, max: [90, 'nobody is older than 90 years old'], min: [1, 'nobody is younger than 1 years old']},
    phoneNumber: String,
    password: String
})
// 建立索引
UserSchema.index({name: 1}, {unique: true})
UserSchema.index({name: 1, age: 1})
// 0表示不显示
const DEFAULT_PROJECTION = {password: 0, phoneNumber: 0, __v: 0}
// 用户模型
let UserModel = mongoose.model('user', UserSchema)

async function createANewUser(params) {
    // console.log(params)
    const user = new UserModel({
        name: params.name,
        age: params.age,
        phoneNumber: params.phoneNumber
    })
    // 加密
    user.password = await pbkdf2Async(params.password, SALT, 512, 128, 'sha1')
        .then(r => r.toString())
        .catch(e => {
            console.log(e)
            throw new Error('something goes wrong inside the server')
        })
    let created = await user.save()
        .catch(e => {
                console.log(e.code)
                console.log(e)
                switch (e.code) {
                    case 11000:
                        throw Error('Someone has picked that name, choose another')
                        break
                    default:
                        throw Error(`error creating user  ${JSON.stringify(params)}`)
                        break
                }
            }
        )
    return {
        _id: created._id,
        name: created.name,
        age: created.age
    }
}

// 设置默认值，分页,一次不抛出所有数据，减小服务器压力
async function getUsers(params = {page: 0, pageSize: 10}) {
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

async function getUserById(userId) {
    return UserModel.findOne({_id: userId})
        .select(DEFAULT_PROJECTION)
        .catch(e => {
            console.log(e)
            throw Error(`error getting user by id: ${userId}`)
        })
}

async function updateUserById(userId, update) {
    return await UserModel.findOneAndUpdate({_id: userId}, update, {new: true})
        .catch(e => {
                console.log(e)
                throw Error(`error updating user by id: ${userId}`)
            }
        )
}

async function login(phoneNumber, password) {
    password = await pbkdf2Async(password, SALT, 512, 128, 'sha1')
        .then(r => r.toString())

        .catch(e => {
            console.log(e)
            throw new Error('something goes wrong inside the server')
        })
    let user = await  UserModel.findOne({phoneNumber: phoneNumber, password: password})
        .select(DEFAULT_PROJECTION)
        .catch(e => {
            console.log(`error logging in:phone ${phoneNumber}`)
            throw new Error('something wrong with the server')
        })
    if (!user) throw new Error('no such user')
    return user
}

module.exports = {
    model: UserModel,
    createANewUser,
    getUsers,
    getUserById,
    updateUserById,
    login
}
