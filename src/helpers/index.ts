import path from 'path'
import fs from 'fs'
import IFinding from '../types/IFinding'
import { randomizeEmoji } from './instaFeatures'

/**
 * 
 * @param diff argument is a difference object between previously parsed and current announcement list
 * @returns telegram bot single massage made of differnce object
 */

export const constructSingleMessage = (diff: IFinding): string => {
    const emoji = randomizeEmoji()
    const { title, description, link, price, hashtags } = diff
    return `${emoji}<b>${title}</b>\n\n<i>${description}</i>\n\n<b>\u{1F4B6} ${price}</b>\n\n<a href="${link}">\u{1F50D} ansehen</a>\n\n${hashtags}\n`
}

// export const constructListForMessage = (diffs: IFinding[]): string => {
/**
 * add some logic for many matches. Send list of matches instead off annoying messages
 */
// const emoji = randomizeEmoji()
// const lists =
// const { title, description, link, price, hashtags } = diff
// return `${emoji}<b>${title}</b>\n<i>${description}</i>\n<a href="${link}">Zur Seite gehen</a>\n\n${price}\n\n${hashtags}\n`
// }



export const writingFile = (findings: any) => {
    fs.writeFile(path.join(__dirname, '../data', `/data_${process.env.TELEGRAM_USER_ID}.json`), JSON.stringify(findings), (err) => { if (err) throw err; })
}

export const readFile = (filePath = '/', fileName = '') => {
    const rawData = fs.readFileSync(path.join(__dirname, filePath, fileName))
    return JSON.parse(rawData.toString()) || []
}

export const findMatches = (findings = []) => {

    const storedFindings = readFile('../data', `/data_${process.env.TELEGRAM_USER_ID}.json`)
    // @ts-ignore
    const differences = findings.filter(({ title: id1, priceNum: pr1 }) => !storedFindings.some(({ title: id2, priceNum: pr2 }) => id2 === id1 && pr2 === pr1));

    if (!storedFindings.length) {
        writingFile(findings)
        return differences
    }

    console.log(differences.length + ' differences found')

    if (differences.length) {
        writingFile([...storedFindings, ...differences])
        return differences
    }
    return []

}

export const textFilter = (titleString: string) => {
    //add regexp
}