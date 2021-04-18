import path from 'path'
import fs from 'fs'

export const writingFile = (findings: any) => {
    fs.writeFile(path.join(__dirname, '../data', `/data_${process.env.TELEGRAM_USER_ID}.json`), JSON.stringify(findings), (err) => { if (err) throw err; })
}

export const findDiffs = (findings = []) => {
    const rawData = fs.readFileSync(path.join(__dirname, '../data', `/data_${process.env.TELEGRAM_USER_ID}.json`))
    const storedFindings = JSON.parse(rawData.toString()) || []
    // @ts-ignore
    const diff = findings.filter(({ title: id1, priceNum: pr1 }) => !storedFindings.some(({ title: id2, priceNum: pr2 }) => id2 === id1 && pr2 === pr1));

    if (!storedFindings.length) {
        writingFile(findings)
        return diff
    }

    console.log(diff.length + ' differences found')

    if (diff.length) {
        writingFile([...storedFindings, ...diff])
        return diff
    }
    return []

}

export const textFilter = (titleString: string) => {
    //add regexp
}