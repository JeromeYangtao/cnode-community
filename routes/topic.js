const express = require('express')
const router = express.Router()
const User = require('../models/mongo/user')
const Topic = require('../models/mongo/topic')
const auth = require('../middlewares/auth_user')

// localhost:3000/topic/
// 帖子增删改查
router.route('/')
// 获取帖子列表
  .get(async (req, res, next) => {
    let topics = await
      Topic.getTopics()
    res.json({
      code: 0,
      topics: topics
    })
  })
  // 创建帖子
  .post(auth(), async (req, res, next) => {
    let user = await User.getUserById(req.body.userId)
    let topic = await Topic.createANewTopic({
      creator: user,
      title: req.body.title,
      content: req.body.content
    })
    res.json({
      code: 0,
      topics: topic
    })
  })

router.route('/:id')
// 根据id获取帖子
  .get(async (req, res, next) => {
    let topic = await  Topic.getTopicById(req.params.id)
    res.json({
      code: 0,
      topic: topic
    })
  })
  // 根据id修改帖子
  .patch(auth(), async (req, res, next) => {
    let update = {}
    if (req.body.title) update.title = req.body.title
    if (req.body.content) update.content = req.body.content
    let topic = await  Topic.updateTopicById(req.params.id, update)
    res.json({
      code: 0,
      topic: topic
    })

  })

router.route('/:id/reply')
// 回复帖子
  .post(async (req, res, next) => {
    let user = await User.getUserById(req.body.userId)
    let topic = await  Topic.replyATopic({
      topicId: req.params.id,
      creator: user,
      content: req.body.content
    })
    res.json({
      code: 0,
      topics: topic
    })
  })

module.exports = router

