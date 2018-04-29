var domParser = require('cheerio');
var request = require('request');
var fs = require('fs');

var nrUtility = {};

var on_baseURL = "http://onlinenovelreader.com/";
nrUtility.on_novelList = on_baseURL + "novel-list";
nrUtility.on_latestUpdate = on_baseURL + "latest-updates";
nrUtility.on_topList = on_baseURL + "top-novel";
// var on_topRated = on_baseURL + "?change_type=top_rated";
nrUtility.chpaters = on_baseURL;

//Novel Object: Definition
nrUtility.novelObject = function () {
    /*this.name = '';
    this.author = '';
    this.artist = '';
    this.status = '';
    this.type = '';
    this.identifier = '';
    this.image = '';
    this.rating = '';
    this.lastUpdate = '';
    this.genres = '';
    this.views = '';

    this.summary = '';
    this.chapters = '';

    this.shortTitle = '';
    this.shortTitle = '';
    */
};

//Is running in Debug mode
nrUtility.isDebugMode = function () {
    return typeof v8debug === 'object';
};

//String Encoding
var encode = function (string) {
    return Buffer.from(string.replace(on_baseURL, "")).toString('base64');
};
//String Decoding
nrUtility.decode = function (string) {
    return Buffer.from(string, 'base64').toString('utf8');

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
//All available novels
nrUtility.parse_OnlineNovelReader_allList = function (html) {

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
                        obj.type = $(ratingBox).text().toString();
                    }
                });
            }
            //For Views count
            else if ($(el).attr('class') === 'pop-genres') {
                var viewCount = $(this).text().toString();
                viewCount = viewCount.replace("Views:", "").trim();
                obj.views = viewCount;
            }

            return el;
        });
    }

    $('div.list-by-word-body').each(function(i, ulResult) {

        $(ulResult).children().filter(function(i, liResult) {

            $(liResult).children().filter(function(i, obj) {

                var object = new nrUtility.novelObject();

                $(obj).children().filter(function(i, el) {

                    var hrefValue = $(el).attr('href');
                    if (hrefValue) {
                        object.identifier = encode(hrefValue);
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
nrUtility.mock_OnlineNovelReader_allList = function (next) {

    fs.readFile('./private/demopages/onlinenovelreader_novellist.html', 'utf8', function (err,data) {

        if (err) {
            debug(err);
            next( { error: 'Not able to find the keyword' } );
        }

        var novelListPage = nrUtility.parse_OnlineNovelReader_allList(data);

        if (novelListPage.length === 0) {
            next( { error: 'Not able to find the keyword' } );
        }
        else {
            next(novelListPage);
        }
    });
};

//Top NovelList
nrUtility.parse_OnlineNovelReader_topNovelList = function (html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

    var novels = [];

    $('div.top-novel-block').each(function (i, novelElement) {

        $(novelElement).children().filter(function(i, liResult) {

            if ($(liResult).hasClass('top-novel-header')) {
                    console.log($(liResult));
            }
            else if ($(liResult).hasClass('top-novel-content')) {
                console.log($(liResult));
            }
        });
    });

    return novels;
};
nrUtility.mock_OnlineNovelReader_topNovelList = function (next) {

    fs.readFile('./private/demopages/onlinenovelreader_topNovel.html', 'utf8', function (err,data) {

        if (err) {
            debug(err);
            next( { error: 'Not able to find the keyword' } );
        }

        var novelListPage = nrUtility.parse_OnlineNovelReader_topNovelList(data);

        if (novelListPage.length === 0) {
            next( { error: 'Not able to find the keyword' } );
        }
        else {
            next(novelListPage);
        }
    });
};

//Latest NovelList
nrUtility.parse_OnlineNovelReader_recentNovelList = function (html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

    var novels = [];

    $('div.list-by-word-body').each(function (i, novelElement) {

        $(novelElement).children().filter(function(i, liResult) {

            $(liResult).children().filter(function(i, obj) {

                var object = new nrUtility.novelObject();

                $(obj).children().filter(function(i, novel) {

                    var hrefValue = $(novel).attr('href');
                    if (hrefValue) {
                        object.identifier = encode(hrefValue);
                        object.name = $(this).text().toString();
                    }
                    else if ($(this).hasClass('list_chapter_date')) {
                        object.lastUpdate = $(this).text().toString();
                    }
                });

                if (object.hasOwnProperty('identifier') && object.identifier.length > 0) {
                    novels.push(object);
                }
            });
        });
    });

    return novels;
};
nrUtility.mock_OnlineNovelReader_recentNovelList = function (next) {

    fs.readFile('./private/demopages/onlinenovelreader_recentList.html', 'utf8', function (err,data) {

        if (err) {
            debug(err);
            next( { error: 'Not able to find the keyword' } );
        }

        var novelListPage = nrUtility.parse_OnlineNovelReader_recentNovelList(data);

        if (novelListPage.length === 0) {
            next( { error: 'Not able to find the keyword' } );
        }
        else {
            next(novelListPage);
        }
    });
};

//Chapters-list
nrUtility.parse_OnlineNovelReader_chaptersList = function (html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

    var novels = new nrUtility.novelObject();
    novels.chapters = [];

    //Novel Name
    $('div.block-title').each(function (i, titleElement) {
        $(titleElement).children().filter(function(i, liResult) {
            var name = $(liResult).text().toString();
            if (liResult.name === 'h1' && name !== '' ){
                novels.name = name;
            }
        });
    });

    //Novel Cover
    $('div.novel-cover').each(function (i, coverElement) {
        $(coverElement).children().filter(function(i, liResult) {
            if (liResult.name === 'a'){
                $(liResult).children().filter(function(i, cover) {
                    //Cover URL
                    var hrefValue = $(this).attr('src');
                    if (hrefValue) {
                        novels.image = hrefValue;
                    }
                });
            }
        });
    });

    //Novel Chapters
    $('ul.chapter-chs').each(function (i, novelElement) {
        $(novelElement).children().filter(function(i, liResult) {
            var object = new nrUtility.novelObject();
            $(liResult).children().filter(function(i, obj) {

                var hrefValue = $(this).attr('href');
                if (hrefValue) {
                    //Chapter URL
                    object.identifier = encode(hrefValue);
                    //Chapter Name
                    object.name = $(this).text().toString();
                    novels.chapters.push(object);
                }
            });
        });
    });

    return novels;
};
nrUtility.mock_OnlineNovelReader_chaptersList = function (next) {

    fs.readFile('./private/demopages/onlinenovelreader_fetchNovelChapters.html', 'utf8', function (err,data) {

        if (err) {
            debug(err);
            next( { error: 'Not able to find the keyword' } );
        }

        var novelListPage = nrUtility.parse_OnlineNovelReader_chaptersList(data);

        if (novelListPage.length === 0) {
            next( { error: 'Not able to find the keyword' } );
        }
        else {
            next(novelListPage);
        }
    });
};

//Chapter
nrUtility.parse_OnlineNovelReader_chapter = function (html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

    var novelChapter = new nrUtility.novelObject();
    var content = '';

    $('div.chapter-content3').each(function (i, novelElement) {

        $(novelElement).children().filter(function(i, liResult) {

            $(liResult).children().filter(function(i, obj) {

                if (obj.name === 'h3') {
                    novelChapter.shortTitle = $(obj).text().toString();
                }
                else if (obj.name === 'p') {
                    content = content + '<p>' + $(obj).text().toString() + '</p>';
                }

            });
        });
    });

    novelChapter.content = content;

    return novelChapter;
};
nrUtility.mock_OnlineNovelReader_chapter = function (next) {

    fs.readFile('./private/demopages/onlinenovelreader_chapter.html', 'utf8', function (err,data) {

        if (err) {
            debug(err);
            next( { error: 'Not able to find the keyword' } );
        }

        var novelListPage = nrUtility.parse_OnlineNovelReader_chapter(data);

        if (novelListPage.length === 0) {
            next( { error: 'Not able to find the keyword' } );
        }
        else {
            next(novelListPage);
        }
    });
};

/*
//UNUSED
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
            object.identifier = $(element).attr('href');

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
*/
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