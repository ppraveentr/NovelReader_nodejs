var express = require('express');
var router = express.Router();

var utility = require('../private/onlineNovelUtility');

/* GET novel/list listing. */
router.get('/list', function(req, res) {

    utility.on_fetchNovelList(function(novelList){
        res.send(novelList);
        res.end();
    });
});

module.exports = router;