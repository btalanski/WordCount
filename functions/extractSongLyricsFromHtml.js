const $ = require('cheerio');
const decode = require('ent/decode');

function extract(html) {
    const lyrics_body = $('.cnt-letra', html);
    const verses = [];

    lyrics_body.children('p').each(function (i, elem) {
        const text = $(this).html();
        text.split("<br>").forEach(s => verses.push(decode(s)));
    });

    return verses.join('\r\n');
}

module.exports = extract;