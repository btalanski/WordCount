const fs = require('fs-extra');

const baseDataPath = "./data";

//TO DO: Add any other necessary initialization routine
const cleanUpStart = (targetDir = "") => {
    const dirStructure = targets(targetDir);
    return createTargetDirStructure(dirStructure).then(directoryMap => Promise.resolve(directoryMap))
}

const cleanUpEnd = (targetDir = "") => {
    const dirStructure = targets(targetDir);
    return removeTargetDirStructure(dirStructure).then(directoryMap => Promise.resolve(directoryMap))
}

// TO DO: Make async
const createTargetDirStructure = ({ targetDirFullPath, songHtmlFolderPath, songTxtFolderPath }) => {
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

const removeTargetDirStructure = ({ targetDirFullPath, songHtmlFolderPath, songTxtFolderPath }) => {
    if (fs.existsSync(songHtmlFolderPath)) {
        fs.removeSync(songHtmlFolderPath);
    }

    if (fs.existsSync(songTxtFolderPath)) {
        fs.removeSync(songTxtFolderPath);
    }

    return Promise.resolve();
}

const targets = (targetDir) => {
    const targetDirFullPath = `${baseDataPath}/${targetDir}`;
    const songHtmlFolderPath = `${targetDirFullPath}/songs_html`;
    const songTxtFolderPath = `${targetDirFullPath}/songs`;

    return { targetDirFullPath, songHtmlFolderPath, songTxtFolderPath };
}
module.exports = {
    cleanUpBeforeStart: cleanUpStart,
    cleanUpAfterFinish: cleanUpEnd,
};