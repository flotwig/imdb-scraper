import { Cache } from './cache'
import { Title } from './models/title'
import { Name } from './models/name'
import * as request from 'request'
import * as cheerio from 'cheerio'

class Imdb {
    static base = 'http://www.imdb.com/'
    static cache = new Cache()
    static search = (q: string, limit: number, cb: ImdbCallback<Title[]>) => {
        Imdb.query('find', {
            'q': q,
            's': 'tt',
            'ref_': 'fn_al_tt_mr'
        }, ($, err) => {
            if (err) cb(undefined, err);
            else {
                let result: Title[] = []
                let rows = $('.findList').find('tr').slice(0, limit)
                let completed = 0
                rows.each((index, element) => {
                    let [photoTd, textTd] = element.children.filter((v, i, a) => {
                        return v.name == 'td';
                    });
                    let photoA = photoTd.children[1];
                    let title = new Title();
                    title.id = /^\/title\/(tt\d+).*$/g.exec(photoA.attribs['href'])[1]
                    Imdb.getTitle(title.id, (res, err) => {
                        result[index] = res
                        completed++
                        if (completed == rows.length) cb(result, undefined)
                    });
                })
            }
        })
    }
    static getTitle = (id: string, cb: ImdbCallback<Title>) => {
        if (!/^tt\d+$/.exec(id)) {
            cb(undefined, 'Invalid title ID supplied.')
            return
        }
        Imdb.cache.get(id, (found) => {
            Imdb.query('title/' + id, {}, ($, err) => {
                let title = new Title()
                title.id = id
                let head = $('.title_wrapper > h1').text().trim()
                let pageTitle = $('title').text().trim()
                try {
                    title.title = /^(.*)\(\d{4}\).*$/g.exec(pageTitle)[1].trim()
                } catch (e) {
                    title.title = head
                }
                try {
                    title.year = /(\d{4})/g.exec(pageTitle)[1].trim()
                } catch (e) {
                    title.year = ""
                }
                title.plot = $('.summary_text').first().text().trim()
                title.runtime = $('time').first().text().trim()
                title.rating = $('.ratingValue > strong > span').text().trim()
                title.votes = $('.imdbRating > a > span').first().text().trim()
                title.genres = []
                $('div[itemprop=genre] > a').each((i, e) => {
                    title.genres.push(e.children[0]['data'].trim())
                })
                let nameList = (arr: Name[], selector: string) => {
                    $(selector).each((i, e) => {
                        try {
                            arr.push(<Name>{
                                name: e.children[0]['data'].trim(),
                                id: /(nm\d+)/g.exec(e.parent.attribs['href'])[1]
                            })
                        } catch (e) {
                            // TOOD: impl the additional link
                        }
                    })
                }
                nameList(title.directors, 'span[itemprop=director] > a > span')
                nameList(title.writers, 'span[itemprop=creator] > a > span')
                nameList(title.stars, 'span[itemprop=actors] > a > span')
                title.photoUrl = $('.poster > a > img').attr('src')
                found(title)
            })
        }, (t: Title) => {
            cb(t, null)
        })
    }
    static query = (endpoint: string, params: UrlParams, cb: ImdbCallback<CheerioStatic>) => {
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