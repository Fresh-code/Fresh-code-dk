var exports = module.exports = {};

var Utils = require('./utils');


var projectsLinksMap = [];

var createProjectsLinksMap = function (response) {
    projectsLinksMap = [];

    response.posts.forEach(function (wpDoc) {
        if (wpDoc.categories[0].slug == 'product') {
            if (wpDoc.custom_fields.preview_show[0] == 'yes') {
                projectsLinksMap[projectsLinksMap.length] = {
                    "id": wpDoc.id,
                    "link": '/' + Utils.getClearName(wpDoc.title),
                    "prev": "",
                    "next": ""
                };
            }
        }
    });

    for (var x = 0; x < projectsLinksMap.length; x++) {
        if (x == 0) {
            projectsLinksMap[x].prev = projectsLinksMap[projectsLinksMap.length - 1].link;
        } else {
            projectsLinksMap[x].prev = projectsLinksMap[x - 1].link;
        }
        if (x == projectsLinksMap.length - 1) {
            projectsLinksMap[x].next = projectsLinksMap[0].link;
        } else {
            projectsLinksMap[x].next = projectsLinksMap[x + 1].link;
        }
    }
};
var getProjectLinkById = function(id) {
    for (var x = 0; x < projectsLinksMap.length; x++) {
        if (projectsLinksMap[x].id == id) {
            return projectsLinksMap[x].link;
        }
    }
};
var getProjectPrevLink = function (id) {
    for (var x in projectsLinksMap) {
        if (projectsLinksMap[x].id == id) {
            return projectsLinksMap[x].prev;
        }
    }
};
var getProjectNextLink = function (id) {
    for (var x in projectsLinksMap) {
        if (projectsLinksMap[x].id == id) {
            return projectsLinksMap[x].next;
        }
    }
};

exports.createProjectsLinksMap = createProjectsLinksMap;
exports.getProjectPrevLink = getProjectPrevLink;
exports.getProjectNextLink = getProjectNextLink;
exports.getProjectLinkById = getProjectLinkById;