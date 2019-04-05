const fs = require('fs');

module.exports = function (path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, function (err) {
            if (err) return reject(err);
            return resolve(path);
        });
    });
    
}