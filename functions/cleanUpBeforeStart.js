const fs = require('fs-extra');

const baseDataPath = "./data";

//TO DO: Add any other necessary initialization routine
const cleanUp = (targetDir = "") => createTargetDirStructure(targetDir).then(directoryMap => Promise.resolve(directoryMap));

// TO DO: Make async
const createTargetDirStructure = (targetDir) => {
    const targetDirFullPath = `${baseDataPath}/${targetDir}`;
    const songHtmlFolderPath = `${targetDirFullPath}/songs_html`;
    const songTxtFolderPath = `${targetDirFullPath}/songs`;

    if (!fs.existsSync(baseDataPath)) {
        fs.mkdirSync(baseDataPath);
    }

    if (fs.existsSync(targetDirFullPath)) {
        fs.removeSync(targetDirFullPath);
    }

    fs.mkdirSync(targetDirFullPath);
    fs.mkdirSync(songHtmlFolderPath);
    fs.mkdirSync(songTxtFolderPath);

    return Promise.resolve({
        base_dir: targetDirFullPath,
        html_dir: songHtmlFolderPath,
        text_dir: songTxtFolderPath,
    });

}
module.exports = cleanUp;