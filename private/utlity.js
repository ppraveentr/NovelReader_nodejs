var request = require('request');
var domParser = require('cheerio');
// var fs = require('fs');

var baseNovelURL = 'http://novelonlinefree.com/';
var novel_list = baseNovelURL + 'novel_list?';
var novel_search = baseNovelURL + 'getsearchstory?';
var recentUpdates = baseNovelURL + 'json_tooltips_home';

var novelListRequest = request.defaults({
    method : 'GET',
    headers: {
        'content-type': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6'
    }
});

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

function parseNovelList(html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true
    });

    var novels = [];

    $('div.update_item').each(function(i, result) {

        var object = {
            name: $(result).attr('title'),
            url: '',
            image: '',
            lastChapter: [],
            updatetime: '',
            view: ''
        };

        function updateNovelURL(element) {
            if (object.name === null || object.name === undefined) {
                object.name = $(element).attr('title');
            }
            object.url = $(element).attr('href');

            $(element).children().filter(function(i, el){
                if ($(el).attr('src') !== null) {
                    object.image = $(el).attr('src');
                }
            });
        }

        function updateChapter(element) {

            var chapter = {
                name: $(element).attr('title'),
                url: $(element).attr('href')
            };

            if (object.name !== null && chapter.name !== null) {
                chapter.name = chapter.name.replace(object.name + " ", '')
            }

            object.lastChapter.push(chapter);
        }

        $(result).children().filter(function(i, el) {

            if ($(el).attr('rel') === 'nofollow') {
                updateNovelURL(el);
            }
            else if ($(el).attr('class') === 'chapter') {
                updateChapter(el);
            }
            else {

                var text = $(this).text().toString();

                if (text.indexOf('Last updated :', 0) === 0) {
                    object.updatetime = text
                }
                else if (text.indexOf('View :', 0) === 0) {
                    object.view = text
                }
            }

            return el;
        });

        novels.push(object);
    });

    return novels;
}

// nutility.mockFetchNovelList = function (next) {
//
//     fs.readFile('./private/demopages/Novellist.html', 'utf8', function (err,data) {
//
//         if (err) {
//             console.log(err);
//             next( { error: 'Not able to find the keyword' } );
//         }
//
//         var novelList = parseNovelList(data);
//
//         if (novelList.length == 0) {
//             next( { error: 'Not able to find the keyword' } );
//         }
//         else {
//             next(novelList);
//         }
//     });
// };

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

//Search Novel
nutility.normalize_searchString = function (alias) {
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, "a");
    str = str.replace(/[èéẹẻẽêềếệểễ]/g, "e");
    str = str.replace(/[ìíịỉĩ]/g, "i");
    str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, "o");
    str = str.replace(/[ùúụủũưừứựửữ]/g, "u");
    str = str.replace(/[ỳýỵỷỹ]/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|-|$|_/g, "_");
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    str = str.replace(/_+_/g, "_"); //thay thế 2_ thành 1_
    str = str.replace(/^_+|_+$/g, "");
    //cắt bỏ ký tự _ ở đầu và cuối chuỗi
    return str;
};

function generateSearchURI(q) {
    var  searchKeyword = nutility.normalize_searchString(q);
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

//Latest Updates
nutility.fetchRecentUpdates = function (next) {

    novelListRequest.get({url: recentUpdates}, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            next(body);
        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

module.exports = nutility;