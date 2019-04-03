const stop_words = require("./stopwords.json");
module.exports = function (text = "") {
    const words = text.replace(/[\n\r]/g, " ").replace(/,/g, " ").replace(/[-\/\\^$*+?'"()!|[\]{}|...]/g, "").split(' ');
    return words
        .map(word => word.toLowerCase())
        .filter(word => stop_words.indexOf(word) < 0)
        .filter(word => word.length > 2);
}