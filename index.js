const args = require('minimist')(process.argv.slice(2));
const main = require("./main");

main(args)
    .then(result => console.log(result))
    .catch(err => console.log(err))
    .finally(() => process.exit());