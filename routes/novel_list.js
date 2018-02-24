var express = require('express');
var router = express.Router();

/* GET novel_list listing. */
router.get('/', function(req, res, next) {

    console.log('Cookies: ', req.cookies);

    res.type('json');
    res.send({ novel_list: 'base_function' });
});

/* GET novel_list/value listing. */
router.get('/value', function(req, res, next) {

    res.type('json');
    res.send({ novel_list_: 'value_function' });
});

module.exports = router;
