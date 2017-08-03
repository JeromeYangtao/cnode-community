// 和mongo建立连接
const mongoose = require('mongoose');
const uri = 'mongodb://localhost/test'
mongoose.connect(uri, {useMongoClient: true})
const db = mongoose.connection
const Schema = mongoose.Schema

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('mongoDB connected')
});