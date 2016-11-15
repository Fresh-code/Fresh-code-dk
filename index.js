var path = require("path");
var http = require('http');
var fs = require('fs');
var request = require('request');
var jsonfile = require('jsonfile');
var url = 'http://192.168.1.142:8000/?json=get_posts';


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


http.get(url, function (res) {
    var body = '';
    res.on('data', function (chunk) {
        body += chunk;
    });
    res.on('end', function () {
        var response = JSON.parse(body);
        for (var i = 0; i < response.posts.length; i++) {
            switch (response.posts[i].categories[0].slug) {
                case "blog-page": {
                    var backgruond;
                    var cover;
                    var avatar;

                    for(var q=0; q<response.posts[i].attachments.length; q++){
                        switch(q){
                            case 0: backgruond = response.posts[i].attachments[q].url.replace(/(.*)\/(.*)/g, '$2');
                            case 1: cover = response.posts[i].attachments[q].slug;
                            case 2: avatar = response.posts[i].attachments[q].url.replace(/(.*)\/(.*)/g, '$2');
                        }

                       /* request(response.posts[i].attachments[q].url).pipe(
                            fs.createWriteStream('img/blog-post/' + response.posts[i].attachments[q].url.replace(/(.*)\/(.*)/g, '$2')));*/
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
                        'background: /img/blog-post/' + backgruond +'\n'+
                        'background-color: ' + response.posts[i].custom_fields.background_color[0] + '\n' +
                        'type: ' + response.posts[i].custom_fields.type[0] + '\n' +
                        'cover: /img/blog-post/' + cover + '-350.jpg \n' +
                        'srcsetattr: /img/blog-post/' + cover + '-700.jpg 700w, /img/blog-post/' + cover  +'-450.jpg 450w, /img/blog-post/' + cover + '-350.jpg 350w \n' +
                        'sizeattr: "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px"' + '\n' +
                        'background-cover: ' + response.posts[i].custom_fields.background_color[0] + '\n' +
                        'avatar: /img/blog-post/' + avatar +'\n' +
                        'author: ' + response.posts[i].custom_fields.author[0] + '\n' +
                        'position: ' + response.posts[i].custom_fields.position[0] + '\n' +
                        'share-image: /img/blog-post/' + backgruond + '\n' +
                        'share-description: ' + response.posts[i].custom_fields.share_description[0] + '\n' +
                        'share-title: ' + response.posts[i].custom_fields.share_title[0] + '\n' +
                        '---' + '\n' +
                        '<div class="post-body p-t-6rem">' +
                        '' + response.posts[i].content.replace(/<figure.*?<\/figure>/g,'').replace(/<p><img class="alignnone.*?><\/p>/g,'') + '\n' +
                        '</div>';

                   /* fs.writeFile('_posts/' + response.posts[i].slug + '.md', json_blog_data, function (err) {
                        if (err) { console.log(err); } else { console.log('file .md saved.'); }
                    });*/
                }
                break;

                case "work": {

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
                                "img": "/img/" + response.posts[i].slug + "/" + response.posts[i].attachments[0].caption
                            },
                            {
                                "alt": response.posts[i].attachments[1].description,
                                "img": "/img/" + response.posts[i].slug + "/" + response.posts[i].attachments[1].caption
                            },
                            {
                                "alt": response.posts[i].attachments[2].description,
                                "img": "/img/" + response.posts[i].slug + "/" + response.posts[i].attachments[2].caption
                            }
                        ],
                        "challenges": response.posts[i].custom_fields.challenges[0],
                        "buisValue": response.posts[i].custom_fields.buisvalue[0],
                        "solutions": response.posts[i].custom_fields.solutions[0],
                        "css": response.posts[i].custom_fields.css[0],
                        "prev": response.posts[i].custom_fields.prev[0],
                        "next": response.posts[i].custom_fields.next[0]
                    };

                  /*  jsonfile.writeFile('_data/center-layout/' + json_data.name + '.json', json_data, {spaces: 2}, function (err) {
                        if(err){ console.error(err); }
                        else{ console.log('file ' + json_data.name + '.json saved.'); }
                    });*/
                }
                break;

                //не хватает  кучи логики с картинками
                case "portfolio-page": {
                    for(var jp=0; jp<response.posts[i].attachments.length; jp++){
                        request(response.posts[i].attachments[jp].url).pipe(
                            fs.createWriteStream('img/portfolio/' + response.posts[i].attachments[jp].url.replace(/(.*)\/(.*)/g, '$2')));
                    }

                    switch (response.posts[i].custom_fields.visible[0]) {
                        case "page":{
                            portfolio_json.title = response.posts[i].custom_fields.title[0];
                            portfolio_json.keywords = response.posts[i].custom_fields.keywords[0];
                            portfolio_json.description = response.posts[i].custom_fields.description[0];
                            portfolio_json.page_title = response.posts[i].custom_fields.page_title[0];
                            portfolio_json.page_text = response.posts[i].custom_fields.page_text[0];
                            portfolio_json.page_textbot = response.posts[i].custom_fields.page_textbot[0];
                            portfolio_json.page_background = "/img/portfolio/" + response.posts[i].attachments[0].url.replace(/(.*)\/(.*)/g, '$2') + "";
                            portfolio_json.alt = response.posts[i].attachments[0].description;
                        }
                        break;
                        case "include":{
                            portfolio_json.works[portfolio_json.works.length] =
                            {
                                "title": response.posts[i].custom_fields.title[0],
                                "description": response.posts[i].custom_fields.description[0],
                                "cover": "/img/portfolio/" + response.posts[i].attachments[0].slug + "-350.jpg",
                                "srcsetattr": "/img/portfolio/"+ response.posts[i].attachments[0].slug + ".jpg",// +"_9p-700.jpg 700w, /img/portfolio/" + response.posts[i].attachments[0].slug +"-450.jpg 450w, /img/portfolio/" + response.posts[i].attachments[0].slug  +"-350.jpg 350w",
                                "sizesattr": "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px",
                                "link": response.posts[i].custom_fields.link[0],
                                "type": response.posts[i].custom_fields.type[0],
                                "mainColor": response.posts[i].custom_fields.maincolor[0]
                            };
                        }
                        break;
                        case "exclude":{
                            portfolio_json.works[portfolio_json.works_excluded.length] =
                            {
                                "title": response.posts[i].custom_fields.title[0],
                                "description": response.posts[i].custom_fields.description[0],
                                "cover": "/img/portfolio/" + response.posts[i].attachments[0].slug + "-350.jpg",
                                "srcsetattr": "/img/portfolio/"+ response.posts[i].attachments[0].slug  + ".jpg",//+"_9p-700.jpg 700w, /img/portfolio/" + response.posts[i].attachments[0].slug + "-450.jpg 450w, /img/portfolio/" + response.posts[i].attachments[0].slug  +"-350.jpg 350w",
                                "sizesattr": "(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px",
                                "link": response.posts[i].custom_fields.link[0],
                                "type": response.posts[i].custom_fields.type[0],
                                "mainColor": response.posts[i].custom_fields.maincolor[0]
                            };
                        }
                        break;
                    }
                }
                break;
            }

        }
       /* jsonfile.writeFile('_data/portfolio.json', portfolio_json, {spaces: 2}, function (err) {
            if(err){ console.error(err); }
            else{ console.log('file ' + portfolio_json.title + '.json saved.'); }
        });*/



    });
}).on('error', function (e) {
    console.log("Got an error: ", e);
});