import express from 'express';
import * as fs from 'fs';

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

app.get('/date', (_req, res) => {
    if (lastDate) {
        res.type('text/plain').status(200).send(lastDate);
    } else {
        res.status(404).send();
    }
});

app.get('/', (_req, res) => {
    let html = fs.readFileSync('index.html', 'utf8');
    if (statusMessage) {
        html = html.replace('{{statusMessage}}', statusMessage);
    } else {
        html = html.replace('{{statusMessage}}', '');
    }
    res.type('html').status(200).send(html);
});

app.listen(10000);