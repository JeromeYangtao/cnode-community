const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const TopicSchema = new Schema({
  creator: {type: String},
  accesstoken: {type: String},
  title: {type: String, required: true},
  tab: {type: String},
  content: {type: String},
  replyList: Array,
  likes: {type: Number, default: 0},
})
const TopicModel = mongoose.model('topic', TopicSchema)

async function createANewTopic (params) {
  const topic = new TopicModel({
    title: params.title,
    tab: params.tab,
    content: params.content
  })
  return await topic.save()
    .catch(e => {
      console.log(e)
      throw new Error('error creating topic to db')
    })
}

async function getTopics (params = {page: 0, tab: 'all', limit: 10}) {
  if (params.tab === 'all') {
    let flow = TopicModel.find({})
    flow.skip(params.page * params.limit)
    flow.limit(params.limit)
    return await flow
      .catch(e => {
        console.log(e)
        throw new Error('从db获取数据失败')
      })
  } else {
    throw new Error('目前只有all类型的topics')
    return undefined
  }
}

async function getTopicById (topicId) {
  return TopicModel.findOne({_id: topicId})
    .catch(e => {
      console.log(e)
      throw Error(`error getting topic by id: ${topicId}`)
    })
}

async function updateTopicById (topicId, update) {
  return await TopicModel.findOneAndUpdate({_id: topicId}, update, {new: true})
    .catch(e => {
        console.log(e)
        throw Error(`error updating topic by id: ${topicId}`)
      }
    )
}

async function replyATopic (params) {
  return await TopicModel.findOneAndUpdate({_id: params.topicId}, {
    $push: {
      'replyList': {
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