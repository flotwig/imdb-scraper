import { Cache } from './cache'
import { Movie } from './models/movie'
import * as request from 'request'
import * as cheerio from 'cheerio'

class Imdb {
    static base = 'http://www.imdb.com/'
    static cache = new Cache()
    static search = (q: string, limit: number, cb: ImdbCallback<Movie[]>) => {
        Imdb.queryImdb('find', {
            'q': q,
            's': 'tt',
            'ref_': 'fn_al_tt_mr'
        }, ($, err) => {
            if (err) cb(undefined, err);
            else {
                let result: Movie[] = []
                let rows = $('.findList').find('tr').slice(0, limit)
                let completed = 0
                rows.each((index, element) => {
                    let [photoTd, textTd] = element.children.filter((v, i, a) => {
                        return v.name == 'td';
                    });
                    let photoA = photoTd.children[1];
                    let movie = new Movie();
                    movie.id = /^\/title\/(tt\d+).*$/g.exec(photoA.attribs['href'])[1]
                    Imdb.getMovie(movie.id, (res, err) => {
                        result[index] = res
                        completed++
                        if (completed == rows.length) cb(result, undefined)
                    });
                })
            }
        })
    }
    static getMovie = (id: string, cb: ImdbCallback<Movie>) => {
        Imdb.cache.get(id, (found) => {
            Imdb.queryImdb('title/' + id, {}, ($, err) => {
                let movie = new Movie()
                movie.id = id
                let head = $('.title_wrapper > h1').text().trim()
                let title = $('title').text().trim()
                try {
                    movie.title = /^(.*)\(\d{4}\).*$/g.exec(title)[1].trim()
                } catch (e) {
                    movie.title = head
                }
                try {
                    movie.year = /(\d{4})/g.exec(title)[1].trim()
                } catch (e) {
                    movie.year = ""
                }
                movie.plot = $('.summary_text').first().text().trim()
                movie.runtime = $('time').first().text().trim()
                movie.rating = $('.ratingValue > strong > span').text().trim();
                movie.votes = $('.imdbRating > a > span').first().text().trim();
                movie.genres = []
                $('div[itemprop=genre] > a').each((i, e) => {
                    movie.genres.push(e.children[0]['data'].trim())
                })
                movie.photoUrl = $('.poster > a > img').attr('src')
                movie.retrieved = new Date();
                found(movie)
            })
        }, (m: Movie) => {
            cb(m, null)
        })
    }
    static queryImdb = (endpoint: string, params: UrlParams, cb: ImdbCallback<CheerioStatic>) => {
        let queryParts = [];
        for (var key in params) {
            queryParts.push(key + '=' + params[key])
        }
        let url = Imdb.base + endpoint + '?' + queryParts.join('&');
        request.get(url, (error, response, body) => {
            if (error) {
                cb(undefined, error)
            } else {
                let cheer = cheerio.load(body);
                cb(cheer, undefined)
            }
        })
    }
}

interface UrlParams {
    [key: string]: string;
}

interface ImdbCallback<Type> {
    (res: Type, error: any): void
}

export { ImdbCallback }
export { Imdb }