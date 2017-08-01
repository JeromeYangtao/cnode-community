const mongoose = require('mongoose');
const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const TopicSchema = new Schema({
    title: String,
    content: String,
    replyList: Array
})
const TopicModel = mongoose.model('topic', TopicSchema)

async function createANewTopic(params) {
    const topic = new TopicModel({title: params.title, content: params.content})
    return await topic.save()
        .catch(e => {
            console.log(e)
            throw new Error('error creating topic to db')
        })
}

async function getTopics(params = {page: 0, pageSize: 10}) {
    let flow = TopicModel.find({})
    flow.skip(params.page * params.pageSize)
    flow.limit(params.pageSize)
    return await flow
        .catch(e => {
            console.log(e)
            throw new Error('error getting users from db')
        })
}

async function getTopicById(topicId) {
    return TopicModel.findOne({_id: topicId})
        .catch(e => {
            console.log(e)
            throw Error(`error getting topic by id: ${topicId}`)
        })
}

async function updateTopicById(topicId, update) {
    return await TopicModel.findOneAndUpdate({_id: topicId}, update, {new: true})
        .catch(e => {
                console.log(e)
                throw Error(`error updating topic by id: ${topicId}`)
            }
        )
}

async function replyATopic(params) {
    return await TopicModel.findOneAndUpdate({_id: params.topicId}, {
        $push: {
            "replyList": {
                creator: params.creator,
                content: params.content
            }
        }
    }, {new: true})
        .catch(e => {
                console.log(e)
                throw Error(`error replying topic by id: ${topicId}`)
            }
        )
}

module.exports = {
    model: TopicModel,
    createANewTopic,
    getTopics,
    getTopicById,
    updateTopicById,
    replyATopic
}