import express from "express";
import randomstring from "randomstring";

const app = express();

app.use(express.json());

let LONG_URL_VS_SHORT_URL = new Map();
let SHORT_URL_VS_LONG_URL = new Map();

function shortenURL(req, res) {
    let statusCode = null;
    let responseJson = null;
    
    let longURL = req.body.long_url;
    let shortenedURL;
    if (LONG_URL_VS_SHORT_URL.has(longURL)) {
        shortenedURL = LONG_URL_VS_SHORT_URL.get(longURL);
    } else {
        shortenedURL = randomstring.generate(5);
        while (SHORT_URL_VS_LONG_URL.has(shortenedURL)) {
            shortenedURL = randomstring.generate(5);
        }
        LONG_URL_VS_SHORT_URL.set(longURL, shortenedURL);
        SHORT_URL_VS_LONG_URL.set(shortenedURL, longURL);
    }
    statusCode = 200;
    responseJson = {
        'short_url': shortenedURL
    }
    res.status(statusCode).send(responseJson);
}



function retrieveLongURL(req, res) {
    let statusCode = null;
    let responseJson = null;

    let shortURL = req.body.short_url;
    let longURL = SHORT_URL_VS_LONG_URL.get(shortURL);
    if (longURL == null) {
        statusCode = 400;
        responseJson = {
            'Error': 'long url does not exist!'
        };
    } else {
        statusCode = 200;
        responseJson = {
            'long_url': longURL
        }
    }

    res.status(statusCode).send(responseJson);
}

app.post('/shorten', shortenURL);
app.get('/retrieve', retrieveLongURL);

const port = 3005;
app.listen(port);