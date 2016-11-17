var express = require('express');
var app = express();
require('shelljs/global');
var path = require("path");
var http = require('http');
var fs = require('fs');
var request = require('request');
var jsonfile = require('jsonfile');
var url = 'http://192.168.1.151:8000/?json=get_posts';


app.get('/build', function (req, res) {
    res.send('Hello World!');
    http.get(url, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            var response = JSON.parse(body);
            for (var i = 0; i < response.posts.length; i++) {
                switch (response.posts[i].categories[0].slug) {
                    case "product": {
                        for(var j=0; j<response.posts[i].attachments.length; j++){
                            request(response.posts[i].attachments[j].url).pipe(
                                fs.createWriteStream('img/' + response.posts[i].slug + '/' + response.posts[i].attachments[j].url.replace(/(.*)\/(.*)/g, '$2')));
                        }
                        var json_data = {
                            "name": response.posts[i].slug,
                            "client": response.posts[i].custom_fields.client[0],
                            "title": response.posts[i].custom_fields.title[0],
                            "description": response.posts[i].custom_fields.description[0],
                            "site": response.posts[i].custom_fields.site[0],
                            "link": response.posts[i].custom_fields.link[0],
                            "industry": response.posts[i].custom_fields.industry[0],
                            "country": response.posts[i].custom_fields.country[0],
                            "teamSize": response.posts[i].custom_fields.teamsize[0],
                            "techUsed": response.posts[i].custom_fields.techused[0],
                            "projDuration": response.posts[i].custom_fields.projduration[0],
                            "pdf": response.posts[i].custom_fields.pdf[0],
                            "workStages": response.posts[i].custom_fields.workstages[0],
                            "images": [
                                {
                                    "alt": response.posts[i].attachments[0].description,
                                    "img": "/img/" + response.posts[i].slug + "/" + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2')
                                },
                                {
                                    "alt": response.posts[i].attachments[1].description,
                                    "img": "/img/" + response.posts[i].slug + "/" + response.posts[i].attachments[1].url.replace(/(.*)\/(.*)/g, '$2')
                                },
                                {
                                    "alt": response.posts[i].attachments[2].description,
                                    "img": "/img/" + response.posts[i].slug + "/" + response.posts[i].attachments[2].url.replace(/(.*)\/(.*)/g, '$2')
                                }
                            ],
                            "challenges": response.posts[i].custom_fields.challenges[0],
                            "buisValue": response.posts[i].custom_fields.buisvalue[0],
                            "solutions": response.posts[i].custom_fields.solutions[0],
                            "css": response.posts[i].custom_fields.css[0],
                            "prev": response.posts[i].custom_fields.prev[0],
                            "next": response.posts[i].custom_fields.next[0]
                        };

                          jsonfile.writeFile('_data/center-layout/' + json_data.name + '.json', json_data, {spaces: 2}, function (err) {
                         if(err){ console.error(err); }
                         else{ console.log('file ' + json_data.name + '.json saved.'); }
                         });
                    }
                        break;
                }
            }

        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
    });
});

app.get('/push', function (req, res) {
    res.send('Trying to push!');
    exec('./git_push.sh');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});