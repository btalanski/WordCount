const scrappeUrl = require("./functions/scrappeUrl.js");
const extractSongLinksAndTitlesFromHtml = require("./functions/extractSongLinksAndTitlesFromHtml.js");
const writeToFile = require("./functions/writeToFile.js");
const extractSongLyricsFromHtml = require("./functions/extractSongLyricsFromHtml.js");
const word_count = require("./functions/word_count.js");
const slug = require('slug');
const cleanUpBeforeStart = require("./functions/cleanUpBeforeStart.js");
const args = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');

function init(args) {
    const { url = "", baseDir = "" } = args;

    if (url == "" || baseDir == "") {
        console.log("Missing arguments --url and/or --baseDir");
        process.exit();
    }

    console.log("Process started");

    cleanUpBeforeStart(baseDir).then(() => {
        scrappeUrl(url)
            .then(html => {
                extractSongLinksAndTitlesFromHtml(html).then(dictionary => {
                    const { songs = [], urls = [] } = dictionary;

                    if (songs.length > 0 && urls.length > 0) {
                        writeToFile("./data/songs.txt", songs.join("\r\n"))
                            .then(() => console.log("Wrote songs.txt sucessfully"))
                            .catch((err) => console.log(`Error writing songs.txt... Error: ${err}`));

                        const scrappeHtmlFromUrls = new Promise((resolve, reject) => {
                            urls.reduce((prevPromise, item, i, urls) => {
                                const { url, title } = item;

                                return prevPromise.then(() => {
                                    return scrappeUrl(url, 0).then(html => {
                                        const msg = `Downloaded ${i + 1} of ${urls.length}`;
                                        const filename = `${i.toString().padStart(2, '0')}-${slug(title)}.html`;

                                        writeToFile(`./data/songs_html/${filename}`, html)
                                            .then(() => console.log(`${msg} - ${filename} saved successfully`))
                                            .catch(err => console.log(`${msg} - Error: ${err}`))
                                            .finally(() => {
                                                if (i >= urls.length - 1) resolve();
                                            });

                                    }).catch(err => console.log(`Error downloading ${url}`, err));
                                });
                            }, Promise.resolve(''));
                        });

                        scrappeHtmlFromUrls.then(() => {
                            console.log("Download finished");

                            let files = fs.readdirSync('./data/songs_html');
                            files = Array.isArray(files) ? files : [files];

                            const lyrics_list = files.map((file) => {
                                const html = fs.readFileSync(path.join(__dirname, 'data/songs_html', file), 'utf8');
                                const lyrics = extractSongLyricsFromHtml(html);
                                writeToFile(`./data/songs/${file.split('.')[0]}.txt`, lyrics);
                                return lyrics;
                            });

                            const words = lyrics_list.reduce((words, text) => {
                                const words_list = word_count(text);
                                return words.concat(words_list);
                            }, []);


                            const dictionary = words.reduce((dictionary, key) => {
                                if (dictionary[key]) {
                                    dictionary[key] = dictionary[key] + 1;
                                }
                                else {
                                    dictionary[key] = 1
                                }

                                return dictionary;
                            }, {});

                            const sorted_dictionary = Object.keys(dictionary)
                                .map(word => ({ word, count: dictionary[word] }))
                                .sort((a, b) => a.count - b.count).reverse();

                            fs.writeFileSync('./data/words.json', JSON.stringify(sorted_dictionary));
                            fs.writeFileSync('./data/words_25.json', JSON.stringify(sorted_dictionary.slice(0, 24)));
                            fs.writeFileSync('./data/words_50.json', JSON.stringify(sorted_dictionary.slice(0, 49)));
                            fs.writeFileSync('./data/words_100.json', JSON.stringify(sorted_dictionary.slice(0, 99)));
                            fs.writeFileSync('./data/words_500.json', JSON.stringify(sorted_dictionary.slice(0, 499)));
                        });
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            });
    });
}

init(args);