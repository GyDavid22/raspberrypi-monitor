import express from 'express';
import * as fs from 'fs';
import Handlebars from 'handlebars';

let lastDate: string | undefined;
let statusMessage: string | undefined;

const app = express();

// Accept optional plain-text body and parse it on this route only.
// Using type '*/*' so clients that don't set a Content-Type still work.
app.post('/ping', express.text({ type: '*/*' }), (req, res) => {
    const expected = process.env.PING_AUTH_TOKEN;
    const provided = req.get('authorization');

    if (!expected || !provided || provided !== expected) {
        res.sendStatus(401);
        return;
    }

    const body = req.body;
    if (typeof body === 'string' && body.trim().length > 0) {
        statusMessage = body;
    } else {
        statusMessage = undefined;
    }

    lastDate = new Date().toISOString();
    res.sendStatus(200);
});

app.get('/', (_req, res) => {
    const html = fs.readFileSync('index.hbs', 'utf8');
    const compiled = Handlebars.compile(html);
    const result = compiled({ statusMessage, lastDate });
    res.type('html').status(200).send(result);
});

app.listen(10000);