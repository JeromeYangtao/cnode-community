const mongoose = require('mongoose');
const uri = 'mongodb://localhost/test'
mongoose.connect(uri, {useMongoClient: true})
const db = mongoose.connection
const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const UserSchema = new Schema({
    name: {type: String, require: true, unique: true},
    age: {type: Number, max: [90, 'nobody is older than 90 years old'], min: [1, 'nobody is younger than 1 years old']}
})
// UserSchema.index({name: 1}, {unique: true})
const UserModel = mongoose.model('user', UserSchema)

async function createANewUser(params) {
    const user = new UserModel({name: params.name, age: params.age})
    return await user.save()
        .catch(e => {
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
}

// 设置默认值，分页,一次不抛出所有数据，减小服务器压力
async function getUsers(params = {page: 0, pageSize: 10}) {
    let flow = UserModel.find({})
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

module.exports = {
    model: UserModel,
    createANewUser,
    getUsers,
    getUserById,
    updateUserById
}
