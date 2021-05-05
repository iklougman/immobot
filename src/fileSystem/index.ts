import fs from 'fs'
import path from 'path'

/**
 * @param {string} fileName - file name to check if there is a json file
 * @returns {boolean}
 */

export const checkFileIsPresent = (fileName: string) => {
    try {
        if (fs.existsSync(path.join(__dirname, '../data', `/data_${fileName}.json`))) {
            console.log("The file exists.");
            return true
        } else {
            console.log('The file does not exist.');
            return false
        }
    } catch (err) {
        console.error(err);
    }
}

/**
 * Creating an empty json file
 */

export const createEmptyJsonFile = (jsonFileName: string) => {
    fs.writeFile(path.join(__dirname, '../data', `/data_${jsonFileName}.json`), JSON.stringify(""), (err) => { if (err) throw err; })
}

/**
 * @params {any} findings - if difference is found, save it in the json file
 */

export const storeFile = (findings: any) => {
    fs.writeFile(path.join(__dirname, '../data', `/data_${process.env.TELEGRAM_USER_ID}.json`), JSON.stringify(findings), (err) => { if (err) throw err; })
}

/**
 * @params {any} findings - if difference is found, save it in the json file
 */

export const readFile = (filePath = '/', fileName = '') => {
    const rawData = fs.readFileSync(path.join(__dirname, filePath, fileName))
    return JSON.parse(rawData.toString()) || []
}