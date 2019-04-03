
const $ = require('cheerio');
const path = require('path');
const fs = require('fs');
const slug = require('slug')
const songs = path.join(__dirname, 'data/songs_html');
var decode = require('ent/decode');

fs.readdir(songs, function (err, files) {
    if (err) {
        return console.log('Error: ' + err);
    } 
    
    files.forEach(function (file) {
        const html = fs.readFileSync(path.join(__dirname, 'data/songs_html', file), 'utf8');
        let lyrics = "";

        const lyrics_body = $('.cnt-letra', html);
        const verses = [];

        lyrics_body.children('p').each(function(i, elem){
            const text = $(this).html();  
            text.split("<br>").forEach(s => verses.push(decode(s)));           
        });
        
        const file_name = file.split('.')[0];
        fs.writeFileSync(`./data/songs/${file_name}.txt`, verses.join('\r\n'));
    });
});