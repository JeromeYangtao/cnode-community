let TOPIC_ID_INIT = 10000
const topics = []

class Topic {
    constructor(params) {
        if (!params.creator) throw {code: -1, msg: "a topic must be sent by a creator"}
        if (!params.title) throw {code: -1, msg: "a topic must comtain a title"}
        if (params.content.length < 5) throw {code: -1, msg: "a topic's length must be longer than 5 charaters"}
        this.title = params.title
        this.content = params.content
        this._id = TOPIC_ID_INIT++
        this.replyList = []
    }
}

async function createANewTopic(params) {
    const topic = new Topic(params)
    topics.push(topic)
    return topic
}

async function getTopics() {
    return topics
}

async function getTopicById(topicId) {
    return topics.find(u => u._id = topicId)
}

async function updateTopicById(topicId, update) {
    let topic = topics.find(u => u._id == topicId)
    if (update.name) topic.name = update.name
    if (update.age) topic.age = update.age

}

async function replyATopic(params) {
    let topic = topics.find(t => Number(params.topicId) === t._id)
    topic.replyList.push({
        creator: params.creator,
        content: params.content
    })
    return topic
}

module.exports = {
    model: Topic,
    createANewTopic,
    getTopics,
    getTopicById,
    updateTopicById,
    replyATopic
}