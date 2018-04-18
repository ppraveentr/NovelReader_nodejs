var nrUtility = require('../private/novelReaderParserUtility');

var on_baseURL = "http://onlinenovelreader.com/";
var on_novelList = on_baseURL + "novel-list";
var on_latestUpdate = on_baseURL + "latest-updates";
var on_topList = on_baseURL + "top-novel";

var onUtility = {};

onUtility.on_fetchNovelList = function (next) {

    if (nrUtility.isDebugMode){
        nrUtility.mock_OnlineNovelReaderList(next);
        return;
    }

    var url = on_novelList;

    nrUtility.nr_novelListRequest.get({url: url}, function (error, response, body) {

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

module.exports = onUtility;