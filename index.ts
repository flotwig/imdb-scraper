const bodyParser = require('body-parser')
import { Imdb } from './imdb'
import { Movie } from './models/movie'
import * as express from 'express'

const app = express()

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

app.get('/search', (req, res) => {
    if (!req.query.q) {
        sendError(res, 'Please supply a query.', 400)
    } else {
        let limit = req.query.limit || 5;
        Imdb.search(req.query.q, limit, (result, err) => {
            if (err) sendError(res, err)
            sendResponse(res, result)
        })
    }
})

app.get('/title', (req, res) => {
    if (!req.query.id) {
        sendError(res, 'Please supply a title ID.', 400)
    } else {
        Imdb.getMovie(req.query.id, (result, err) => {
            if (err) sendError(res, err)
            sendResponse(res, result)
        })
    }
})

app.listen(process.env.PORT || 8080, function () {
    console.log('listening on port ' + (process.env.PORT || 8080))
})