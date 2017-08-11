const express = require('express')
const router = express.Router()
const User = require('../models/mongo/user')
const Topic = require('../models/mongo/topic')
const auth = require('../middlewares/auth_user')

// localhost:3000/topic/
// 帖子增删改查
router.route('/')
  .get((req, res, next) => {
    // 获取帖子列表
    (async () => {
      let topics = await  Topic.getTopics()
      return {
        code: 0,
        topics: topics
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  .post(auth(), (req, res, next) => {
    // 创建帖子
    (async () => {
      let user = await User.getUserById(req.body.userId)
      let topic = await  Topic.createANewTopic({
        creator: user,
        title: req.body.title,
        content: req.body.content
      })
      return {
        code: 0,
        topics: topic
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
    // 根据id获取帖子
    (async () => {
      let topic = await  Topic.getTopicById(req.params.id)
      return {
        code: 0,
        topic: topic
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
  .patch(auth(), (req, res, next) => {
    // 根据id修改帖子
    (async () => {
      let update = {}
      if (req.body.title) update.title = req.body.title
      if (req.body.content) update.content = req.body.content
      let topic = await  Topic.updateTopicById(req.params.id, update)
      return {
        code: 0,
        topic: topic
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
router.route('/:id/reply')
  .post((req, res, next) => {
    // 回复帖子
    (async () => {
      let user = await User.getUserById(req.body.userId)
      let topic = await  Topic.replyATopic({
        topicId: req.params.id,
        creator: user,
        content: req.body.content
      })
      return {
        code: 0,
        topics: topic
      }
    })()
      .then(r => {
        res.json(r)
      })
      .catch(e => {
        next(e)
      })
  })
module.exports = router

