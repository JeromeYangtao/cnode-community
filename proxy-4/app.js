const http = require('http')
const server = http.createServer()

server.on('request', (incomingMsg, res) => {
  let anotherRequest = http.request({
    host: 'www.yangtao.biz',
    path: incomingMsg.url,
    headers: incomingMsg.headers,
    method: incomingMsg.method
  }, (anotherRequest) => {
    anotherRequest.pipe(res)
  })

  incomingMsg.pipe(anotherRequest)
  res.end()
})