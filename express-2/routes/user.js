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
  .get((req, res, next) => {
    // 获取用户列表
    (async () => {
      let users = await  User.getUsers()
      return {
        code: 0,
        users: users
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  .post((req, res, next) => {
    // 创建新用户
    (async () => {
      let user = await User.createANewUser({
        name: req.body.name,
        age: req.body.age,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber
      })
      return {
        code: 0,
        user: user
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
router.route('/:id')
  .get((req, res, next) => {
    // 通过id获取用户
    (async () => {
      let user = await  User.getUserById(req.params.id)
      return {
        code: 0,
        user: user
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  .patch(auth(), upload.single('avatar'), (req, res, next) => {
      // 通过id修改用户
      (async () => {
        let update = {}
        if (req.body.name) update.name = req.body.name
        if (req.body.age) update.age = req.body.age
        update.avatar = `${HOST}/upload/${req.file.filename}`
        let user = await  User.updateUserById(req.params.id, update)
        return {
          code: 0,
          user: user
        }
      })()
        .then(r => {
          res.json(r)
        })
        .catch(e => {
          next(e)
        })
    }
  )

module.exports = router

