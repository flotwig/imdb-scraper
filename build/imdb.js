"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = require("./cache");
var title_1 = require("./models/title");
var axios_1 = require("axios");
var debug_1 = require("debug");
var Bluebird = require("bluebird");
var cheerio = require("cheerio");
var debug = debug_1.default('imdb-scraper:imdb');
var Imdb = /** @class */ (function () {
    function Imdb() {
    }
    Imdb.base = 'http://www.imdb.com/';
    Imdb.cache = new cache_1.Cache();
    Imdb.search = function (q, limit) {
        return Imdb.query('find', {
            'q': q,
            's': 'tt',
            'ref_': 'fn_al_tt_mr'
        })
            .then(function ($) {
            var rows = $('.findList').find('tr').slice(0, limit);
            return Bluebird.map(rows.toArray(), function (element) {
                var photoTd = element.children.filter(function (v, i, a) {
                    return v.name == 'td';
                })[0];
                var photoA = photoTd.children[1];
                var matches = /^\/title\/(tt\d+).*$/g.exec(photoA.attribs['href']);
                if (!matches) {
                    throw new Error('could not get title id for row');
                }
                var id = matches[1];
                debug('found result, getting title', { id: id, q: q });
                return Imdb.getTitle(id);
            });
        });
    };
    Imdb.getTitle = function (id) {
        if (!/^tt\d+$/.exec(id)) {
            throw new Error("Invalid title ID supplied: " + id);
        }
        return new Bluebird(function (resolve, reject) {
            Imdb.cache.get(id, function (found) {
                Imdb.query('title/' + id, {})
                    .then(function ($) {
                    var title = new title_1.Title();
                    title.id = id;
                    var head = $('.title_wrapper > h1').text().trim();
                    var pageTitle = $('title').text().trim();
                    try {
                        // @ts-ignore
                        title.title = /^(.*)\(\d{4}\).*$/g.exec(pageTitle)[1].trim();
                    }
                    catch (e) {
                        title.title = head;
                    }
                    try {
                        // @ts-ignore
                        title.year = /(\d{4})/g.exec(pageTitle)[1].trim();
                    }
                    catch (e) {
                        title.year = "";
                    }
                    title.plot = $('.summary_text').first().text().trim();
                    if (title.plot.indexOf('Add a Plot') > -1)
                        title.plot = '';
                    title.runtime = $('time').first().text().trim();
                    title.rating = $('.ratingValue > strong > span').text().trim() || 'unrated';
                    title.votes = $('.imdbRating > a > span').first().text().trim().replace(/,/g, '') || '0';
                    title.genres = [];
                    $('div[itemprop=genre] > a').each(function (i, e) {
                        // @ts-ignore
                        title.genres.push(e.children[0]['data'].trim());
                    });
                    var nameList = function (arr, selector) {
                        $(selector).each(function (i, e) {
                            try {
                                arr.push({
                                    // @ts-ignore
                                    name: e.children[0]['data'].trim(),
                                    // @ts-ignore
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
                    debug('got title %o', title);
                    found(title);
                });
            }, resolve);
        });
    };
    Imdb.query = function (endpoint, params) {
        var url = Imdb.base + endpoint;
        return axios_1.default.get(url, { params: params })
            .then(function (res) {
            return cheerio.load(res.data);
        });
    };
    return Imdb;
}());
exports.Imdb = Imdb;
