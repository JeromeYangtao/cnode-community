exports.index = function (req, res) {
    res.json(200, {name: "张三", age: 40});
}