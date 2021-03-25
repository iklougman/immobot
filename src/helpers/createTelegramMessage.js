import settings from './settings.js'
import path from 'path'
import fs from 'fs'

export const createTelegramMessage = (data = []) => {
    let messageBody = ''
    data.map((element) => (
        messageBody += `<b>${element.title}</b>\n<a href="${settings.kleinanzeigen.url}/${element.link}">Check</a>\n${element.price}\n--\n`

    ))
    return messageBody
}

export const findDiffs = (findings = []) => {
    const rawData = fs.readFileSync(path.join(__dirname, '../data', `/data_${process.env.TELEGRAM_USER_ID}.json`)) || []
    const storedFindings = JSON.parse(rawData) || []

    if (!storedFindings.length) return findings

    const [firstStored = {}] = storedFindings;
    const [first = {}] = findings;
    if (JSON.stringify(firstStored) === JSON.stringify(first)) {
        console.log('0 differences found')
        return []
    }
    const diff = findings.filter((finding, index) => {
        if (!!storedFindings[index] && finding.priceNum < 450000 && finding.priceNum > 100000) {
            return finding.link !== storedFindings[index].link
        }
        return false
    })

    console.log(diff.length + ' differences found')

    if (diff.length) {
        fs.writeFile(path.join(__dirname, '../data', `/data_${process.env.TELEGRAM_USER_ID}.json`), JSON.stringify(findings), (err) => { if (err) throw err; })
        return diff
    }
    return []

}