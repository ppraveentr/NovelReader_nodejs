var express = require('express');
var router = express.Router();
var utility = require('../private/utlity');

/* GET novel_list listing. */
router.get('/', function(req, res, next) {
    res.type('json');
    res.send({ novel_list: 'base_function' });
});

/* GET novel/search listing. */
router.get('/list', function(req, res) {
    //http://novelonlinefree.com/novel_list?type=topview&category=all&state=all&page=1

    var options = {
        type: req.query.type,
        category: req.query.category,
        state: req.query.state,
        page: req.query.page
    };

    utility.filter_novel(options, function(resp){
        res.send(resp);
        res.end();
    });
});

/* GET novel/search listing. */
router.get('/search', function(req, res) {
    var q = req.query.q;
    utility.search_novel(q, function(resp){
        res.json(resp);
        res.end();
    });
});

module.exports = router;
