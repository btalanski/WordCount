const scrappeUrl = require("./functions/scrappeUrl.js");
const extractSongLinksAndTitlesFromHtml = require("./functions/extractSongLinksAndTitlesFromHtml.js");
const writeToFile = require("./functions/writeToFile.js");
const extractSongLyricsFromHtml = require("./functions/extractSongLyricsFromHtml.js");

const fs = require('fs');
const path = require('path');

function init() {
    const songListUrl = 'https://www.letras.mus.br/mais-acessadas/funk/';

    scrappeUrl(songListUrl)
        .then(html => {

            extractSongLinksAndTitlesFromHtml(html).then(dictionary => {
                const { songs = [], urls = [] } = dictionary;

                if (songs.length > 0 && urls.length > 0) {
                    writeToFile("./data/songs.txt", songs.join("\r\n"));

                    const list = urls.slice(0, 1);
                    const total_urls = list.length;

                    const scrappeHtmlFromUrls = new Promise((resolve) => {
                        list.reduce((prevPromise, item, i) => {
                            const { url, title } = item;

                            return prevPromise.then((html) => {
                                return scrappeUrl(url, 1000).then(html => {
                                    console.log(`Downloaded ${i + 1} of ${total_urls}`);

                                    const filename = title.replace(/ /g, "_");
                                    writeToFile(`./data/songs_html/${filename}.html`, html);

                                    if (i >= total_urls - 1) resolve();
                                }).catch(err => {
                                    console.log(`Error downloading ${i + 1} of ${total_urls}`);
                                });
                            });
                        }, Promise.resolve(''));
                    });

                    scrappeHtmlFromUrls.then(() => {
                        console.log("Download finished");

                        let files = fs.readdirSync('./data/songs_html');
                        files = Array.isArray(files) ? files : [files];

                        files.map((file) => {
                            const html = fs.readFileSync(path.join(__dirname, 'data/songs_html', file), 'utf8');
                            fs.writeFileSync(`./data/songs/${file.split('.')[0]}.txt`, extractSongLyricsFromHtml(html));
                        });
                    });

                }
            })
        })
        .catch((err) => {
            console.log(err);
        });
}

init();