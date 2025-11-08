import express from 'express';
import * as fs from 'fs';

let lastDate: string | undefined;

const app = express();

app.get('/ping', (_req, res) => {
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
    const html = fs.readFileSync('index.html', 'utf8');
    res.type('html').status(200).send(html);
});

app.listen(10000);