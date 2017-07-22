const http = require('http')
const server = http.createServer()
const port = 8000
const url = require('url')
const querystring = require('querystring')

// 假数据库，尝试增删改查
let users =[]

// 当server接收到请求的时候触发
server.on('request', (request, response) => {
    // 解析后的URL
    // true可以让Json格式的parseUrl.query变成string格式
    const parsedUrl = url.parse(request.url,true)

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

            // 查询特定条件的用户
            let query = parsedUrl.query;
            console.log(query)
            if (query.address) {
                // let found = users.filter(u => u.address === query.address);
                // response.end(JSON.stringify(found));
                let found = users.filter(u => u.address === query.address);
                response.end(JSON.stringify(found));
            } else {
                response.statusCode = 200;
                response.end(JSON.stringify(users));
            }
            break
        case 'POST':
            let user = '';
            // 监听data事件,接受到数据的第一个字节开始响应
            request.on('data', (buffer) => {
                // http以buffer的形式传输数据
                const userStr = buffer.toString();

                // 确保user是Json格式
                console.log(1)
                let CT = request.headers['content-type'];
                if (CT === 'application/json') {
                    console.log(2)
                    user = JSON.parse(userStr);
                    users.push(user);
                }
            })

            request.on('end', () => {
                request.statusCode = 201;
                response.end('Great! User created!');
            })
            break;

        case 'PATCH':
            let username = parsedUrl.path.substring(6,parsedUrl.path.length)
            // 监听data事件,接受到数据的第一个字节开始响应
            request.on('data', (buffer) => {
                // http以buffer的形式传输数据
                const userStr = buffer.toString();

                // 确保user是Json格式
                let CT = request.headers['content-type'];
                if (CT === 'application/json') {
                    let update = JSON.parse(userStr);
                    let user = users.find(u=>u.name===username)
                    user.address = update.address
                }
            })

            request.on('end', () => {
                request.statusCode = 201;
                response.end('PATCH');
            })
            break
        case 'DELETE':
            if (parsedUrl.path.indexOf('/user/') > -1) {
                let username = parsedUrl.path.substring(6, parsedUrl.path.length)
                let index = users.findIndex(u => u.name === username);
                users.splice(index,1)
                response.statusCode = 200;
                response.end(JSON.stringify(users));
            }
            break
    }
})



// 启动服务器，监听端口
server.listen({
    port: port,
    host: 'localhost'
})
console.log(`正在监听${port}端口`)