const fs = require('fs');

module.exports = function(path, content){
    fs.writeFileSync(path , content);
}