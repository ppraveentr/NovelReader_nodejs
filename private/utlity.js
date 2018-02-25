var request = require('request');
var domParser = require('cheerio');

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

var listRequest = request.defaults({
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
function filterFormData(options) {
    var str = 'type=' + options.type + '&';
    str = str + 'category=' + options.category + '&';
    str = str + 'state=' + options.state + '&';
    str = str + 'page=' + options.page;
    return str;
}

function parseNovelList(html) {

    // var dom = domParser.load(html, {
    //     ignoreWhitespace: true,
    //     xmlMode: true
    // });

    var $ = domParser.load(html);

    var $fruits = $('#main_body div').each(function(i, elem) {
        var element = $(this);
        console.log(element)
    });


    var objefcts = $fruits.filter('#update_item list_category')
    console.log(objefcts);

    // $('div.wrap_update').each(function(i, element){
    //     $(this).children.filter()
    //     var a = $(this).text();
    //     console.log(a);
    // });

    return html
}

nutility.filter_novel = function (opt, next) {

    var url = novel_list + filterFormData(opt);

    searchRequest.get({url: url}, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var jsonnValue = parseNovelList(body);
            next(jsonnValue);
        }else{
            next( { error: 'Not able to find the keyword' } );
        }
    });
};

//Search Novel
nutility.nomalize_searchString = function (alias)
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
    var  searchKeyword = nutility.nomalize_searchString(q);
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