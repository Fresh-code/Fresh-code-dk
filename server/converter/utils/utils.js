'use strict';
var exports = module.exports = {};

var path = require("path");
var fs = require('fs');
var jsonfile = require('jsonfile');
var glob = require("glob");
var request = require('request');


var writeFile = function (path, fileName, data) {
    fs.writeFile(__dirname + '/../../../' + path + fileName, data, function (err) {
        if (err) {
            console.log(err);
        }
    });
};
var writeJsonFile = function (path, fileName, data, isTwoFolders) {
    jsonfile.writeFile(__dirname + '/../../../' + path + fileName, data, {spaces: 2}, function (err) {
        if (err) {
            console.error(err);
        }
    });
    if(isTwoFolders === true){
        writeJsonFile('wp-data/' + path, fileName, data);
    }
};
var removeDir = function (dirPath) {
    try {
        var files = fs.readdirSync(dirPath);
    }
    catch (e) {
        return;
    }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                removeDir(filePath);
        }
    fs.rmdirSync(dirPath);
};
var removeFile = function (path, fileName, isTwoFolders) {
    glob(__dirname + '/../../../' + path + fileName, function (err, files) {
        if (err) throw err;
        files.forEach(function (item) {
            console.log(item + " found");
        });
        files.forEach(function (item) {
            fs.unlink(item, function (err) {
                if (err) throw err;
                console.log(item + " deleted");
            });
        });
    });
    if(isTwoFolders === true){
        removeFile('wp-data/' + path, fileName);
    }
};
var removePostImages = function (id) {
    removeFile('img/blog-post/', 'banner_post_' + id + '.*', true);
    removeFile('img/blog-post/', 'post_author_' + id + '.*', true);
    removeFile('img/blog-post/', 'recent_post_' + id + '.*', true);
    removeFile('img/blog-post/', 'post_' + id + 'c.*', true);
    removeFile('img/blog-post/', 'included_' + id + '*', true);
};
var getClearName = function(str) {
    return str.replace(/\s/g, "-").replace(/[^a-zA-Z0-9\-\_]/g, "");
};
var getImageName = function(url) {
    return url.replace(/(.*)\/(.*)/g, '$2');
};
var createPostName = function(date, name) {
    return date.split(' ')[0] + '-' + getClearName(name.toLowerCase().replace(/\W+/g, "-")) + '.md';
};

exports.writeFile = writeFile;
exports.writeJsonFile = writeJsonFile;
exports.removePostImages = removePostImages;
exports.removeDir = removeDir;
exports.removeFile = removeFile;
exports.getClearName = getClearName;
exports.getImageName = getImageName;
exports.createPostName = createPostName;