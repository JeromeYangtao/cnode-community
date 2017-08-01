const mongoose = require('mongoose');
const uri = 'mongodb://localhost/test'

mongoose.connect(uri, {useMongoClient: true})
const db = mongoose.connection
const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const UserSchema = new Schema({
    name: {type: String, require: true, unique: true},
    age: {type: Number, max: 90, min: [1, 'nobody is younger than 1 years old']}
})

UserSchema.methods.sayYourName = function () {
    return this.name
}
UserSchema.statics.findByName = async function (name) {
    return await this.findOne({name: name})
}
const UserModel = mongoose.model('user', UserSchema)

!(async () => {
    let user = new UserModel({name: 'wwwww'})
    user.save()
})()
    .then(r => {
    })
    .catch(e => {
    })


// !(async () => {
//     let found = await UserModel.findByName('laoyang')
//     return found
// })()
//     .then(r => {
//         console.log(r)
//     })
//     .catch(e => {
//     })
// !(async () => {
//     let found = await UserModel.findOne({})
//     console.log(found.sayYourName())
// })()
//     .then(r => {
//     })
//     .catch(e => {
//     })

// !(async () => {
//     let created = await UserModel.create({
//         name: 'laoyang',
//         age: 89
//     }).then()
//     return created
// })()
//     .then(r => {
//         console.log(r)
//     })
//     .catch(e => {
//         console.log((e))
//     })

// db.close((err, result) => {
//     console.log(err)
//     console.log(result)
// })

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});