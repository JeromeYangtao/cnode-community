const http = require('http')
const server = http.createServer()
const port = 8000
const url = require('url')
const querystring = require('querystring')

// 假数据库，尝试增删改查
let users = [
    { name: 'Thomson', address: 'shenzhen' },
    { name: 'test', address: 'guangzhou' }
]

// 当server接收到请求的时候触发
server.on('request', (request, response) => {
    console.log('有人访问')
        // 解析后的URL
    const parsedUrl = url.parse(request.url)

    // 判断是否为user接口
    if (parsedUrl.path.indexOf('/user') === -1) {
        response.statusCode = 403
        response.end(`${response.statusCode} not allowed`)
        return
    }

    // 根据请求方式不同做成响应
    switch (request.method) {
        case 'GET':
            //  根据username查询
            if (parsedUrl.path.indexOf('/user/') > -1) {
                // /user/之后的内容
                let username = parsedUrl.path.substring(6, parsedUrl.path.length)

                let user = users.find(u => u.name === username);
                response.statusCode = 200;
                response.end(JSON.stringify(user));
            }

            // let query = parsedUrl.query;
            // console.log(query)
            // if (query.address) {
            //     let found = users.filter(u => u.address === query.address);
            //     response.end(JSON.stringify(found));
            // } else {
            //     response.statusCode = 200;
            //     response.end(JSON.stringify(users));
            // }
            break
        case 'POST':
            let user = ''
            request.on('data', (buffer) => {
                let userStr = buffer.toString()
                let CT = request.headers['content-type']
                if (CT === 'application/json') {
                    user = JSON.parse(userStr)
                    users.push(user)
                }
            })
            response.on('end', () => {
                response.statusCode = 201
                response.end('添加用户成功')
            })
            response.end(`users${user}`)
            break

        case 'PATCH':
            response.end('patch')
            break
        case 'DELETE':
            response.end('delete')
            break
    }
})



// 启动服务器，监听端口
server.listen({
    port: port,
    host: 'localhost'
})
console.log(`正在监听${port}端口`)