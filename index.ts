import { Imdb } from './imdb'
import * as express from 'express'
import * as morgan from 'morgan'

const app = express()

app.use(morgan('combined')) // Apache combined log style

function sendError(res: express.Response, err: string, code?: number, debug?: any) {
    res.json({
        'success': false,
        'error': err,
        'debug': (process.env.DEBUG ? debug : undefined)
    }).status(code ? code : 500)
}

function sendResponse(res: express.Response, value: any) {
    res.json({
        'success': true,
        'result': value
    }).end()
}

app.get('/', (req, res) => {
    res.redirect('https://github.com/flotwig/imdb-scraper#readme')
})

app.get('/search', (req, res) => {
    if (!req.query.q) {
        return sendError(res, 'Please supply a query.', 400)
    }

    let limit = req.query.limit || 5;
    return Imdb.search(req.query.q, limit)
    .then(result => {
        return sendResponse(res, result)
    })
    .catch(err => {
        return sendError(res, err)
    })
})

app.get('/title', (req, res) => {
    if (!req.query.id) {
        return sendError(res, 'Please supply a title ID.', 400)
    }

    return Imdb.getTitle(req.query.id)
    .then(result => {
        return sendResponse(res, result)
    })
    .catch(err => {
        return sendError(res, err)
    })
})

app.listen(process.env.PORT || 8080, function () {
    console.log('listening on port ' + (process.env.PORT || 8080))
})
