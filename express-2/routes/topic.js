const express = require('express');
const router = express.Router();
const User = require('../models/mongo/user')
const Topic = require('../models/mongo/topic')

// localhost:3000/topic/
router.route('/')
    .get((req, res, next) => {
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
    .post((req, res, next) => {
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
    .patch((req, res, next) => {
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
module.exports = router;

