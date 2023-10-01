import express from "express";
import randomstring from "randomstring";

const app = express();

app.use(express.json());

let LONG_URL_VS_SHORT_URL = new Map();
let SHORT_URL_GENERATED = new Set();

function shorten(req, res) {
    let longURL = req.body.long_url;
    if (LONG_URL_VS_SHORT_URL.has(longURL)) {
        res.send({
            'shortened_url': LONG_URL_VS_SHORT_URL.get(longURL)
        });
    } else {
        let shortenedURL = randomstring.generate(5);
        while (SHORT_URL_GENERATED.has(shortenedURL))
        {
            shortenedURL = randomstring.generate(5);
        }
        LONG_URL_VS_SHORT_URL.set(longURL, shortenedURL);
        SHORT_URL_GENERATED.add(shortenedURL, longURL);
        res.send({
            'shortened_url': shortenedURL
        });
        // console.log("res is", res);
    }
}

app.post('/shorten', shorten);

const port = 3005;
app.listen(port);