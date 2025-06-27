var nrUtility = require('./onlineNovelParser');
const axios = require('axios');

var onUtility = {};

var fetchNovelList = function (url, query, next) {
    var requestUrl = nrUtility.getRequest(url, query);

    axios.get(requestUrl)
        .then(response => {
            var novelList = nrUtility.parse_novel_list(response.data);

            if (!novelList || novelList.length === 0) {
                next({ error: 'Not able to find the keyword' });
            } else {
                next({ response: novelList });
            }
        })
        .catch(() => {
            next({ error: 'Not able to find the keyword' });
        });
};

onUtility.on_fetchCompletedNovelList = function (query, next) {
    fetchNovelList(nrUtility.on_completedList, query, next);
};

onUtility.on_fetchRecentNovelList = function (query, next) {
    fetchNovelList(nrUtility.on_latestUpdate, query, next);
};

onUtility.on_fetchTopNovelList = function (query, next) {
    fetchNovelList(nrUtility.on_topList, query, next);
};

onUtility.on_fetchNovelDetails = function (identifier, query, next) {
    var url = nrUtility.on_baseURL + nrUtility.decode(identifier);
    var requestUrl = nrUtility.getRequest(url, query);

    axios.get(requestUrl)
        .then(response => {
            var novelList = nrUtility.parse_novel_details(identifier, response.data);

            if (!novelList || (Array.isArray(novelList) && novelList.length === 0)) {
                next({ error: 'Not able to find the keyword' });
            } else {
                next({ response: novelList });
            }
        })
        .catch(() => {
            next({ error: 'Not able to find the keyword' });
        });
};

onUtility.on_fetchChapterList = function (identifier, query, next) {
    var url = nrUtility.on_baseURL + nrUtility.decode(identifier);
    var requestUrl = nrUtility.getRequest(url, query);
    var page = query.page;

    axios.get(requestUrl)
        .then(response => {
            var novelList = nrUtility.parse_novel_chapter_list(identifier, page, response.data);

            if (!novelList || novelList.length === 0) {
                next({ error: 'Not able to find the chapter list' });
            } else {
                next({ response: novelList });
            }
        })
        .catch(() => {
            next({ error: 'Not able to find the chapter list' });
        });
};

onUtility.on_fetchChapter = function (identifier, next) {
    var url = nrUtility.chapters + nrUtility.decode(identifier);

    axios.get(url)
        .then(response => {
            var novelList = nrUtility.parse_novel_chapter(identifier, response.data);

            if (!novelList || novelList.length === 0) {
                next({ error: 'Not able to find the keyword' });
            } else {
                next({ response: novelList });
            }
        })
        .catch(() => {
            next({ error: 'Not able to find the keyword' });
        });
};

onUtility.on_searchNovel = function (searchQuery, next) {
    var url = nrUtility.on_search;

    axios.post(url, new URLSearchParams(searchQuery).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
        .then(response => {
            var novelList = nrUtility.parse_OnlineNovelReader_search(response.data);

            if (!novelList || novelList.length === 0) {
                next({ error: 'Not able to find the keyword', status: 'ok' });
            } else {
                next({ response: novelList });
            }
        })
        .catch(() => {
            next({ error: 'Not able to find the keyword' });
        });
};

onUtility.on_searchFilter = function (next) {
    axios.get(nrUtility.on_search)
        .then(response => {
            var filter = nrUtility.parse_OnlineNovelReader_searchFilter(response.data);

            if (!filter || filter.length === 0) {
                next({ error: 'Not able to find the filter' });
            } else {
                next({ response: filter });
            }
        })
        .catch(() => {
            next({ error: 'Not able to find the filter' });
        });
};

module.exports = onUtility;
