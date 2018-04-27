var nrUtility = require('../private/novelReaderParserUtility');

var on_baseURL = "http://onlinenovelreader.com/";
var on_novelList = on_baseURL + "novel-list";
//var on_latestUpdate = on_baseURL + "latest-updates";
var on_topList = on_baseURL + "top-novel";
// var on_topRated = on_baseURL + "?change_type=top_rated";

var onUtility = {};

onUtility.on_fetchNovelList = function (next) {

    if (nrUtility.isDebugMode){
        nrUtility.mock_OnlineNovelReaderList(next);
        return;
    }

    nrUtility.nr_novelListRequest.get({url: on_novelList}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = nrUtility.parse_OnlineNovelReaderList(body);

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

    nrUtility.nr_novelListRequest.get({url: on_topList}, function (error, response, body) {

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

    nrUtility.nr_novelListRequest.get({url: on_topList}, function (error, response, body) {

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

module.exports = onUtility;