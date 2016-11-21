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
var writeF = function (path, filename, data) {
    fs.writeFile('' + path + filename + '.md', data, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('file .md saved.');
        }
    });
};

app.post('/build', function (req, res) {
    http.get(url, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {

            var portfolio_json =
            {
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

            var testimonials_json =
            {
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
                        //rmDir('img/' + response.posts[i].slug);
                        for (var j = 0; j < response.posts[i].attachments.length; j++) {

                            /* if(j==3){
                             request(response.posts[i].attachments[j].url).pipe(
                             fs.createWriteStream('img/portfolio/' + response.posts[i].slug + "_cover." + response.posts[i].attachments[j].url.split('.').pop()));
                             }*/
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
                            if (err) {console.error(err);}
                            else {console.log('file ' + json_data.name + '.json saved.');}
                        });


                        if(response.posts[i].custom_fields.preview_show[0] == "show"){
                            portfolio_json.works[portfolio_json.works.length] =
                            {
                                "title": response.posts[i].custom_fields.preview_name[0],
                                "description": response.posts[i].custom_fields.preview_description[0],
                                "cover": "/img/portfolio/" + response.posts[i].attachments[3].slug + "-350.jpg",
                                "srcsetattr": "/img/portfolio/"+ response.posts[i].attachments[3].slug  +"-700.jpg 700w, /img/portfolio/" + response.posts[i].attachments[0].slug +"-450.jpg 450w, /img/portfolio/" + response.posts[i].attachments[0].slug  +"-350.jpg 350w",
                                "sizesattr": "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px",
                                "link": response.posts[i].custom_fields.link[0],
                                "type": response.posts[i].custom_fields.preview_type[0],
                                "mainColor": response.posts[i].custom_fields.preview_maincolor[0]
                            };
                        }
                        else{
                            portfolio_json.works_excluded[portfolio_json.works_excluded.length] =
                            {
                                "title": response.posts[i].custom_fields.preview_name[0],
                                "description": response.posts[i].custom_fields.preview_description[0],
                                "cover": "/img/portfolio/" + response.posts[i].attachments[3].slug + "-350.jpg",
                                "srcsetattr": "/img/portfolio/"+ response.posts[i].attachments[3].slug  +"-700.jpg 700w, /img/portfolio/" + response.posts[i].attachments[0].slug +"-450.jpg 450w, /img/portfolio/" + response.posts[i].attachments[0].slug  +"-350.jpg 350w",
                                "sizesattr": "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px",
                                "link": response.posts[i].custom_fields.link[0],
                                "type": response.posts[i].custom_fields.preview_type[0],
                                "mainColor": response.posts[i].custom_fields.preview_maincolor[0]
                            };
                        }
                    }
                        break;

                    case "blog-page": {
                        //rmDir('img/blog');
                        request(response.posts[i].attachments[0].url).pipe(
                            fs.createWriteStream('img/blog/' + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2'))
                        );
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
                        jsonfile.writeFile('_data/' + json_blog_page_data.name + '.json', json_blog_page_data, {spaces: 2}, function (err) {
                            if (err) {
                                console.error(err);
                            }
                            else {
                                console.log('file ' + json_blog_page_data.name + '.json saved.');
                            }
                        });
                    }
                        break;

                    case "post": {
                        var backgruond;
                        var cover;
                        var avatar;


                        for (var q = 0; q < response.posts[i].attachments.length; q++) {
                            var img = response.posts[i].attachments[q].url.replace(/(.*)\/(.*)/g, '$2');

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

                            request(response.posts[i].attachments[q].url).pipe(
                                fs.createWriteStream('img/blog-post/' + img));
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
                            'background-color: ' + response.posts[i].custom_fields.background_color[0] + '\n' +
                            'type: ' + response.posts[i].custom_fields.type[0] + '\n' +
                            'cover: /img/blog-post/' + cover + '-350.jpg \n' +
                            'srcsetattr: /img/blog-post/' + cover + '-700.jpg 700w, /img/blog-post/' + cover + '-450.jpg 450w, /img/blog-post/' + cover + '-350.jpg 350w \n' +
                            'sizeattr: "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px"' + '\n' +
                            'background-cover: ' + response.posts[i].custom_fields.background_color[0] + '\n' +
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

                        var postName = response.posts[i].slug;

                        if (response.posts[i].custom_fields.show[0] == "show")
                        {

                            glob( '_drafts/' + response.posts[i].slug + '.md', function(err,files){
                                if (err) throw err;
                                files.forEach(function(item,index,array){
                                    console.log(item + " found");
                                });
                                files.forEach(function(item,index,array){
                                    fs.unlink(item, function(err){
                                        if (err) throw err;
                                        console.log(item + " deleted");
                                    });
                                });
                            });

                            writeF('_posts/', response.posts[i].slug, json_blog_data);
                        }
                        else
                        {
                            glob( '_posts/' + response.posts[i].slug + '.md', function(err,files){
                                if (err) throw err;
                                files.forEach(function(item,index,array){
                                    console.log(item + " found");
                                });
                                files.forEach(function(item,index,array){
                                    fs.unlink(item, function(err){
                                        if (err) throw err;
                                        console.log(item + " deleted");
                                    });
                                });
                            });

                            writeF('_drafts/', response.posts[i].slug, json_blog_data);
                        }
                    }
                        break;

                    case "testimonial": {


                        request(response.posts[i].attachments[0].url).pipe(
                            fs.createWriteStream('img/testimonials/' + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2')));

                        if(response.posts[i].custom_fields.show[0] == "show"){
                            testimonials_json.short[testimonials_json.short.length] =
                            {
                                "author": response.posts[i].custom_fields.author[0],
                                "company": response.posts[i].custom_fields.company[0],
                                "text": response.posts[i].custom_fields.text[0],
                                "photo": "/img/testimonials/" + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2'),
                                "link": response.posts[i].custom_fields.link[0]
                            };
                        }
                        else{
                            testimonials_json.all[testimonials_json.all.length] =
                            {
                                "author": response.posts[i].custom_fields.author[0],
                                "company": response.posts[i].custom_fields.company[0],
                                "text": response.posts[i].custom_fields.text[0],
                                "photo": "/img/testimonials/" + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2'),
                                "link": response.posts[i].custom_fields.link[0]
                            };
                        }

                    }
                        break;

                    case "portfolio-page": {

                        //rmDir('img/portfolio');
                        request(response.posts[i].attachments[0].url).pipe(
                            fs.createWriteStream('img/portfolio/' + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2')));

                        portfolio_json.title = response.posts[i].custom_fields.title[0];
                        portfolio_json.keywords = response.posts[i].custom_fields.keywords[0];
                        portfolio_json.description = response.posts[i].custom_fields.description[0];
                        portfolio_json.page_title = response.posts[i].custom_fields.page_title[0];
                        portfolio_json.page_text = "<span class='inline-text'>" + response.posts[i].custom_fields.page_text[0] + "</span>";
                        portfolio_json.page_textbot = "<span class='inline-text'>" + response.posts[i].custom_fields.page_textbot[0] + "</span>";
                        portfolio_json.page_background = "/img/portfolio/" + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2') + "";
                        portfolio_json.alt = response.posts[i].attachments[0].description;
                    }
                        break;

                    case "testimonials-page": {

                        for (var qq = 0; qq < response.posts[i].attachments.length; qq++) {

                            switch (response.posts[i].attachments[qq].caption) {
                             case 'icon':
                                 testimonials_json.icons[testimonials_json.icons.length] =
                                     "/img/testimonials/" + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2');
                               break;
                             }
                            request(response.posts[i].attachments[qq].url).pipe(
                                fs.createWriteStream('img/testimonials/' + response.posts[i].attachments[qq].url.replace(/(.*)\/(.*)/g, '$2')));
                        }

                        testimonials_json.title = response.posts[i].custom_fields.title[0];
                        testimonials_json.keywords = response.posts[i].custom_fields.keywords[0];
                        testimonials_json.description = response.posts[i].custom_fields.description[0];
                        testimonials_json.page_title = response.posts[i].custom_fields.page_title[0];
                        testimonials_json.page_text = "<span class='inline-text'>" + response.posts[i].custom_fields.page_text[0] + "</span>";
                        testimonials_json.page_background = "/img/testimonials/" + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2');
                        testimonials_json.alt = response.posts[i].attachments[0].description;
                    }
                        break;
                }
            }

            jsonfile.writeFile('_data/portfolio.json', portfolio_json, {spaces: 2}, function (err) {
                if(err){ console.error(err); }
                else{ console.log('file ' + portfolio_json.title + '.json saved.'); }
            });

            jsonfile.writeFile('_data/testimonials.json', testimonials_json, {spaces: 2}, function (err) {
                if(err){ console.error(err); }
                else{ console.log('file ' + testimonials_json.title + '.json saved.'); }
            });

        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/node_server_index.html'));
});

/*app.get('/push', function (req, res) {
 res.send('Trying to push!');
 exec('./git_push.sh');
 });*/

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});