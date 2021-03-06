const scrappeUrl = require("./functions/scrappeUrl.js");
const extractSongLinksAndTitlesFromHtml = require("./functions/extractSongLinksAndTitlesFromHtml.js");
const writeToFile = require("./functions/writeToFile.js");
const extractSongLyricsFromHtml = require("./functions/extractSongLyricsFromHtml.js");
const word_count = require("./functions/word_count.js");
const slug = require('slug');
const cleanUpBeforeStart = require("./functions/cleanUp.js").cleanUpBeforeStart;
const cleanUpFinish = require("./functions/cleanUp.js").cleanUpAfterFinish;
const renderTemplate = require('./functions/templateRender.js');
const fs = require('fs');
const path = require('path');

const main = ({ url = "", baseDir = "", interval: scrappeInterval = 2500 }) => {
    if (url == "" || baseDir == "") {
        return Promise.reject("Missing arguments --url and/or --baseDir");
    }

    return new Promise((resolve, reject) => {
        console.log("Process started");
        cleanUpBeforeStart(baseDir).then(({ base_dir, html_dir, text_dir }) => {
            scrappeUrl(url)
                .then(html => {
                    extractSongLinksAndTitlesFromHtml(html).then(({ songs = [], urls = [] }) => {

                        if (urls.length == 0) {
                            reject("No songs found on the requested page");
                        }

                        const scrappeHtmlFromUrls = new Promise((resolve, reject) => {
                            urls.reduce((prevPromise, { url, title }, i, urls) => {

                                return prevPromise.then(() => {
                                    return scrappeUrl(url, scrappeInterval).then(html => {
                                        const msg = `Downloaded ${i + 1} of ${urls.length}`;
                                        const filename = `${i.toString().padStart(2, '0')}-${slug(title)}.html`;

                                        writeToFile(`${html_dir}/${filename}`, html)
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
                            console.log("Processing data");

                            let files = fs.readdirSync(html_dir);
                            files = Array.isArray(files) ? files : [files];

                            const lyrics_list = files.map((file) => {
                                const html = fs.readFileSync(path.join(html_dir, file), 'utf8');
                                const lyrics = extractSongLyricsFromHtml(html);
                                writeToFile(`${text_dir}/${file.split('.')[0]}.txt`, lyrics);
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

                            const readme = renderTemplate(
                                fs.readFileSync(path.join(__dirname, 'templates/readme.handlebars'), 'utf8'),
                                {
                                    genre: baseDir,
                                    words: sorted_dictionary.slice(0, 49),
                                    songs: songs,
                                }
                            );

                            //TO DO: Can be improved ?
                            return Promise.all([
                                writeToFile(`${base_dir}/words.json`, JSON.stringify(sorted_dictionary)),
                                writeToFile(`${base_dir}/songs.json`, JSON.stringify(songs)),
                                writeToFile(`${base_dir}/README.md`, readme)
                            ]).then(files => files.forEach(f => console.log(`File ${f} saved successfully`)));

                        }).finally(() => cleanUpFinish(baseDir).then(() => resolve("Process completed")));

                    })
                })
                .catch((err) => reject(err));
        });
    });
}

module.exports = main;