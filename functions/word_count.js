const stop_words = require("./stopwords.json");

module.exports = function(text = ""){
    const words = text.replace(/[\n\r]/g, " ").replace(/,/g, " ").replace(/[-\/\\^$*+?'"()!|[\]{}|...]/g, "").split(' ');
    return words.filter( word => word.length > 0 ).filter( word => stop_words.indexOf(word.toLowerCase()) == -1);
}