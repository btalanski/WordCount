
const req = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.letras.mus.br/mais-acessadas/funk/';
const fs = require('fs');

req(url)
    .then(function (html) {
        //success!
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

            fs.writeFileSync('./data/list.json', JSON.stringify(urls));
            fs.writeFileSync('./data/list-songs.txt', songs.join('\r\n'));
        }
    })
    .catch(function (err) {
        console.log(err);
    });