const express = require('express')
const router = express.Router()
const User = require('../models/mongo/user')
const auth = require('../middlewares/auth_user')
const multer = require('multer')
const path = require('path')
const HOST = process.env.NODE_ENV === 'production' ? 'http://some.heost/' : 'http://localhost:3000'
// 指定图片存储路径
const upload = multer({dest: path.join(__dirname, '../public/upload')})
// localhost:3000/user/

// 用户增删改查
router.route('/')
// 获取用户列表
  .get(async (req, res, next) => {
    let users = await  User.getUsers()
    res.json({
      code: 0,
      users: users
    })
  })
  // 创建新用户
  .post(async (req, res, next) => {
    let user = await User.createANewUser({
      name: req.body.name,
      age: req.body.age,
      password: req.body.password,
      phoneNumber: req.body.phoneNumber
    })
    res.json({
      code: 0,
      user: user
    })
  })

router.route('/:id')
// 通过id获取用户
  .get(async (req, res, next) => {
    let user = await  User.getUserById(req.params.id)
    res.json({
      code: 0,
      user: user
    })
  })
  // 通过id修改用户
  .patch(auth(), upload.single('avatar'), async (req, res, next) => {
      let update = {}
      if (req.body.name) update.name = req.body.name
      if (req.body.age) update.age = req.body.age
      update.avatar = `${HOST}/upload/${req.file.filename}`
      let user = await  User.updateUserById(req.params.id, update)
      res.json({
        code: 0,
        user: user
      })
    }
  )

router.route('/:name')
  .get(async (req, res, next) => {
    let user = await  User.getUserByName(req.params.id)
    res.json({
      code: 0,
      user: user
    })
  })

module.exports = router

