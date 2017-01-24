var exports = module.exports = {};

var jsonfile = require('jsonfile');
var ConfigJson = require('../dataModels/config.json');
var Utils = require('../utils/utils.js');


var previousSiteState = jsonfile.readFileSync(__dirname + ConfigJson.PATH_TO_PREV_STATE);
var deletedIds = [];

var stateInit = function () {
    deletedIds = [];
    previousSiteState.forEach(function (item) {
        deletedIds.push(item.id);
    });
};
var getState = function (id) {
    deletedIds.splice(deletedIds.indexOf(id), 1);

    for (var i = 0; i < previousSiteState.length; i++) {
        if (typeof previousSiteState[i].id == 'number' && previousSiteState[i].id == id) {
            return previousSiteState[i];
        }
    }
    return false;
};
var createNewState = function (id, type, name, modified) {
    if (type == "product") {
        previousSiteState[previousSiteState.length] = {
            num: previousSiteState.length,
            id: id,
            type: type,
            fileName: name + '.json',
            htmlFileName: name + '.html',
            modified: modified
        };
    } else {
        previousSiteState[previousSiteState.length] = {
            num: previousSiteState.length,
            id: id,
            type: type,
            fileName: name + '.json',
            modified: modified
        };
    }
    return previousSiteState[previousSiteState.length - 1];
};
var updateState = function (state) {
    previousSiteState[state.num] = state;
};
var writeState = function () {
    Utils.writeJsonFile(ConfigJson.PATH_TO_WP_JSON_DATA, 'bd.json', previousSiteState);
};
var deleteIds = function () {
    console.log(deletedIds);
    console.log(previousSiteState);
    deletedIds.forEach(function (id) {
        previousSiteState.forEach(function (dbKey, index) {
            if (dbKey.id == id) {
                switch (dbKey.type) {
                    case "product": {
                        Utils.removeFile(ConfigJson.PATH_TO_JSON_PROJECTS, dbKey.fileName, true);
                        Utils.removeFile(ConfigJson.PATH_TO_HTML_PROJECTS, dbKey.htmlFileName, true);
                        Utils.removeDir(__dirname + '/../../../wp-data/img/' + dbKey.fileName.replace(/\..*/, ''));
                        Utils.removeDir(__dirname + '/../../../img/' + dbKey.fileName.replace(/\..*/, ''));
                        previousSiteState.splice(index, 1);
                    }
                        break;
                    case "post": {
                        Utils.removeFile('wp-data/_posts/', dbKey.fileName);
                        Utils.removePostImages(id);
                        previousSiteState.splice(index, 1);
                    }
                        break;
                    case "testimonial": {
                        Utils.removeFile('wp-data/img/testimonials/', 'testimonial_author_' + id + '*');
                        previousSiteState.splice(index, 1);
                    }
                        break;
                }
            }
        });
    });
    writeState();
};


exports.stateInit = stateInit;
exports.getState = getState;
exports.createNewState = createNewState;
exports.updateState = updateState;
exports.deleteIds = deleteIds;
