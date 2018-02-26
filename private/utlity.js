var request = require('request');
var domParser = require('cheerio');
// var fs = require('fs');

var baseNovelURL = 'http://novelonlinefree.com/';
var novel_list = baseNovelURL + 'novel_list?';
var novel_search = baseNovelURL + 'getsearchstory?';

var searchRequest = request.defaults({
    url: baseNovelURL + 'getsearchstory',
    method : 'GET',
    headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6'
    }
});

var novelListRequest = request.defaults({
    url: novel_list,
    method : 'GET',
    headers: {
        'content-type': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6'
    }
});

var nutility = {};

//http://novelonlinefree.com/novel_list?type=topview&category=all&state=all&page=1
//http://novelonlinefree.com/novel_list?type=latest&category=all&state=all&page=1
//http://novelonlinefree.com/novel_list?type=newest&category=all&state=all&page=1
//http://novelonlinefree.com/novel_list?type=latest&category=all&state=completed&page=1
//http://novelonlinefree.com/novel_list?type=latest&category=all&state=ongoing&page=1

//Filter Novel
function generateNovelListURI(options) {

    var str = 'type=';
    str += (options.type === undefined || options.type === null) ? 'topview' : options.type;

    str.concat('&category=');
    str += (options.category === undefined || options.category === null) ? 'all' : options.category;

    str.concat('&state=');
    str += (options.state === undefined || options.state === null) ? 'all' : options.state;

    str.concat('&page=');
    str += (options.page === undefined || options.page === null) ? '1' : options.page;

    return str;
}

function parseNovelList(html) {

    const $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true
    });

    var novels = [];

    $('div.update_item').each(function(i, result) {

        var object = {
            title: $(result).attr('title'),
            url: '',
            imageURL: '',
            lastChapter: [],
            lastUpdated: '',
            lastViewed: ''
        };

        function updateNovelURL(element) {
            if (object.title === null || object.title === undefined) {
                object.title = $(element).attr('title');
            }
            object.url = $(element).attr('href');

            $(element).children().filter(function(i, el){
                if ($(el).attr('src') != null) {
                    object.imageURL = $(el).attr('src');
                }
            });
        }

        function updateChapter(element) {

            var chapter = {
                title: $(element).attr('title'),
                url: $(element).attr('href')
            };

            if (object.title != null && chapter.title != null) {
                chapter.title = chapter.title.replace(object.title + " ", '')
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
                    object.lastUpdated = text
                }
                else if (text.indexOf('View :', 0) === 0) {
                    object.lastViewed = text
                }
            }

            return el;
        });

        novels.push(object);
    });

    return novels;
}

nutility.fetchNovelList = function (opt, next) {

    // fs.readFile('./private/demopages/Novellist.html', 'utf8', function (err,data) {
    //
    //     if (err) {
    //         console.log(err);
    //         next( { error: 'Not able to find the keyword' } );
    //     }
    //
    //     var novelList = parseNovelList(data);
    //
    //     if (novelList.length == 0) {
    //         next( { error: 'Not able to find the keyword' } );
    //     }
    //     else {
    //         next(novelList);
    //     }
    // });

    var url = novel_list + generateNovelListURI(opt);

    novelListRequest.get({url: url}, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            var novelList = parseNovelList(body);

            if (novelList.length == 0) {
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
nutility.normalize_searchString = function (alias)
{
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|-|$|_/g, "_");
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    str = str.replace(/_+_/g, "_"); //thay thế 2_ thành 1_
    str = str.replace(/^\_+|\_+$/g, "");
    //cắt bỏ ký tự _ ở đầu và cuối chuỗi
    return str;
};

function searchFormData(q) {
    var  searchKeyword = nutility.normalize_searchString(q);
    return 'searchword=' + searchKeyword;
}

nutility.search_novel = function (q, next) {

    var url = novel_search + searchFormData(q);

    searchRequest.get({url: url}, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            next(body);
        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

module.exports = nutility;