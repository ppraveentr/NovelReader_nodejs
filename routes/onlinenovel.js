var express = require('express');
var apicache = require('apicache');
var router = express.Router();

// var utility = require('../private/onlineNovelUtility');
var utility = require('../private/mock_onlineNovel');
var cache = apicache.middleware;

/* GET novel/list listing. */
router.get('/list' ,function(req, res) {

    utility.on_fetchNovelList(function(novelList){
        res.send(novelList);
        res.end();
    });
});

/* GET novel/recentupdates listing. */
router.get('/recentupdates', function(req, res) {

    utility.on_fetchRecentNovelList(function(recentList){
        res.send(recentList);
        res.end();
    });
});

/* GET novel/top-list listing. */
router.get('/top-list/:page?',function(req, res) {

    utility.on_fetchTopNovelList(function(novelList){
        res.send(novelList);
        res.end();
    });
});

/* GET novel/chapters-list listing. */
router.get('/chapters-list/:id?' ,function(req, res) {

    var novelName = req.query.id;

    utility.on_fetchChaptersList(novelName, function(novelList){
        res.send(novelList);
        res.end();
    });
});

/* GET novel/chapter listing. */
router.get('/chapter/:id?', function(req, res) {

    var novelName = req.query.id;

    utility.on_fetchChapter(novelName, function(novelList){
        res.send(novelList);
        res.end();
    });
});

/* GET novel/search-filter. */
router.get('/search-filter', function(req, res) {

    utility.on_searchFilter(function(filter){
        res.send(filter);
        res.end();
    });
});

/* POST */
router.post('/search', function(req, res) {

    var searchQuery = req.body;

    utility.on_searchNovel(searchQuery, function(novelList){
        res.send(novelList);
        res.end();
    });
});

module.exports = router;
