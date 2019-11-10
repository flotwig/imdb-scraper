import { Cache } from './cache'
import { Title } from './models/title'
import { Name } from './models/name'
import axios from 'axios'
import * as Bluebird from 'bluebird'
import * as cheerio from 'cheerio'

class Imdb {
    static base = 'http://www.imdb.com/'
    static cache = new Cache()
    static search = (q: string, limit: number): Promise<Title[]> => {
        return Imdb.query('find', {
            'q': q,
            's': 'tt',
            'ref_': 'fn_al_tt_mr'
        })
        .then($ => {
            let rows = $('.findList').find('tr').slice(0, limit)
            return Bluebird.map(rows.toArray(), (element: CheerioElement) => {
                const [photoTd] = element.children.filter((v, i, a) => {
                    return v.name == 'td';
                });
                const photoA = photoTd.children[1];
                const matches = /^\/title\/(tt\d+).*$/g.exec(photoA.attribs['href'])
                if (!matches) {
                    throw new Error('could not get title id for row')
                }
                const id = matches[1]
                return Imdb.getTitle(id)
            })
        })
    }
    static getTitle = (id: string): Bluebird<Title> => {
        if (!/^tt\d+$/.exec(id)) {
            throw new Error(`Invalid title ID supplied: ${id}`)
        }
        return new Bluebird((resolve, reject) => {
            Imdb.cache.get(id, (found) => {
                Imdb.query('title/' + id, {})
                .then(($) => {
                    let title = new Title()
                    title.id = id
                    let head = $('.title_wrapper > h1').text().trim()
                    let pageTitle = $('title').text().trim()
                    try {
                        // @ts-ignore
                        title.title = /^(.*)\(\d{4}\).*$/g.exec(pageTitle)[1].trim()
                    } catch (e) {
                        title.title = head
                    }
                    try {
                        // @ts-ignore
                        title.year = /(\d{4})/g.exec(pageTitle)[1].trim()
                    } catch (e) {
                        title.year = ""
                    }
                    title.plot = $('.summary_text').first().text().trim()
                    if (title.plot.indexOf('Add a Plot') > -1) title.plot = ''
                    title.runtime = $('time').first().text().trim()
                    title.rating = $('.ratingValue > strong > span').text().trim() || 'unrated'
                    title.votes = $('.imdbRating > a > span').first().text().trim().replace(/,/g, '') || '0'
                    title.genres = []
                    $('div[itemprop=genre] > a').each((i, e) => {
                        // @ts-ignore
                        title.genres.push(e.children[0]['data'].trim())
                    })
                    let nameList = (arr: Name[], selector: string) => {
                        $(selector).each((i, e) => {
                            try {
                                arr.push(<Name>{
                                    // @ts-ignore
                                    name: e.children[0]['data'].trim(),
                                    // @ts-ignore
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
                resolve(t)
            })
        })
    }
    static query = (endpoint: string, params: UrlParams): Promise<CheerioStatic> => {
        let url = Imdb.base + endpoint;
        return axios.get(url, { params })
        .then(res => {
            return cheerio.load(res.data)
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
