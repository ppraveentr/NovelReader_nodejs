var domParser = require('cheerio');
var request = require('request');
var fs = require('fs');

var nrUtility = {};

//Is running in Debug mode
nrUtility.isDebugMode = function () {
    return typeof v8debug === 'object';
};

//Novel reader, default 'request'
nrUtility.nr_novelListRequest = request.defaults({
    method : 'GET',
    headers: {
        'content-type': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6'
    }
});

//URL: http://onlinenovelreader.com
nrUtility.parse_OnlineNovelReaderList = function (html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

    var novels = [];

    function createNovelElement(element, obj) {

        $(element).children().filter(function(i, el) {

            if ($(el).attr('class') === 'pop-block') {
                createNovelElement(el, obj);
            }
            else if ($(el).attr('class') === 'pop-header') {
                obj.name = $(this).text().toString();
            }
            //For cover image
            else if ($(el).attr('class') === 'pop-container') {
                createNovelElement(el, obj);
            }
            //For cover image
            else if ($(el).attr('class') === 'pop-body') {
                createNovelElement(el, obj);
            }
            //For cover image
            else if ($(el).attr('class') === 'pop-cover') {
                $(el).children().filter(function(i, imgEl){
                    if ($(imgEl).attr('src') !== null) {
                        obj.image = $(imgEl).attr('src');
                    }
                });
            }
            //For cover image
            else if ($(el).attr('class') === 'pop-summary') {
                obj.summary = $(this).text().toString().trimLeft().trimRight();
            }
            //For cover image
            else if ($(el).attr('class') === 'pop-rating') {

                $(el).children().filter(function(i, ratingBox){
                    //Eg. Int Value
                    if ($(ratingBox).attr('class') === 'pop-rating-box') {
                        obj.rating = $(ratingBox).text().toString();
                    }
                    //Eg. Web novel, Light Novel
                    else if ($(ratingBox).attr('class') === 'text') {
                        obj.genres = $(ratingBox).text().toString();
                    }
                });
            }
            //For Views count
            else if ($(el).attr('class') === 'pop-genres') {
                var genres = $(this).text().toString();
                genres = genres.replace("Views:", "").trim();
                obj.views = genres;
            }

            return el;
        });
    }

    $('div.list-by-word-body').each(function(i, ulResult) {

        $(ulResult).children().filter(function(i, liResult) {

            $(liResult).children().filter(function(i, obj) {

                var object = {
                    name: '',
                    url: '',
                    summary: '',
                    image: '',
                    rating: '',
                    genres: '',
                    views: ''
                };

                $(obj).children().filter(function(i, el) {

                    var hrefValue = $(el).attr('href');
                    if (hrefValue) {
                        object.url = hrefValue;
                    }
                    else if ($(el).attr('class') === 'popover') {
                        createNovelElement(el, object);
                    }

                    return el;
                });

                novels.push(object);
            });

            return liResult;
        });

    });

    return novels;
};
nrUtility.mock_OnlineNovelReaderList = function (next) {

    fs.readFile('./private/demopages/onlinenovelreader_novellist.html', 'utf8', function (err,data) {

        if (err) {
            debug(err);
            next( { error: 'Not able to find the keyword' } );
        }

        var novelListPage = nrUtility.parse_OnlineNovelReaderList(data);

        if (novelListPage.length === 0) {
            next( { error: 'Not able to find the keyword' } );
        }
        else {
            next(novelListPage);
        }
    });
};

//URL: http://novelonlinefree.info
nrUtility.parse_NovelOnlineFreeList = function (html) {

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
};
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

//Search Novel
nrUtility.normalize_searchString = function (alias) {
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

module.exports = nrUtility;