"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = require("./cache");
var movie_1 = require("./models/movie");
var request = require("request");
var cheerio = require("cheerio");
var Imdb = (function () {
    function Imdb() {
    }
    Imdb.base = 'http://www.imdb.com/';
    Imdb.cache = new cache_1.Cache();
    Imdb.search = function (q, limit, cb) {
        Imdb.query('find', {
            'q': q,
            's': 'tt',
            'ref_': 'fn_al_tt_mr'
        }, function ($, err) {
            if (err)
                cb(undefined, err);
            else {
                var result_1 = [];
                var rows_1 = $('.findList').find('tr').slice(0, limit);
                var completed_1 = 0;
                rows_1.each(function (index, element) {
                    var _a = element.children.filter(function (v, i, a) {
                        return v.name == 'td';
                    }), photoTd = _a[0], textTd = _a[1];
                    var photoA = photoTd.children[1];
                    var movie = new movie_1.Movie();
                    movie.id = /^\/title\/(tt\d+).*$/g.exec(photoA.attribs['href'])[1];
                    Imdb.getMovie(movie.id, function (res, err) {
                        result_1[index] = res;
                        completed_1++;
                        if (completed_1 == rows_1.length)
                            cb(result_1, undefined);
                    });
                });
            }
        });
    };
    Imdb.getMovie = function (id, cb) {
        if (!/^tt\d+$/.exec(id)) {
            cb(undefined, 'Invalid title ID supplied.');
            return;
        }
        Imdb.cache.get(id, function (found) {
            Imdb.query('title/' + id, {}, function ($, err) {
                var movie = new movie_1.Movie();
                movie.id = id;
                var head = $('.title_wrapper > h1').text().trim();
                var title = $('title').text().trim();
                try {
                    movie.title = /^(.*)\(\d{4}\).*$/g.exec(title)[1].trim();
                }
                catch (e) {
                    movie.title = head;
                }
                try {
                    movie.year = /(\d{4})/g.exec(title)[1].trim();
                }
                catch (e) {
                    movie.year = "";
                }
                movie.plot = $('.summary_text').first().text().trim();
                movie.runtime = $('time').first().text().trim();
                movie.rating = $('.ratingValue > strong > span').text().trim();
                movie.votes = $('.imdbRating > a > span').first().text().trim();
                movie.genres = [];
                $('div[itemprop=genre] > a').each(function (i, e) {
                    movie.genres.push(e.children[0]['data'].trim());
                });
                movie.photoUrl = $('.poster > a > img').attr('src');
                movie.retrieved = new Date();
                found(movie);
            });
        }, function (m) {
            cb(m, null);
        });
    };
    Imdb.query = function (endpoint, params, cb) {
        var queryParts = [];
        for (var key in params) {
            queryParts.push(key + '=' + params[key]);
        }
        var url = Imdb.base + endpoint + '?' + queryParts.join('&');
        request.get(url, function (error, response, body) {
            if (error) {
                cb(undefined, error);
            }
            else {
                var cheer = cheerio.load(body);
                cb(cheer, undefined);
            }
        });
    };
    return Imdb;
}());
exports.Imdb = Imdb;
