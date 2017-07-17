"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = require("./cache");
var title_1 = require("./models/title");
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
                    var title = new title_1.Title();
                    title.id = /^\/title\/(tt\d+).*$/g.exec(photoA.attribs['href'])[1];
                    Imdb.getTitle(title.id, function (res, err) {
                        result_1[index] = res;
                        completed_1++;
                        if (completed_1 == rows_1.length)
                            cb(result_1, undefined);
                    });
                });
            }
        });
    };
    Imdb.getTitle = function (id, cb) {
        if (!/^tt\d+$/.exec(id)) {
            cb(undefined, 'Invalid title ID supplied.');
            return;
        }
        Imdb.cache.get(id, function (found) {
            Imdb.query('title/' + id, {}, function ($, err) {
                var title = new title_1.Title();
                title.id = id;
                var head = $('.title_wrapper > h1').text().trim();
                var pageTitle = $('title').text().trim();
                try {
                    title.title = /^(.*)\(\d{4}\).*$/g.exec(pageTitle)[1].trim();
                }
                catch (e) {
                    title.title = head;
                }
                try {
                    title.year = /(\d{4})/g.exec(pageTitle)[1].trim();
                }
                catch (e) {
                    title.year = "";
                }
                title.plot = $('.summary_text').first().text().trim();
                title.runtime = $('time').first().text().trim();
                title.rating = $('.ratingValue > strong > span').text().trim();
                title.votes = $('.imdbRating > a > span').first().text().trim();
                title.genres = [];
                $('div[itemprop=genre] > a').each(function (i, e) {
                    title.genres.push(e.children[0]['data'].trim());
                });
                var nameList = function (arr, selector) {
                    $(selector).each(function (i, e) {
                        try {
                            arr.push({
                                name: e.children[0]['data'].trim(),
                                id: /(nm\d+)/g.exec(e.parent.attribs['href'])[1]
                            });
                        }
                        catch (e) {
                            // TOOD: impl the additional link
                        }
                    });
                };
                nameList(title.directors, 'span[itemprop=director] > a > span');
                nameList(title.writers, 'span[itemprop=creator] > a > span');
                nameList(title.stars, 'span[itemprop=actors] > a > span');
                title.photoUrl = $('.poster > a > img').attr('src');
                found(title);
            });
        }, function (t) {
            cb(t, null);
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
