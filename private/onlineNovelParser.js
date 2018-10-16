var domParser = require('cheerio');
var request = require('request');

var nrUtility = {};

var on_baseURL = "http://onlinenovelreader.com/";
nrUtility.on_novelList = on_baseURL + "novel-list";
nrUtility.on_latestUpdate = on_baseURL + "latest-updates";
nrUtility.on_topList = on_baseURL + "top-novel";
// var on_topRated = on_baseURL + "?change_type=top_rated";
nrUtility.on_search = on_baseURL + "detailed-search";
nrUtility.chpaters = on_baseURL;

// Novel Object: Definition
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

// Is running in Debug mode
nrUtility.isDebugMode = function () {
    return false;
};

// String Encoding
var encode = function (string) {
    return Buffer.from(string.replace(on_baseURL, "")).toString('base64');
};

// String Decoding
nrUtility.decode = function (string) {
    return Buffer.from(string, 'base64').toString('utf8');

};

// Novel reader, default 'request'
nrUtility.nr_novelListRequest = request.defaults({
    method : 'GET',
    headers: {
        'content-type': 'text/html',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6'
    }
});

// Novel reader, default 'request'
nrUtility.nr_postRequest = request.defaults({
    method : 'POST',
    headers: {
        "content-type": "application/x-www-form-urlencoded",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/604.5.6 (KHTML, like Gecko) Version/11.0.3 Safari/604.5.6'
    }
});

// URL: http://onlinenovelreader.com
// All available novels
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

// Top NovelList
nrUtility.parse_OnlineNovelReader_topNovelList = function (html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

    var novels = [];

    function createNovelElement(element, obj) {

        $(element).children().filter(function(i, el) {

            //Title
            if ($(this).hasClass('top-novel-header')) {
                $(this).children().filter(function(i, el) {
                    var name = $(this).text().toString();
                    if (el.name === 'h2' && name !== '' ){
                        obj.name = name;
                    }
                });
            }
            //Content
            else if ($(this).hasClass('top-novel-content')) {
                createNovelElement(this, obj);
            }
            else if ($(this).hasClass('top-novel-body')) {
                createNovelElement(this, obj);
            }
            else if ( $(this).hasClass('novel-item')) {

                $(this).children().filter(function(i, el) {
                    //Novel URL
                    var label = $(this).text().toString();
                    if (label === 'Author:') {
                        obj.author = $(this).next().text().toString()
                    }
                    else if (label === 'Artist:') {
                        obj.artist = $(this).next().text().toString()
                    }
                    else if (label === 'Status:') {
                        obj.status = $(this).next().text().toString()
                    }
                    else if (label === 'Type:') {
                        obj.type = $(this).next().text().toString()
                    }
                    else if (label === 'Genre:') {
                        obj.genres = [$(this).next().text().toString()]
                    }
                });
            }
            else if ($(this).hasClass('top-novel-cover')) {
                $(this).children().filter(function(i, el) {
                    //Novel URL
                    var hrefValue = $(this).attr('href');
                    if (hrefValue) {
                        obj.identifier = encode(hrefValue);
                    }
                    //Novel Cover Image
                    $(this).children().filter(function(i, img) {
                        var imageUrl = $(img).attr('src');
                        if (img.name === 'img' && imageUrl !== '' ){
                            obj.image = imageUrl;
                        }
                    });
                });
            }
        });
    }


    $('div.top-novel-block').each(function (i, novelElement) {

        var object = new nrUtility.novelObject();

        createNovelElement(novelElement, object);

        if (object.hasOwnProperty('name') && object.name.length > 0) {
            novels.push(object);
        }
    });

    return novels;
};

// Latest NovelList
nrUtility.parse_OnlineNovelReader_recentNovelList = function (html) {

    const $ = domParser.load(html, {
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

// Chapters-list
nrUtility.parse_OnlineNovelReader_chaptersList = function (html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

    var novels = new nrUtility.novelObject();
    novels.chapters = [];

    // Novel Name
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

// Chapter
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

// Search
nrUtility.parse_OnlineNovelReader_search = function (html) {
    var novelListPage = nrUtility.parse_OnlineNovelReader_topNovelList(html);
    return novelListPage;
};

// Search filter
nrUtility.parse_OnlineNovelReader_searchFilter = function (html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

    function filterElement(element, obj) {

        $(element).children().filter(function(i, el) {

            //Title
            if ($(this).hasClass('label')) {
                $(this).children().filter(function(i, el) {
                    var name = $(this).text().toString();
                    if (name === 'Novel Type' && name !== '' ){
                        obj.name = name;
                        obj.novelType = []
                    }
                    else if (name === 'Language' && name !== '' ){
                        obj.name = name;
                        obj.language = []
                    }
                    else if (name === 'Genre' && name !== '' ){
                        obj.name = name;
                        obj.genres = []
                    }
                    else if (name === 'Completed' && name !== '' ){
                        obj.name = name;
                        obj.completed = []
                    }
                });
            }
            // "content"
            else if ($(this).hasClass('content')) {

                $(this).children().filter(function(i, el) {
                    $(el).children().filter(function(i, el) {
                        // Type
                        var type = $(el).attr('data-value');
                        // novel type
                        if (obj.name === "Novel Type" && type !== '') {
                            var name = $(this).text().toString();
                            var novelType = {'data': type, 'type': name};
                            obj.novelType.push(novelType)
                        }
                        // Language
                        else if (obj.name === "Language" && type !== '') {
                            var name = $(this).text().toString();
                            var language = {'data': type, 'type': name};
                            obj.language.push(language)
                        }
                        // Genre
                        else if (obj.name === "Genre" && type !== '') {
                            var name = $(this).text().toString();
                            var gener = {'data': type, 'type': name};
                            obj.genres.push(gener)
                        }
                        // Completed
                        else if (obj.name === "Completed" && type !== '') {
                            var name = $(this).text().toString();
                            var completed = {'data': type, 'type': name};
                            obj.completed.push(completed)
                        }
                    });
                });
            }
        });
    }

    var object = new nrUtility.novelObject();

    $('div.filter').each(function (i, filter) {
        object.name = '';
        filterElement(filter, object);
    });

    object.name = '';

    return object;
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
