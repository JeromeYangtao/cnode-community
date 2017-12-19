const express = require('express')
const router = express.Router()
const User = require('../models/mongo/user')
const Topic = require('../models/mongo/topic')
const auth = require('../middlewares/auth_user')

// localhost:3000/topics/
// 帖子增删改查
router.route('/')
/**
 *
 * @api get /topics 主题首页
 * @apiDescription 获取首页的topics列表
 * @apiParam {Number=0} page 页数
 * @apiParam {String=all} tab topics分类 目前有all
 * @apiParam {Number=10} limit  每一页的topics数量
 *
 */
  .get(async (req, res, next) => {
    let topics = await Topic.getTopics({
      page: req.query.page,
      tab: req.query.tab,
      limit: req.query.limit
    })
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
/**
 *
 * @api get /topics/:id 主题详情
 * @apiDescription 通过id获取topic
 *
 */
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

