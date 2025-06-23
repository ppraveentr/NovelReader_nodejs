var fs = require('fs');
var novelParser;
novelParser = require('./onlineNovelParser');

var mock_nrUtility = {};

// URL: https://novelfull.net
var parseNovelList = function (file, next) {

    fs.readFile(file, 'utf8', function (err, data) {

        if (err) {
            next({error: 'Not able to find the keyword'});
            return;
        }

        var novelListPage = novelParser.parse_novel_list(data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            next({response: novelListPage});
        }
    });
};

// All available novels
mock_nrUtility.on_fetchCompletedNovelList = function (query, next) {
    parseNovelList('./private/demopages/novellist.html', next);
};

// Top NovelList
mock_nrUtility.on_fetchTopNovelList = function (query, next) {
    parseNovelList('./private/demopages/novellist.html', next);
};

// Latest NovelList
mock_nrUtility.on_fetchRecentNovelList = function (query, next) {
    parseNovelList('./private/demopages/novellist.html', next);
};

// Novel Details
mock_nrUtility.on_fetchNovelDetails = function (identifier, page, next) {

    fs.readFile('./private/demopages/novelDetails.html', 'utf8', function (err, data) {

        if (err) {
            //debug(err);
            next({error: 'Not able to find the keyword'});
            return;
        }

        var novelListPage = novelParser.parse_novel_details(identifier, data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            return next({response: novelListPage});
        }
    });
};

// Novel Chapter List
mock_nrUtility.on_fetchChapterList = function (identifier, page, next) {

    fs.readFile('./private/demopages/novelDetails.html', 'utf8', function (err, data) {

        if (err) {
            //debug(err);
            next({error: 'Not able to find the chapters'});
            return;
        }

        var novelChapterList = novelParser.parse_novel_chapter_list(identifier, page, data);

        if (novelChapterList.length === 0) {
            next({error: 'Not able to find the chapters'});
        }
        else {
            return next({response: novelChapterList});
        }
    });
};

// Chapter
mock_nrUtility.on_fetchChapter = function (identifier, next) {

    fs.readFile('./private/demopages/novelChapter.html', 'utf8', function (err, data) {

        if (err) {
            next({error: 'Not able to find the keyword'});
            return;
        }

        var novelListPage = novelParser.parse_novel_chapter(identifier, data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            return next({response: novelListPage});
        }
    });
};

// searchFilter
mock_nrUtility.on_searchFilter = function (next) {

    fs.readFile('./private/demopages/onlinenovelreader_detailed_search.html', 'utf8', function (err, data) {

        if (err) {
            next({error: 'Not able to find the filter'});
            return;
        }

        var filter = novelParser.parse_OnlineNovelReader_searchFilter(data);

        if (filter.length === 0) {
            next({error: 'Not able to find the filter'});
        }
        else {
            return next( {response: filter} );
        }
    });
};

// Search
mock_nrUtility.on_searchNovel = function (searchQuery, next) {

    fs.readFile('./private/demopages/onlinenovelreader_detailed_search.html', 'utf8', function (err, data) {

        if (err) {
            next({error: 'Not able to find the keyword'});
            return;
        }

        var novelListPage = novelParser.parse_OnlineNovelReader_search(data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            return next({response: novelListPage});
        }
    });
};

module.exports = mock_nrUtility;
