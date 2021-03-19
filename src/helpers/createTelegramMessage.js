import settings from './settings.js'
import fs from 'fs'

export const createTelegramMessage = (data = []) => {
    let messageBody = ''
    data.map((element) => (
        messageBody += `<b>${element.title}</b>\n<a href="${settings.kleinanzeigen.url}/${element.link}">Check</a>\n${element.price}\n--\n`

    ))
    return messageBody
}

export const findDiffs = (findings = {}) => {
    const rawData = fs.readFileSync(`./src/data/data_${process.env.TELEGRAM_USER_ID}.json`)
    const storedFindings = JSON.parse(rawData)

    if (storedFindings[0].title === findings[0].title) {
        return []
    }

    const diff = findings.filter((finding, index) => finding.title !== storedFindings[index].title)

    console.log(diff.length + ' differences found')

    if (diff.length) {
        fs.writeFile(`./src/data/data_${process.env.TELEGRAM_USER_ID}.json`, JSON.stringify(findings), (err) => { if (err) throw err; })
        return diff
    }
    return []

}