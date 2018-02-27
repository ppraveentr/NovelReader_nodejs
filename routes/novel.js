var express = require('express');
var url = require('url');
var router = express.Router();
var utility = require('../private/utlity');

/* GET novel_list listing. */
router.get('/', function(req, res) {
    res.type('json');
    res.send({ novel_list: 'base_function' });
});

/* GET novel/recentupdates listing. */
router.get('/recentupdates', function(req, res) {
    utility.fetchRecentUpdates(function(recentList){
        res.send(recentList);
        res.end();
    });
});

/* GET novel/list listing. */
router.get('/list', function(req, res) {
    //list?type=topview&category=all&state=all&page=1

    var q = url.parse(req.url, true).query;

    var options = {
        type: q.type,
        category: q.category ,
        state: q.state,
        page: q.page
     };

    utility.fetchNovelList(options, function(novelList){
        res.send(novelList);
        res.end();
    });
});

/* GET novel/search listing. */
router.get('/search', function(req, res) {
    var q = req.query.q;
    utility.search_novel(q, function(searchList){
        res.send(searchList);
        res.end();
    });
});

module.exports = router;
