var nrUtility = require('./onlineNovelParser');

var onUtility = {};

onUtility.on_fetchNovelList = function (next) {

    nrUtility.nr_novelListRequest.get({url: nrUtility.on_novelList}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReader_allList(body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the keyword' } );
            }
            else {
                next( { response: novelList } );
            }

        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

onUtility.on_fetchRecentNovelList = function (next) {

    nrUtility.nr_novelListRequest.get({url: nrUtility.on_latestUpdate}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReader_recentNovelList(body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the keyword' } );
            }
            else {
                next( { response: novelList } );
            }

        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

onUtility.on_fetchTopNovelList = function (next) {

    nrUtility.nr_novelListRequest.get({url: nrUtility.on_topList}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReader_topNovelList(body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the keyword' } );
            }
            else {
                next( { response: novelList } );
            }

        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

onUtility.on_fetchChaptersList = function (novelName, next) {

    nrUtility.nr_novelListRequest.get({url: nrUtility.chpaters + nrUtility.decode(novelName)}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReader_chaptersList(body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the keyword' } );
            }
            else {
                next( { response: novelList } );
            }

        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

onUtility.on_fetchChapter = function (novelName, next) {

    nrUtility.nr_novelListRequest.get({url: nrUtility.chpaters + nrUtility.decode(novelName)}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReader_chapter(body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the keyword' } );
            }
            else {
                next( { response: novelList } );
            }

        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

onUtility.on_searchNovel = function (searchQuery, next) {

    // var requestBody = {
    //     url: nrUtility.on_search,
    //     form: { search: '1', keyword: 'Sovereign Soaring The' }
    // };

    var requestBody = {
        url: nrUtility.on_search,
        form: searchQuery
    };

    nrUtility.nr_postRequest.post(requestBody, function (error, response, body) {
        console.log(body);

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReader_search(body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the keyword', status: 'ok' } );
            }
            else {
                next( { response: novelList } );
            }

        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

module.exports = onUtility;