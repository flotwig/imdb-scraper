"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require('body-parser');
var imdb_1 = require("./imdb");
var express = require("express");
var app = express();
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
app.get('/search', function (req, res) {
    if (!req.query.q) {
        sendError(res, 'Please supply a query.', 400);
    }
    else {
        var limit = req.query.limit || 5;
        imdb_1.Imdb.search(req.query.q, limit, function (result, err) {
            if (err)
                sendError(res, err);
            sendResponse(res, result);
        });
    }
});
app.get('/title', function (req, res) {
    if (!req.query.id) {
        sendError(res, 'Please supply a title ID.', 400);
    }
    else {
        imdb_1.Imdb.getMovie(req.query.id, function (result, err) {
            if (err)
                sendError(res, err);
            sendResponse(res, result);
        });
    }
});
app.listen(process.env.PORT || 8080, function () {
    console.log('listening on port ' + (process.env.PORT || 8080));
});
