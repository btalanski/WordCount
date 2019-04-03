const writeToFile = require("./writeToFile.js");

function write(html = "", title = ""){
    const filename = title.replace(" ", "_");
    if(!!html){
        writeToFile(`../data/songs_html/${filename}.html`, html);
    }
}

module.exports = write;