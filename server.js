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
        res.on('data', function (chunk) { body += chunk; });
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

            response.posts.forEach(function (wpDoc) {
                switch (wpDoc.categories[0].slug) {
                    case "product": {
                        wpDoc.attachments.forEach(function (item, index, array) {
                            loadImage(item.url, 'img/' + wpDoc.slug + '/', getImageName(item.url));
                        });

                        var json_data = {
                            "name": wpDoc.slug,
                            "client": wpDoc.custom_fields.client[0],
                            "title": wpDoc.custom_fields.title[0],
                            "description": wpDoc.custom_fields.description[0],
                            "site": wpDoc.custom_fields.site[0],
                            "link": wpDoc.custom_fields.link[0],
                            "industry": wpDoc.custom_fields.industry[0],
                            "country": wpDoc.custom_fields.country[0],
                            "teamSize": wpDoc.custom_fields.teamsize[0],
                            "techUsed": wpDoc.custom_fields.techused[0],
                            "projDuration": wpDoc.custom_fields.projduration[0],
                            "pdf": wpDoc.custom_fields.pdf[0],
                            "workStages": wpDoc.custom_fields.workstages[0],
                            "images": [
                                {
                                    "alt": wpDoc.attachments[0].description,
                                    "img": "/img/" + wpDoc.slug + "/" + getImageName(wpDoc.attachments[0].url)
                                },
                                {
                                    "alt": wpDoc.attachments[1].description,
                                    "img": "/img/" + wpDoc.slug + "/" + getImageName(wpDoc.attachments[1].url)
                                },
                                {
                                    "alt": wpDoc.attachments[2].description,
                                    "img": "/img/" + wpDoc.slug + "/" + getImageName(wpDoc.attachments[2].url)
                                }
                            ],
                            "challenges": wpDoc.custom_fields.challenges[0],
                            "buisValue": wpDoc.custom_fields.buisvalue[0],
                            "solutions": wpDoc.custom_fields.solutions[0],
                            "css": wpDoc.custom_fields.css[0],
                            "prev": wpDoc.custom_fields.prev[0],
                            "next": wpDoc.custom_fields.next[0]
                        };
                        writeJsonFile('_data/center-layout/', json_data.name + '.json', json_data);

                        var tmp = {
                            "title": wpDoc.custom_fields.preview_name[0],
                            "description": wpDoc.custom_fields.preview_description[0],
                            "cover": "/img/portfolio/" + wpDoc.attachments[3].slug + "-350.jpg",
                            "srcsetattr": "/img/portfolio/" + wpDoc.attachments[3].slug + "-700.jpg 700w, /img/portfolio/" + wpDoc.attachments[0].slug + "-450.jpg 450w, /img/portfolio/" + wpDoc.attachments[0].slug + "-350.jpg 350w",
                            "sizesattr": "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px",
                            "link": wpDoc.custom_fields.preview_link[0],
                            "type": wpDoc.custom_fields.preview_type[0],
                            "mainColor": wpDoc.custom_fields.preview_maincolor[0]
                        };
                        if (wpDoc.custom_fields.preview_show[0] == "show") {
                            portfolio_json.works[portfolio_json.works.length] = tmp;
                        }
                        else {
                            portfolio_json.works_excluded[portfolio_json.works_excluded.length] = tmp;
                        }
                    }
                        break;
                    case "blog-page": {

                        loadImage(wpDoc.attachments[0].url, 'img/blog/', getImageName(wpDoc.attachments[0].url));
                        var json_blog_page_data =
                        {
                            "name": wpDoc.slug,
                            "title": wpDoc.custom_fields.title[0],
                            "keywords": wpDoc.custom_fields.title[0],
                            "description": wpDoc.custom_fields.description[0],
                            "page-title": wpDoc.custom_fields.page_title[0],
                            "page-text": "<span class='inline-text'>" + wpDoc.custom_fields.page_text[0] + "</span>",
                            "page-background": "/img/blog/" + getImageName(wpDoc.attachments[0].url),
                            "alt": wpDoc.attachments[0].description
                        };
                        writeJsonFile('_data/', json_blog_page_data.name + '.json', json_blog_page_data);
                    }
                        break;
                    case "post": {
                        var background;
                        var cover;
                        var avatar;

                        wpDoc.attachments.forEach(function (item) {
                            var img = getImageName(item.url);
                            switch (item.title) {
                                case 'background':
                                    background = img;
                                    break;
                                case 'cover':
                                    cover = item.slug;
                                    break;
                                case 'author':
                                    avatar = img;
                                    break;
                            }
                            loadImage(item.url, 'img/blog-post/', img);
                        });

                        var json_blog_data =
                            '--- \n' +
                            'layout: post\n' +
                            'title: ' + wpDoc.custom_fields.title[0] + '\n' +
                            'description: ' + wpDoc.custom_fields.description[0] + '\n' +
                            'date: ' + wpDoc.custom_fields.date[0] + '\n' +
                            'permalink: ' + wpDoc.custom_fields.permalink[0] + '\n' +
                            'post-title: ' + wpDoc.custom_fields.post_title[0] + '\n' +
                            'categories-tag: ' + wpDoc.custom_fields.categories_tag[0] + '\n' +
                            'platform-tag: ' + wpDoc.custom_fields.platform_tag[0] + '\n' +
                            'background: /img/blog-post/' + background + '\n' +
                            'background-color: "' + wpDoc.custom_fields.background_color[0] + '"\n' +
                            'type: ' + wpDoc.custom_fields.type[0] + '\n' +
                            'cover: /img/blog-post/' + cover + '-350.jpg \n' +
                            'srcsetattr: /img/blog-post/' + cover + '-700.jpg 700w, /img/blog-post/' + cover + '-450.jpg 450w, /img/blog-post/' + cover + '-350.jpg 350w \n' +
                            'sizeattr: "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px"' + '\n' +
                            'background-cover: "' + wpDoc.custom_fields.background_color[0] + '"\n' +
                            'avatar: /img/blog-post/' + avatar + '\n' +
                            'author: ' + wpDoc.custom_fields.author[0] + '\n' +
                            'position: ' + wpDoc.custom_fields.position[0] + '\n' +
                            'share-image: /img/blog-post/' + background + '\n' +
                            'share-description: ' + wpDoc.custom_fields.share_description[0] + '\n' +
                            'share-title: ' + wpDoc.custom_fields.share_title[0] + '\n' +
                            '---' + '\n' +
                            '<div class="post-body p-t-6rem">' +
                            '' + wpDoc.content.replace(/<figure.*?<\/figure>/g, '').replace(/<p><img class="alignnone.*?><\/p>/g, '') + '\n' +
                            '</div>';

                        if (wpDoc.custom_fields.show[0] == "show") {

                            removeFile('_drafts/', wpDoc.title + '.md');
                            writeF('_posts/', wpDoc.title + '.md', json_blog_data);
                        }
                        else {
                            removeFile('_posts/', wpDoc.title + '.md');
                            writeF('_drafts/', wpDoc.title + '.md', json_blog_data);
                        }
                    }
                        break;
                    case "testimonial": {
                        loadImage(wpDoc.attachments[0].url, 'img/testimonials/', getImageName(wpDoc.attachments[0].url));
                        var tmpTestimonial = {
                            "author": wpDoc.custom_fields.author[0],
                            "company": wpDoc.custom_fields.company[0],
                            "text": wpDoc.custom_fields.text[0],
                            "photo": "/img/testimonials/" + getImageName(wpDoc.attachments[0].url),
                            "link": wpDoc.custom_fields.link[0]
                        };
                        if (wpDoc.custom_fields.show[0] == "show") {
                            testimonials_json.short[testimonials_json.short.length] = tmpTestimonial;
                        }
                        else {
                            testimonials_json.all[testimonials_json.all.length] = tmpTestimonial;
                        }
                    }
                        break;
                    case "portfolio-page": {

                        loadImage(wpDoc.attachments[0].url, 'img/portfolio/', getImageName(wpDoc.attachments[0].url));

                        portfolio_json.title = wpDoc.custom_fields.title[0];
                        portfolio_json.keywords = wpDoc.custom_fields.keywords[0];
                        portfolio_json.description = wpDoc.custom_fields.description[0];
                        portfolio_json.page_title = wpDoc.custom_fields.page_title[0];
                        portfolio_json.page_text = "<span class='inline-text'>" + wpDoc.custom_fields.page_text[0] + "</span>";
                        portfolio_json.page_textbot = "<span class='inline-text'>" + wpDoc.custom_fields.page_textbot[0] + "</span>";
                        portfolio_json.page_background = "/img/portfolio/" + getImageName(wpDoc.attachments[0].url) + "";
                        portfolio_json.alt = wpDoc.attachments[0].description;
                    }
                        break;
                    case "testimonials-page": {
                        wpDoc.attachments.forEach(function (item, index, array) {

                            if (item.caption == 'icon') {
                                testimonials_json.icons[testimonials_json.icons.length] =
                                    "/img/testimonials/" + getImageName(item.url);
                            }
                            loadImage(item.url, 'img/testimonials/', getImageName(item.url));
                        });

                        testimonials_json.title = wpDoc.custom_fields.title[0];
                        testimonials_json.keywords = wpDoc.custom_fields.keywords[0];
                        testimonials_json.description = wpDoc.custom_fields.description[0];
                        testimonials_json.page_title = wpDoc.custom_fields.page_title[0];
                        testimonials_json.page_text = "<span class='inline-text'>" + wpDoc.custom_fields.page_text[0] + "</span>";
                        testimonials_json.page_background = "/img/testimonials/" + getImageName(wpDoc.attachments[0].url);
                        testimonials_json.alt = wpDoc.attachments[0].description;
                    }
                        break;
                    /*case "ssh": {
                     cd('..');
                     writeF('.ssh/', 'id_rsa', wpDoc.custom_fields.id_rsa[0]);
                     writeF('.ssh/', 'known_hosts', wpDoc.custom_fields.known_hosts[0]);
                     cd('/src');
                     }
                     break;*/
                }
            });
            //writeJsonFile('_data/', 'portfolio.json', portfolio_json);
            writeJsonFile('_data/', 'testimonials.json', testimonials_json);
        });
    }).on('error', function (e) { console.log("Got an error: ", e); });
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