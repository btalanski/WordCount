
const path = require('path');
const fs = require('fs');
const songs = path.join(__dirname, 'data/songs');
const word_count = require('./word_count.js');

fs.readdir(songs, function (err, files) {
    if (err) {
        return console.log('Error: ' + err);
    } 
    
    let words = [];

    files.forEach(function (file) {
        const text = fs.readFileSync(path.join(__dirname, 'data/songs', file), 'utf8');
        const words_list = word_count(text);
        words = [...words, ...words_list];
    });

    console.log(words);

    const dictionary = words.reduce((dictionary, word) => {
        const key = word.toLowerCase();
        if(dictionary[key]){
            dictionary[key] = dictionary[key] + 1;
        }
        else{
            dictionary[key] = 1
        }

        return dictionary;
    }, {});

    const sorted_dictionary = Object.keys(dictionary)
        .map(word => ({ word, count: dictionary[word] }))
        .sort((a,b) => a.count - b.count).reverse();
    
    fs.writeFileSync('./words.json', JSON.stringify(sorted_dictionary));
    fs.writeFileSync('./words_25.json', JSON.stringify(sorted_dictionary.slice(0, 24)));
    fs.writeFileSync('./words_50.json', JSON.stringify(sorted_dictionary.slice(0, 49)));
    fs.writeFileSync('./words_100.json', JSON.stringify(sorted_dictionary.slice(0, 99)));
    fs.writeFileSync('./words_500.json', JSON.stringify(sorted_dictionary.slice(0, 499)));
    fs.writeFileSync('./words_1000.json', JSON.stringify(sorted_dictionary.slice(0, 9999)));
    console.log(sorted_dictionary);
});