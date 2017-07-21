const http = require('http')
const server = http.createServer()
const port = 8000

// 假设一个用户，尝试增删改查
let users = []

// 当server接收到请求的时候触发
server.on('request', (request, response) => {
    // 根据请求方式不同做成响应
    switch (request.method) {
        case 'GET':
            break
        case 'POST':
            break
        case 'PATCH':
            break
        case 'DELETE':
            break
    }
})



// 启动服务器，监听端口
server.listen({
    port: port,
    host: 'localhost'
})
console.log(`正在监听${port}端口`)