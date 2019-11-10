"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var imdb_1 = require("./imdb");
var express = require("express");
var morgan = require("morgan");
var app = express();
app.use(morgan('combined')); // Apache combined log style
function sendError(res, err, code, debug) {
    res.json({
        'success': false,
        'error': err,
        'debug': (process.env.DEBUG ? debug : undefined)
    }).status(code ? code : 500);
}
function sendResponse(res, value) {
    res.json({
        'success': true,
        'result': value
    }).end();
}
app.get('/', function (req, res) {
    res.redirect('https://github.com/flotwig/imdb-scraper#readme');
});
app.get('/search', function (req, res) {
    if (!req.query.q) {
        return sendError(res, 'Please supply a query.', 400);
    }
    var limit = req.query.limit || 5;
    return imdb_1.Imdb.search(req.query.q, limit)
        .then(function (result) {
        return sendResponse(res, result);
    })
        .catch(function (err) {
        return sendError(res, err);
    });
});
app.get('/title', function (req, res) {
    if (!req.query.id) {
        return sendError(res, 'Please supply a title ID.', 400);
    }
    return imdb_1.Imdb.getTitle(req.query.id)
        .then(function (result) {
        return sendResponse(res, result);
    })
        .catch(function (err) {
        return sendError(res, err);
    });
});
app.listen(process.env.PORT || 8080, function () {
    console.log('listening on port ' + (process.env.PORT || 8080));
});
