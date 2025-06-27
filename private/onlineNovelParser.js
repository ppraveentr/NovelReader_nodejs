var domParser = require('cheerio');
var request = require('request');
var qs = require('querystring');

var nrUtility = {};

var on_baseURL = "https://novelfull.net";
nrUtility.on_baseURL = on_baseURL;
nrUtility.on_completedList = on_baseURL + "/completed-novel";
nrUtility.on_latestUpdate = on_baseURL + "/latest-release-novel";
nrUtility.on_topList = on_baseURL + "/most-popular";
nrUtility.on_search = on_baseURL + "/search";
nrUtility.chapters = on_baseURL;

// Novel Object: Definition
nrUtility.novelObject = function () {
    /*
    this.name = '';
    this.author = '';
    this.artist = '';
    this.source = '';
    this.status = '';
    this.identifier = '';
    this.imageUrl = '';
    this.coverImage = '';
    this.rating = '';
    this.lastUpdate = '';
    this.genres = '';
    this.views = '';

    this.summary = '';
    this.chapters = '';

    this.lastChapter = '';
    */
};

// Novel Object: Definition
nrUtility.chapterPagination = function () {
    /*
    this.chapters = '';
    this.pageCount = '';
    this.pageCurrent = '';
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

// default 'request'
nrUtility.nr_novelListRequest = request.defaults({
    method : 'GET',
    headers: {
        'content-type': 'text/html',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/21A372 Safari/604.1'
    }
});

// GET request, 'url' + '?' + 'query'
nrUtility.getRequest = function (url, query) {
    if (Object.keys(query).length > 0) {
        return url + '?' + qs.stringify(query)
    }
    return url
};

// default 'request'
nrUtility.nr_postRequest = request.defaults({
    method : 'POST',
    headers: {
        "content-type": "application/x-www-form-urlencoded",
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/21A372 Safari/604.1'
    }
});

// All available novels
nrUtility.parse_novel_list = function (html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

    var novels = [];

    $('#list-page > .col-truyen-main > .list-truyen > .row').each(function(i, chResult) {

        var object = new nrUtility.novelObject();

        $(chResult).children().filter(function(i, obj) {

            // Image
            if ($(obj).hasClass('col-xs-3')) {
                var image = $(obj).find('img')
                if ($(image).attr('src') !== null) {
                    object.imageUrl = on_baseURL + $(image).attr('src');
                }
            } 
            // Title
            else if ($(obj).hasClass('col-xs-7')) {
                // Title
                var title = $(obj).find('*[class^="truyen-title"]').find('a')
                var hrefValue = $(title).attr('href');
                if (hrefValue) {
                    object.identifier = encode(hrefValue);
                    object.name = $(title).text().toString();
                }

                // Author
                var author = $(obj).find('*[class^="author"]').text().trim();
                if (author !== '') {
                    object.author = author;
                }
            }
            // Chapters
            else if ($(obj).hasClass('col-xs-2')) {
                var chapter = $(obj).find('*[class^="chapter-text"]').text().trim();
                if (chapter !== '') {
                    object.lastChapter = chapter.replace(/&nbsp;|\n/g, ' ').replace(/\s+/g, ' ').trim();
                }
            }
        });

        novels.push(object);

    });

    return novels;
};

// Chapters-list
nrUtility.parse_novel_details = function (identifier, html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

    var novel = new nrUtility.novelObject();
    novel.identifier = identifier;

    // Novel Name
    var titleEle = "#truyen > div.csstransforms3d > div > div.col-xs-12.col-info-desc > div.info-holder > div.books > div.desc > h3"
    var name = $(titleEle).text().toString();
    if (name !== '' ){
        novel.name = name;
    }

    // Novel Cover
    var imageEle = "#truyen > div.csstransforms3d > div > div.col-xs-12.col-info-desc > div.info-holder > div.books > div.book"
    var coverImage = $(imageEle).find('img').attr('src');
    if (coverImage !== null) {
        novel.coverImageUrl = on_baseURL + coverImage
    }

    var novelDataIdEle = $("#truyen > div.csstransforms3d > div > div.col-xs-12.col-info-desc > div.col-md-8.desc > div.rate")
    novel.novelDataId = $(novelDataIdEle).find('div#rating').attr("data-novel-id").toString();

    // Novel Info
    var infoEle = "#truyen > div.csstransforms3d > div > div.col-xs-12.col-info-desc > div.info-holder > div.info"
    $(infoEle).each(function (i, infoElement) {
        $(infoElement).children().filter(function(i, liResult) {
            var label = $(liResult).find('h3').text().toString();
            if (label === 'Author:') {
                novel.author = $(this).text().toString().replace('Author:', '')
            }
            else if (label === 'Genre:') {
                novel.genres = $(this).text().toString().replace('Genre:', '').split(',')
                novel.genres = novel.genres.map(function (genre) {
                    return genre.trim();
                });
            }
            else if (label === 'Source:') {
                novel.source = $(this).text().toString().replace('Source:', '')
            }
            else if (label === 'Status:') {
                novel.status = $(this).text().toString().replace('Status:', '')
            }
        });
    });

    // Novel Detail
    var descText = '#truyen > div.csstransforms3d > div > div.col-xs-12.col-info-desc > div.col-md-8.desc > div.desc-text'
    novel.summary = JSON.stringify($(descText).text().toString()).slice(1, -1);

    // Novel Rating
    var ratingEle = "#truyen > div.csstransforms3d > div > div.col-xs-12.col-info-desc > div.col-md-8.desc > div.small"
    $(ratingEle).find('span').each(function(i, spanResult) {
        if ($(spanResult).attr('class') === 'text-muted') {
            return;
        }
        if (i === 0) {
            var rating = $(this).text().toString().trim();
            if (rating !== '') {
                novel.rating = rating;
            }
        } else if (i === 2) {
            var views = $(this).text().toString().trim();
            if (views !== '') {
                novel.views = views;
            }
        }
    });

    // novel.chapters = this.parse_novel_chapter_list(identifier, 1, html);

    return novel;
};

// Chapter List
nrUtility.parse_novel_chapter_list = function (identifier, page, html) {

   var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

   var pagination = new nrUtility.chapterPagination();
    pagination.identifier = identifier;
    pagination.chapters = [];

    // Novel Page Count 
    var novelEle = "select.chapter_jump > option"
    pagination.pageCount = $(novelEle).length;
    pagination.currentPage = 1

    // Novel Chapters
    $(novelEle).each(function (i, liResult) {
        var hrefValue = $(this).attr('value');
        if (hrefValue === undefined || hrefValue === null || hrefValue === '') {
            return;
        }
        var object = new nrUtility.novelObject();
        //Chapter URL
        object.identifier = encode(hrefValue);
        object.index = i + 1;
        //Chapter Name
        var name = $(this).text().toString();
        object.name = name.replace(/^\s*Chapter\s*\d+\s*[:-]?\s*/i, '').trim();
        pagination.chapters.push(object);
        // Parse chapter index from name, e.g., "Chapter 17 - ..."
        // var match = name.match(/Chapter\s+(\d+)/i);
        // if (match && match[1]) {
        //     object.index = parseInt(match[1], 10); // index as integer from chapter name
        // }
        
    });

    return pagination;
};

// Chapter
nrUtility.parse_novel_chapter = function (identifier, html) {

    var $ = domParser.load(html, {
        ignoreWhitespace: true,
        xmlMode: true,
        decodeEntities: true
    });

    var novelChapter = new nrUtility.novelObject();
    novelChapter.identifier = identifier;
    var content = '';

    var chapterEle = '#chapter-content'
    $('#chapter-content').find('p').each(function() {
        var text = $(this).text().trim();
        if (text !== '') {
            content = content + '<p>' + text + '</p>';
        }
      });

    novelChapter.content = content;

    return novelChapter;
};

// Search
nrUtility.parse_OnlineNovelReader_search = function (html) {
    var novelListPage = nrUtility.parse_novel_list(html);
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
