import cron from 'node-cron'
import dotenv from 'dotenv'

import { Telegraf } from 'telegraf'
import { findDiffs } from './helpers/createTelegramMessage';

import { randomizeEmoji } from './helpers/instaFeatures';
import { Parser } from './Parser';
import IFinding from './types/IFinding';

// ******* APPLICATION START ***********

async function start() {
    dotenv.config()
    // @ts-ignore
    const telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    telegramBot.start((ctx) => ctx.reply('Herzlich wilkommen zu Immobot'))
    const parser = new Parser()

    cron.schedule('* * * * *', async () => {
        console.log('PARSING.....')
        const findings = await parser.parse()
        console.log(randomizeEmoji())

        const diffs: IFinding[] = findDiffs(findings)
        diffs.forEach((diff: IFinding) => {
            // bot.telegram.sendPhoto('@immochannel', `${diff.picture}`,
            const emoji = randomizeEmoji()
            // @ts-ignore
            try {
                // @ts-ignore
                telegramBot.telegram.sendPhoto(process.env.TELEGRAM_USER_ID, `${diff.picture}`,
                    { caption: `${emoji}<b>${diff.title}</b>\n<i>${diff.description}</i>\n<a href="${diff.link}">Zur Seite gehen</a>\n\n${diff.price}\n\n${diff.hashtags}\n`, parse_mode: 'HTML', disable_web_page_preview: false })
            } catch (error) {
                console.log(error)
            }

        });
    });
}

start()