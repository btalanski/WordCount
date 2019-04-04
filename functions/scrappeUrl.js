const req = require('request-promise-native');
const $ = require('cheerio');
const fs = require('fs');

async function scrappeUrl(url, sleepMs = 0) {
    try {
        const html = await req(url);
        await sleep(sleepMs);
        return Promise.resolve(html);
    }
    catch (err) {
        return Promise.reject(`Error scrapping the url: ${url}: ${err}`);
    }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = scrappeUrl;