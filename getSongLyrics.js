
const req = require('request-promise');
const $ = require('cheerio');
const songs = require("./data/list.json");
const fs = require('fs');
var slug = require('slug')

songs.forEach((song) => {
    getSongData(song.url)
        .then((html) => {
            file_name = slug(song.title, {
                replacement: '_',      // replace spaces with replacement
                symbols: true,         // replace unicode symbols or not
                remove: null,          // (optional) regex to remove characters
            });
            fs.writeFileSync(`./data/songs_html/${file_name}.html`, html);
        })
        .catch((err) => {
            console.log(err);
        });
});

async function getSongData(url) {
    try {
        const response = await req(url);
        return Promise.resolve(response);
    }
    catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
}
