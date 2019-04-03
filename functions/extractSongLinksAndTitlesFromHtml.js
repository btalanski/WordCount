const $ = require('cheerio');

function extract(html) {
    const urls = [];
    const songs = [];
    const total_items = $('.top-list_mus li a', html).length;

    if (total_items > 0) {
        $('.top-list_mus li a', html).each(function (i, elem) {
            const url = `https://www.letras.mus.br${$(this).attr('href')}`;
            const artist = $(this).children('span').text();
            const song = $(this).children('b').text();
            urls.push({ url, title: `${artist} - ${song}` });
            songs.push(`${artist} - ${song}`);
        });
    }

    return Promise.resolve({ urls, songs});
}

module.exports = extract;