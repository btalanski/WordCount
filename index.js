const scrappeUrl = require("./functions/scrappeUrl.js");
const extractSongLinksAndTitlesFromHtml = require("./functions/extractSongLinksAndTitlesFromHtml.js");
const writeToFile = require("./functions/writeToFile.js");

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

                    const done = new Promise((resolve, reject) => {
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

                    done.then(() => {
                        console.log("finished");
                    });

                }
            })
        })
        .catch((err) => {
            console.log(err);
        });
}

init();