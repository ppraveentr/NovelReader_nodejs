var fs = require('fs');
var novelParser;
novelParser = require('./onlineNovelParser');

var mock_nrUtility = {};

// URL: http://onlinenovelreader.com
// All available novels
mock_nrUtility.on_fetchNovelList = function (next) {

    fs.readFile('./private/demopages/onlinenovelreader_novellist.html', 'utf8', function (err, data) {

        if (err) {
            //debug(err);
            next({error: 'Not able to find the keyword'});
        }

        var novelListPage = novelParser.parse_OnlineNovelReader_allList(data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            next({response: novelListPage});
        }
    });
};

// Top NovelList
mock_nrUtility.on_fetchTopNovelList = function (next) {

    fs.readFile('./private/demopages/onlinenovelreader_topNovel.html', 'utf8', function (err, data) {

        if (err) {
            //debug(err);
            next({error: 'Not able to find the keyword'});
        }

        var novelListPage = novelParser.parse_OnlineNovelReader_topNovelList(data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            next({response: novelListPage});
        }
    });
};

// Latest NovelList
mock_nrUtility.on_fetchRecentNovelList = function (next) {

    fs.readFile('./private/demopages/onlinenovelreader_recentList.html', 'utf8', function (err, data) {

        if (err) {
            //debug(err);
            next({error: 'Not able to find the keyword'});
        }

        var novelListPage = novelParser.parse_OnlineNovelReader_recentNovelList(data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            next({response: novelListPage});
        }
    });
};

// Chapters-list
mock_nrUtility.on_fetchChaptersList = function (novelName, next) {

    fs.readFile('./private/demopages/onlinenovelreader_fetchNovelChapters.html', 'utf8', function (err, data) {

        if (err) {
            //debug(err);
            next({error: 'Not able to find the keyword'});
        }

        var novelListPage = novelParser.parse_OnlineNovelReader_chaptersList(data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            return next({response: novelListPage});
        }
    });
};

// Chapter
mock_nrUtility.on_fetchChapter = function (novelName, next) {

    fs.readFile('./private/demopages/onlinenovelreader_chapter.html', 'utf8', function (err, data) {

        if (err) {
            //debug(err);
            next({error: 'Not able to find the keyword'});
        }

        var novelListPage = novelParser.parse_OnlineNovelReader_chapter(data);

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
            //debug(err);
            next({error: 'Not able to find the filter'});
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
            //debug(err);
            next({error: 'Not able to find the keyword'});
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

/*
//UNUSED
//URL: http://novelonlinefree.info
nrUtility.mock_NovelOnlineFreeList = function (next) {

    fs.readFile('./private/demopages/Novellist.html', 'utf8', function (err,data) {

        if (err) {
            debug(err);
            next( { error: 'Not able to find the keyword' } );
        }

        var novelList = nrUtility.parse_NovelOnlineFreeList(data);

        if (novelList.length === 0) {
            next( { error: 'Not able to find the keyword' } );
        }
        else {
            next(novelList);
        }
    });
};
*/

module.exports = mock_nrUtility;
