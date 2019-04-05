const scrapper = require("./main");
const taskList = require("./tasks.json");

(taskList || []).reduce((prevPromise, taskArgs, i) => {
    return prevPromise.then(() => {
        return scrapper(taskArgs)
            .then(result => console.log(result))
            .catch(err => console.log(err))
    });
}, Promise.resolve(''));