import IFinding from '../types/IFinding'
import { randomizeEmoji } from './instaFeatures'
import { readFile, storeFile } from '../fileSystem'
import {RedisClientType} from "redis";
import {newFindings} from "../fixtures";

/**
 * 
 * @param {IFinding} diff argument is a difference object between previously 
 * parsed and current announcement list
 * @returns {string} telegram bot single massage made of differnce object
 */

export const constructSingleMessage = (diff: IFinding): string => {
    const emoji = randomizeEmoji()
    const { title, description, link, price, hashtags } = diff
    return `${emoji}<b>${title}</b>\n\n<i>${description}</i>\n\n<b>\u{1F4B6} ${price}</b>\n\n<a href="${link}">\u{1F50D} ansehen</a>\n\n${hashtags}\n`
}

/**
 * add some logic for many matches. Send list of matches instead off annoying messages
 */
export const constructListForMessage = (diffs: IFinding[]): string => {
    const maxMatchesNumber = diffs.length > 20 ? 20 : diffs.length
    let message = `<b>Wir schätzen Deine Ruhe</b>\nund fassen ${maxMatchesNumber} neue Immobilienangebote zusammen:\n\n`
    diffs.map((diff, i) => {
        /**
         * doesn't make a huge sense to send more than 20 matches,
         * if yes there is something wrong
         */
        if (i > 20) return ""
        const { title, link, price } = diff

        message = message.concat(`${title.slice(0, 20).concat('...')}<b>\u{1F4B6} ${price} </b><a href="${link}">ansehen \u{27A1}</a>\n\n`)
    })
    return message
}

export const findMatches = (findings = []) => {

    const storedFindings = readFile('../data', `/data_${process.env.TELEGRAM_USER_ID}.json`)
    // @ts-ignore
    const differences = findings.filter(({ title: id1, priceNum: pr1 }) => !storedFindings.some(({ title: id2, priceNum: pr2 }) => id2 === id1 && pr2 === pr1));

    if (!storedFindings.length) {
        storeFile(findings)
        return differences
    }

    console.log(differences.length + ' differences found')

    if (differences.length) {
        storeFile([...storedFindings, ...differences])
        return differences
    }
    return []

}

export const findMatchesRedis = async (client: RedisClientType, findings: IFinding[]) : IFinding[] => {
    let diff: IFinding[] = []

    // let opt: SetOptions = {
    //
    // }

    for (const f of findings) {
        const exists = await client.exists(f.link)
        if (!exists) {
            diff.push(f)
            await client.set(f.link, JSON.stringify(f))
        }
    }
    console.log(diff.length + ' differences found')

    return diff
}