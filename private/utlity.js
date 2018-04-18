var nrUtility = require("novelReaderParserUtility");

var novelListRequest = nrUtility.nr_novelListRequest;

var baseNovelURL = 'http://novelonlinefree.com/';
var novel_list = baseNovelURL + 'novel_list?';
var novel_search = baseNovelURL + 'getsearchstory?';
var recentUpdates = baseNovelURL + 'json_tooltips_home';

var nutility = {};

//http://novelonlinefree.com/novel_list?type=topview&category=all&state=all&page=1
//type= latest | newest | topview
//state= ongoing | completed | all
//category= all

//Filter Novel
function generateNovelListURI(options) {

    var str = 'type=';
    str += (options.type === undefined || options.type === null) ? 'topview' : options.type;

    str += '&category=';
    str += (options.category === undefined || options.category === null) ? 'all' : options.category;

    str += '&state=';
    str += (options.state === undefined || options.state === null) ? 'all' : options.state;

    str += '&page=';
    str += (options.page === undefined || options.page === null) ? '1' : options.page;

    return str;
}

nutility.fetchNovelList = function (options, next) {

    var url = novel_list + generateNovelListURI(options);

    novelListRequest.get({url: url}, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var novelList = parseNovelList(body);

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

//Latest Updates
nutility.fetchRecentUpdates = function (next) {

    novelListRequest.get({url: recentUpdates}, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            next(body);
        }else{
            next( { error: 'Not able to fetch recent update list' } );
        }
    });
};

function generateSearchURI(q) {
    var  searchKeyword = nrUtility.normalize_searchString(q);
    return 'searchword=' + searchKeyword;
}

nutility.search_novel = function (q, next) {

    var url = novel_search + generateSearchURI(q);

    novelListRequest.get({url: url}, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            next(body);
        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

module.exports = nutility;