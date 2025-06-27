var fs = require('fs');
var novelParser;
novelParser = require('./onlineNovelParser');

var mock_nrUtility = {};

// URL: https://novelfull.net
var parseNovelList = function (file, next) {

    fs.readFile(file, 'utf8', function (err, data) {

        if (err) {
            next({error: 'Not able to find the keyword'});
            return;
        }

        var novelListPage = novelParser.parse_novel_list(data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            next({response: novelListPage});
        }
    });
};

// Mock parse_novel_list to generate random content
mock_nrUtility.mock_parse_novel_list = function () {
    // Ignore the html input, just generate mock data
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomFromArray = arr => arr[getRandomInt(0, arr.length - 1)];

    const titles = [
        'The Lost Kingdom', 'Love in the Shadows', 'Dragon’s Reign', 'Starlight Memories', 'Mystic River',
        'Shadow Hunter', 'Eternal Promise', 'Celestial Blade', 'Frostbound', 'Crimson Night',
        'Echoes of Tomorrow',
        'Quantum Hearts',
        'The Last Algorithm',
        'Dreams of the Neon Sky',
        'Synthetic Destiny',
        'Code of the Forgotten',
        'Parallel Promises',
        'The Infinite Loop',
        'Binary Souls',
        'Fragments of Reality',
        'Neural Nightfall',
        'The Memory Architect',
        'Digital Eden',
        'Ghost in the Mainframe',
        'Chronicles of the Singularity'
    ];

    let novels = [];
    for (let i = 0; i < 10; i++) {
        let object = new novelParser.novelObject();
        object.name = randomFromArray(titles) + ' ' + getRandomInt(1, 1000);
        object.identifier = Buffer.from('novel-' + getRandomInt(1000, 9999)).toString('base64');
        object.imageUrl = 'https://placehold.co/200x300?text=Novel+' + (i + 1);
        object.lastChapter = 'Chapter ' + getRandomInt(1, 200) + ' - ' + randomFromArray(titles);
        novels.push(object);
    }
    return novels;
};

// Mock parse_novel_details to generate random content
mock_nrUtility.mock_parse_novel_details = function (identifier) {
    // Ignore the html input, just generate mock data
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomFromArray = arr => arr[getRandomInt(0, arr.length - 1)];

    const authors = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Lee', 'Emily Clark'];
    const genres = ['Action', 'Romance', 'Fantasy', 'Sci-Fi', 'Drama', 'Comedy'];

    let object = new nrUtility.novelObject();
    object.identifier = identifier
    object.author = randomFromArray(authors);
    object.genres = [randomFromArray(genres), randomFromArray(genres)];
    object.imageUrl = 'https://placehold.co/200x300?text=Novel+' + (i + 1);
    object.lastChapter = 'Chapter ' + getRandomInt(1, 200) + ' - ' + randomFromArray(titles);
    object.rating = (Math.random() * 5).toFixed(2);
    object.views = getRandomInt(1000, 100000);
    object.summary = 'This is a mock summary for ' + object.name + '.';
    return object;
};

// All available novels
mock_nrUtility.on_fetchCompletedNovelList = function (query, next) {
    if (parseInt(query.page) >= 2) {
        next({response: this.mock_parse_novel_list()});
    } else {
        parseNovelList('./private/demopages/novellist.html', next);
    }
};

// Top NovelList
mock_nrUtility.on_fetchTopNovelList = function (query, next) {
    parseNovelList('./private/demopages/novellist.html', next);
};

// Latest NovelList
mock_nrUtility.on_fetchRecentNovelList = function (query, next) {
    parseNovelList('./private/demopages/novellist.html', next);
};

// Novel Details
mock_nrUtility.on_fetchNovelDetails = function (identifier, page, next) {

    fs.readFile('./private/demopages/novelDetails.html', 'utf8', function (err, data) {

        if (err) {
            //debug(err);
            next({error: 'Not able to find the keyword'});
            return;
        }

        var novelListPage = novelParser.parse_novel_details(identifier, data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            return next({response: novelListPage});
        }
    });
};

// Novel Chapter List
mock_nrUtility.on_fetchChapterList = function (identifier, page, next) {

    fs.readFile('./private/demopages/novelChapterList.html', 'utf8', function (err, data) {

        if (err) {
            //debug(err);
            next({error: 'Not able to find the chapters'});
            return;
        }

        var novelChapterList = novelParser.parse_novel_chapter_list(identifier, page, data);

        if (novelChapterList.length === 0) {
            next({error: 'Not able to find the chapters'});
        }
        else {
            return next({response: novelChapterList});
        }
    });
};

// Chapter
mock_nrUtility.on_fetchChapter = function (identifier, next) {

    fs.readFile('./private/demopages/novelChapter.html', 'utf8', function (err, data) {

        if (err) {
            next({error: 'Not able to find the keyword'});
            return;
        }

        var novelListPage = novelParser.parse_novel_chapter(identifier, data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            return next({response: novelListPage});
        }
    });
};

// searchFilter
mock_nrUtility.on_searchFilter = function (next) {

    fs.readFile('./private/demopages/onlinenovelreader_detailed_search.html', 'utf8', function (err, data) {

        if (err) {
            next({error: 'Not able to find the filter'});
            return;
        }

        var filter = novelParser.parse_OnlineNovelReader_searchFilter(data);

        if (filter.length === 0) {
            next({error: 'Not able to find the filter'});
        }
        else {
            return next( {response: filter} );
        }
    });
};

// Search
mock_nrUtility.on_searchNovel = function (searchQuery, next) {

    fs.readFile('./private/demopages/onlinenovelreader_detailed_search.html', 'utf8', function (err, data) {

        if (err) {
            next({error: 'Not able to find the keyword'});
            return;
        }

        var novelListPage = novelParser.parse_OnlineNovelReader_search(data);

        if (novelListPage.length === 0) {
            next({error: 'Not able to find the keyword'});
        }
        else {
            return next({response: novelListPage});
        }
    });
};

module.exports = mock_nrUtility;
