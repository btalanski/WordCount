const scrappeUrl = require("./functions/scrappeUrl.js");
const extractSongLinksAndTitlesFromHtml = require("./functions/extractSongLinksAndTitlesFromHtml.js");
const writeToFile = require("./functions/writeToFile.js");
function init() {
    const songListUrl = 'https://www.letras.mus.br/mais-acessadas/funk/';

    scrappeUrl(songListUrl)
        .then(html => {

            extractSongLinksAndTitlesFromHtml(html).then(dictionary => {
                const { songs = [], urls = [] } = dictionary;

                if (songs.length > 0) {
                    writeToFile("./data/songs.txt", songs.join("\r\n"));
                }

                if (urls.length > 0) {
                    const list = urls.slice(0, 2);
                    const total_urls = list.length;

                    list.reduce((prevPromise, url, i) => {
                        return prevPromise.then((html) => {
                            return scrappeUrl(url, 10000).then(html => {
                                console.log(`Downloaded ${i + 1} of ${total_urls}`);
                                return html;
                            });
                        });
                    }, Promise.resolve(''));
                }
            })

        })
        .catch((err) => {
            console.log(err);
        });
}

init();