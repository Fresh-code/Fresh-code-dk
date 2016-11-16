var express = require('express');
var app = express();
require('shelljs/global');


app.get('/', function (req, res) {
    res.send('Hello World!');
    mkdir('-p', 'QQQQQQQQQQQQQ');
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});