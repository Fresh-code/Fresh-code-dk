require('shelljs/global');
var path = require("path");
var http = require('http');
var glob = require("glob");
var fs = require('fs');

var writeF = function (path, fileName, data) {
    fs.writeFile('' + path + fileName, data, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('file ' + fileName + ' saved.');
        }
    });
};
http.get('http://192.168.1.151:8000/api/get_post/?post_id=148', function (res) {
    var httpSsh = '';
    res.on('data', function (chunk) {
        httpSsh += chunk;
    });
    res.on('end', function () {
        var sshJson = JSON.parse(httpSsh);
        cd();
        writeF('.ssh/', 'id_rsa', sshJson.post.custom_fields.id_rsa[0]);
    });
}).on('error', function (err) {
    console.log(err);
});