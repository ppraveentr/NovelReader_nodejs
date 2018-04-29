var nrUtility = require('../private/novelReaderParserUtility');

var onUtility = {};

onUtility.on_fetchNovelList = function (next) {

    if (nrUtility.isDebugMode){
        nrUtility.mock_OnlineNovelReader_allList(next);
        return;
    }

    nrUtility.nr_novelListRequest.get({url: nrUtility.on_novelList}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReader_allList(body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the keyword' } );
            }
            else {
                next(novelList);
            }

        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

onUtility.on_fetchRecentNovelList = function (next) {

    if (nrUtility.isDebugMode){
        nrUtility.mock_OnlineNovelReader_recentNovelList(next);
        return;
    }

    nrUtility.nr_novelListRequest.get({url: nrUtility.on_latestUpdate}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReader_recentNovelList(body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the keyword' } );
            }
            else {
                next(novelList);
            }

        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

onUtility.on_fetchTopNovelList = function (next) {

    if (nrUtility.isDebugMode){
        nrUtility.mock_OnlineNovelReader_topNovelList(next);
        return;
    }

    nrUtility.nr_novelListRequest.get({url: nrUtility.on_topList}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReader_topNovelList(body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the keyword' } );
            }
            else {
                next(novelList);
            }

        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

onUtility.on_fetchChaptersList = function (novelName, next) {

    if (nrUtility.isDebugMode){
        nrUtility.mock_OnlineNovelReader_chaptersList(next);
        return;
    }

    nrUtility.nr_novelListRequest.get({url: nrUtility.chpaters + nrUtility.decode(novelName)}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReader_chaptersList(body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the keyword' } );
            }
            else {
                next(novelList);
            }

        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

onUtility.on_fetchChapter = function (novelName, next) {

    if (nrUtility.isDebugMode){
        nrUtility.mock_OnlineNovelReader_chapter(next);
        return;
    }

    nrUtility.nr_novelListRequest.get({url: nrUtility.chpaters + nrUtility.decode(novelName)}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReader_chapter(body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the keyword' } );
            }
            else {
                next(novelList);
            }

        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

module.exports = onUtility;