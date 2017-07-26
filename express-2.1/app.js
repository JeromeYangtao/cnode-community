var express = require('express');
var app = express();
var path = require('path');
var api = require('./routes/api');
var hbs = require('hbs');
var blogEngine = require('./blog');
var bodyParser = require('body-parser');
// var favicon = require('serve-favicon')

// 设置express实例的参数
// 设定port变量，意为访问端口
app.set('port', process.env.PORT || 3000);

// 设定views变量，意为视图存放的目录
app.set('views', path.join(__dirname, 'views'));

// 设定view engine变量，意为网页模板引擎
app.set('view engine', 'html');

app.engine('html', hbs.__express);

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(express.logger('dev'));
// app.use(express.bodyParser());
// app.use(express.methodOverride());
// app.use(app.router);

// 设定静态文件目录，比如本地文件
// 目录为demo/public/images，访问
// 网址则显示为http://localhost:3000/images
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/api', api.index);

app.get('/', function (req, res) {
    res.render('index', {title: "最近文章", entries: blogEngine.getBlogEntries()});
});

app.get('/about', function (req, res) {
    res.render('about', {title: "自我介绍", content: "自我介绍的内容"});
});

app.get('/article/:id', function (req, res) {
    var entry = blogEngine.getBlogEntry(req.params.id);
    console.log(entry)
    res.render('article', {blog: entry});
});

app.listen(app.get('port'));
