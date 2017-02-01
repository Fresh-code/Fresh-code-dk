var exports = module.exports = {};

var http = require('http');
var request = require('request');
var fs = require('fs');

var Converter = require('../converter');
var ConfigJson = require('../dataModels/config.json');


var mediaPagesNumber;
var allImagesInfo = [];

var getMediaFromWP = function (page) {
    //Получать картники можно порциями максимум по 100 штук, поэтому, возможно, нужно записывать информацию о них в несколько подходов
    http.get(ConfigJson.URL_FOR_IMAGES + '&page=' + page, function (res) {
        if (page === 1) {
            //получаем количество страниц с картинками
            mediaPagesNumber = JSON.stringify(res.headers).replace(/.*x-wp-totalpages":"(\d).*/g, '$1');
        }
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            if (mediaPagesNumber > 1) {
                allImagesInfo = allImagesInfo.concat(JSON.parse(body));
                if (page < mediaPagesNumber) {
                    getMediaFromWP(++page);
                } else if (page == mediaPagesNumber) {
                    Converter.getPagesFromWP();
                }
            } else {
                allImagesInfo = JSON.parse(body);
                Converter.getPagesFromWP();
            }
        });
    }).on('error', function (err) {
        console.log(err);
    });
};

var getImageUrlById = function(id) {
    for (var x in allImagesInfo) {
        if (allImagesInfo[x].id == id) {
            return allImagesInfo[x].source_url;
        }
    }
};
var getImageAltById = function(id) {
    for (var x in allImagesInfo) {
        if (allImagesInfo[x].id == id) {
            return allImagesInfo[x].alt_text;
        }
    }
};
var getImageFormatById = function(id) {
    for (var x in allImagesInfo) {
        if (allImagesInfo[x].id == id) {
            return allImagesInfo[x].source_url.split('.').pop();
        }
    }
};

var loadImage = function (url, imageName, isTwoFolders) {
    if (typeof url != 'undefined') {
        request(url).pipe(fs.createWriteStream(__dirname + '/../../../' + imageName)).on('error', function (err) {
            console.log("Loading image error: ", err);
        });
    } else {
        console.log("ERROR: while loading image. Url is undefined.", imageName);
    }
    if(isTwoFolders === true){
        loadImage(url, 'wp-data/' + imageName);
    }
};
var loadImgById = function(imgId, imgPath, isTwoFolders) {
    var imageURL = getImageUrlById(imgId);
    if(typeof imageURL != 'undefined'){
        loadImage(imageURL, imgPath + '.' + getImageFormatById(imgId), isTwoFolders === true ? true : false);
    } else {
        console.log("ERROR: image url is undefined for image id ", imgId)
    }
};


exports.getMediaFromWP = getMediaFromWP;
exports.getImageAltById = getImageAltById;
exports.getImageFormatById = getImageFormatById;
exports.loadImgById = loadImgById;
exports.loadImage = loadImage;
