var nrUtility = require('./onlineNovelParser');

var onUtility = {};

var fetchNovelList = function (url, query, next) {

    var requestBody = nrUtility.getRequest(url, query)

    nrUtility.nr_novelListRequest.get(requestBody, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_novel_list(body);

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

onUtility.on_fetchCompletedNovelList = function (query, next) {
    fetchNovelList(nrUtility.on_completedList, query, next);
};

onUtility.on_fetchRecentNovelList = function (query, next) {
    fetchNovelList(nrUtility.on_latestUpdate, query, next);
};

onUtility.on_fetchTopNovelList = function (query, next) {
    fetchNovelList(nrUtility.on_topList, query, next);
};

onUtility.on_fetchNovelDetails = function (identifier, query, next) {

    var url = nrUtility.on_baseURL + nrUtility.decode(identifier);
    var requestBody = nrUtility.getRequest(url, query)

    nrUtility.nr_novelListRequest.get(requestBody, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_novel_details(identifier, body);

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

onUtility.on_fetchChapterList = function (identifier, query, next) {

    var url = nrUtility.on_baseURL + nrUtility.decode(identifier);
    var requestBody = nrUtility.getRequest(url, query)
    var page = query.page;

    nrUtility.nr_novelListRequest.get(requestBody, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_novel_chapter_list(identifier, page, body);

            if (novelList.length === 0) {
                next( { error: 'Not able to find the chapter list' } );
            }
            else {
                next( { response: novelList } );
            }

        }else{
            next( { error: 'Not able to find the chapter list' } );
        }
    });
};

onUtility.on_fetchChapter = function (identifier, next) {

    nrUtility.nr_novelListRequest.get({url: nrUtility.chapters + nrUtility.decode(identifier)}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_novel_chapter(identifier, body);

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
    //     form: { page: '1', keyword: 'Sovereign Soaring The' }
    // };

    var requestBody = {
        url: nrUtility.on_search,
        form: searchQuery
    };

    nrUtility.nr_postRequest.post(requestBody, function (error, response, body) {

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

onUtility.on_searchFilter = function (next) {

    nrUtility.nr_novelListRequest.get({url: nrUtility.on_search}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var filter = nrUtility.parse_OnlineNovelReader_searchFilter(body);

            if (filter.length === 0) {
                next( { error: 'Not able to find the filter' } );
            }
            else {
                next( { response: filter } );
            }

        }else{
            next( { error: 'Not able to find the filter' } );
        }
    });
};

module.exports = onUtility;
