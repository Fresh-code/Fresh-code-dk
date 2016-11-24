var express = require('express');
var app = express();
require('shelljs/global');
var path = require("path");
var http = require('http');
var glob = require("glob");
var fs = require('fs');
var request = require('request');
var jsonfile = require('jsonfile');

var url = 'http://192.168.1.151:8000/?json=get_posts';

var rmDir = function (dirPath) {
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
                rmDir(filePath);
        }
};
var writeF = function (path, fileName, data) {
    fs.writeFile('' + path + fileName, data, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('file' + fileName + ' saved.');
        }
    });
};
var writeJsonFile = function (path, fileName, data) {
    jsonfile.writeFile('' + path + fileName, data, {spaces: 2}, function (err) {
        if (err) {
            console.error(err);
        }
        else {
            console.log('json saved.');
        }
    });
};
var loadImage = function (url, path, imageName) {
    request(url).pipe(
        fs.createWriteStream(path + imageName));
};
var getImageName = function (url) {
    return url.replace(/(.*)\/(.*)/g, '$2');
};
var removeFile = function (path, fileName) {
    glob('' + path + fileName, function (err, files) {
        if (err) throw err;
        files.forEach(function (item, index, array) {
            console.log(item + " found");
        });
        files.forEach(function (item, index, array) {
            fs.unlink(item, function (err) {
                if (err) throw err;
                console.log(item + " deleted");
            });
        });
    });
};

app.get('/build', function (req, res) {
    http.get(url, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {

            var portfolio_json = {
                "title": "",
                "keywords": "",
                "description": "",
                "page_title": "",
                "page_text": "",
                "page_textbot": "",
                "page_background": "",
                "alt": "",
                "works_excluded": [],
                "works": []
            };
            var testimonials_json = {
                "title": "",
                "keywords": "",
                "description": "",
                "page_title": "",
                "page_text": "",
                "page_background": "",
                "alt": "",
                "icons": [],
                "short": [],
                "all": []
            };

            var response = JSON.parse(body);
            for (var i = 0; i < response.posts.length; i++) {
                switch (response.posts[i].categories[0].slug) {
                    case "product": {
                        response.posts[i].attachments.forEach(function (item, index, array) {
                            loadImage(item.url, 'img/' + response.posts[i].slug + '/', getImageName(item.url));
                        });

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
                        writeJsonFile('_data/center-layout/', json_data.name + '.json', json_data);

                        var tmp = {
                            "title": response.posts[i].custom_fields.preview_name[0],
                            "description": response.posts[i].custom_fields.preview_description[0],
                            "cover": "/img/portfolio/" + response.posts[i].attachments[3].slug + "-350.jpg",
                            "srcsetattr": "/img/portfolio/" + response.posts[i].attachments[3].slug + "-700.jpg 700w, /img/portfolio/" + response.posts[i].attachments[0].slug + "-450.jpg 450w, /img/portfolio/" + response.posts[i].attachments[0].slug + "-350.jpg 350w",
                            "sizesattr": "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px",
                            "link": response.posts[i].custom_fields.preview_link[0],
                            "type": response.posts[i].custom_fields.preview_type[0],
                            "mainColor": response.posts[i].custom_fields.preview_maincolor[0]
                        };
                        if (response.posts[i].custom_fields.preview_show[0] == "show") {
                            portfolio_json.works[portfolio_json.works.length] = tmp;
                        }
                        else {
                            portfolio_json.works_excluded[portfolio_json.works_excluded.length] = tmp;
                        }
                    }
                        break;

                    case "blog-page": {

                        loadImage(response.posts[i].attachments[0].url, 'img/blog/', getImageName(response.posts[i].attachments[0].url));
                        var json_blog_page_data =
                        {
                            "name": response.posts[i].slug,
                            "title": response.posts[i].custom_fields.title[0],
                            "keywords": response.posts[i].custom_fields.title[0],
                            "description": response.posts[i].custom_fields.description[0],
                            "page-title": response.posts[i].custom_fields.page_title[0],
                            "page-text": "<span class='inline-text'>" + response.posts[i].custom_fields.page_text[0] + "</span>",
                            "page-background": "/img/blog/" + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2'),
                            "alt": response.posts[i].attachments[0].description
                        };
                        writeJsonFile('_data/', json_blog_page_data.name, json_blog_page_data);
                    }
                        break;

                    case "post": {
                        var backgruond;
                        var cover;
                        var avatar;

                        for (var q = 0; q < response.posts[i].attachments.length; q++) {
                            var img = getImageName(response.posts[i].attachments[q].url);

                            switch (response.posts[i].attachments[q].title) {
                                case 'background':
                                    backgruond = img;
                                    break;
                                case 'cover':
                                    cover = response.posts[i].attachments[q].slug;
                                    break;
                                case 'author':
                                    avatar = img;
                                    break;
                            }
                            loadImage(response.posts[i].attachments[q].url, 'img/blog-post/', img);
                        }

                        var json_blog_data =
                            '--- \n' +
                            'layout: post\n' +
                            'title: ' + response.posts[i].custom_fields.title[0] + '\n' +
                            'description: ' + response.posts[i].custom_fields.description[0] + '\n' +
                            'date: ' + response.posts[i].custom_fields.date[0] + '\n' +
                            'permalink: ' + response.posts[i].custom_fields.permalink[0] + '\n' +
                            'post-title: ' + response.posts[i].custom_fields.post_title[0] + '\n' +
                            'categories-tag: ' + response.posts[i].custom_fields.categories_tag[0] + '\n' +
                            'platform-tag: ' + response.posts[i].custom_fields.platform_tag[0] + '\n' +
                            'background: /img/blog-post/' + backgruond + '\n' +
                            'background-color: "' + response.posts[i].custom_fields.background_color[0] + '"\n' +
                            'type: ' + response.posts[i].custom_fields.type[0] + '\n' +
                            'cover: /img/blog-post/' + cover + '-350.jpg \n' +
                            'srcsetattr: /img/blog-post/' + cover + '-700.jpg 700w, /img/blog-post/' + cover + '-450.jpg 450w, /img/blog-post/' + cover + '-350.jpg 350w \n' +
                            'sizeattr: "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px"' + '\n' +
                            'background-cover: "' + response.posts[i].custom_fields.background_color[0] + '"\n' +
                            'avatar: /img/blog-post/' + avatar + '\n' +
                            'author: ' + response.posts[i].custom_fields.author[0] + '\n' +
                            'position: ' + response.posts[i].custom_fields.position[0] + '\n' +
                            'share-image: /img/blog-post/' + backgruond + '\n' +
                            'share-description: ' + response.posts[i].custom_fields.share_description[0] + '\n' +
                            'share-title: ' + response.posts[i].custom_fields.share_title[0] + '\n' +
                            '---' + '\n' +
                            '<div class="post-body p-t-6rem">' +
                            '' + response.posts[i].content.replace(/<figure.*?<\/figure>/g, '').replace(/<p><img class="alignnone.*?><\/p>/g, '') + '\n' +
                            '</div>';

                        if (response.posts[i].custom_fields.show[0] == "show") {

                            removeFile('_drafts/', response.posts[i].title + '.md');

                            /* glob('_drafts/' + response.posts[i].title + '.md', function (err, files) {
                             if (err) throw err;
                             files.forEach(function (item, index, array) {
                             console.log(item + " found");
                             });
                             files.forEach(function (item, index, array) {
                             fs.unlink(item, function (err) {
                             if (err) throw err;
                             console.log(item + " deleted");
                             });
                             });
                             });*/
                            writeF('_posts/', response.posts[i].title + '.md', json_blog_data);
                        }
                        else {
                            removeFile('_posts/', response.posts[i].title + '.md');

                            /*glob('_posts/' + response.posts[i].title + '.md', function (err, files) {
                             if (err) throw err;
                             files.forEach(function (item, index, array) {
                             console.log(item + " found");
                             });
                             files.forEach(function (item, index, array) {
                             fs.unlink(item, function (err) {
                             if (err) throw err;
                             console.log(item + " deleted");
                             });
                             });
                             });*/
                            writeF('_drafts/', response.posts[i].title + '.md', json_blog_data);
                        }
                    }
                        break;

                    case "testimonial": {
                        loadImage(response.posts[i].attachments[0].url, 'img/testimonials/', getImageName(response.posts[i].attachments[0].url));
                        var tmpTestimonial = {
                            "author": response.posts[i].custom_fields.author[0],
                            "company": response.posts[i].custom_fields.company[0],
                            "text": response.posts[i].custom_fields.text[0],
                            "photo": "/img/testimonials/" + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2'),
                            "link": response.posts[i].custom_fields.link[0]
                        };
                        if (response.posts[i].custom_fields.show[0] == "show") {
                            testimonials_json.short[testimonials_json.short.length] = tmpTestimonial;
                        }
                        else {
                            testimonials_json.all[testimonials_json.all.length] = tmpTestimonial;
                        }
                    }
                        break;

                    /*case "portfolio-page": {

                     loadImage(response.posts[i].attachments[0].url, 'img/portfolio/', getImageName(response.posts[i].attachments[0].url));
                     /!*request(response.posts[i].attachments[0].url).pipe(
                     fs.createWriteStream('img/portfolio/' +
                     response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2')));*!/

                     portfolio_json.title = response.posts[i].custom_fields.title[0];
                     portfolio_json.keywords = response.posts[i].custom_fields.keywords[0];
                     portfolio_json.description = response.posts[i].custom_fields.description[0];
                     portfolio_json.page_title = response.posts[i].custom_fields.page_title[0];
                     portfolio_json.page_text = "<span class='inline-text'>" + response.posts[i].custom_fields.page_text[0] + "</span>";
                     portfolio_json.page_textbot = "<span class='inline-text'>" + response.posts[i].custom_fields.page_textbot[0] + "</span>";
                     portfolio_json.page_background = "/img/portfolio/" + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2') + "";
                     portfolio_json.alt = response.posts[i].attachments[0].description;
                     }
                     break;*/

                    case "testimonials-page": {
                        response.posts[i].attachments.forEach(function (item, index, array) {

                            if (item.caption == 'icon') {
                                testimonials_json.icons[testimonials_json.icons.length] =
                                    "/img/testimonials/" + getImageName(response.posts[i].attachments[0].url);
                            }
                            loadImage(item.url, 'img/testimonials/', getImageName(item.url));
                        });

                        testimonials_json.title = response.posts[i].custom_fields.title[0];
                        testimonials_json.keywords = response.posts[i].custom_fields.keywords[0];
                        testimonials_json.description = response.posts[i].custom_fields.description[0];
                        testimonials_json.page_title = response.posts[i].custom_fields.page_title[0];
                        testimonials_json.page_text = "<span class='inline-text'>" + response.posts[i].custom_fields.page_text[0] + "</span>";
                        testimonials_json.page_background = "/img/testimonials/" + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2');
                        testimonials_json.alt = response.posts[i].attachments[0].description;
                    }
                        break;

                    case "ssh": {
                        cd('..');
                        writeF('.ssh/', 'id_rsa', response.posts[i].custom_fields.id_rsa[0]);
                        writeF('.ssh/', 'known_hosts', response.posts[i].custom_fields.known_hosts[0]);
                        cd('/src');
                    }
                        break;
                }
            }

            //writeJsonFile('_data/', 'portfolio.json', portfolio_json);
            writeJsonFile('_data/', 'testimonials.json', testimonials_json);
        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
    });
});


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/node_server_index.html'));
});

/*
app.get('/push', function (req, res) {
    exec('./git_push.sh');
});
*/


app.listen(3000, function () {
    console.log('App listening on port 3000');
});