import Anzeigen from './src/Crawlers/Anzeigen.js'
import cron from 'node-cron'
import dotenv from 'dotenv'

import { Telegraf } from 'telegraf'
import { findDiffs } from './src/helpers/createTelegramMessage.js';
import settings from './src/helpers/settings.js';

// ******* APPLICATION START ***********

function start() {
    dotenv.config({ path: 'my.env' })
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    bot.start((ctx) => ctx.reply('Herzlich wilkommen zu Immobot'))
    const crawler = new Anzeigen()

    cron.schedule('* * * * *', async () => {
        console.log('PARSING.....')
        const findings = await crawler.crawlSite();
        const diffs = findDiffs(findings)
        diffs.forEach(diff => {
            bot.telegram.sendPhoto(process.env.TELEGRAM_USER_ID, `${diff.picture}`,
                { caption: `\n---------------------\n<b>${diff.title}</b>\n\n<i>${diff.description}</i>\n<a href="${settings.kleinanzeigen.url}/${diff.link}">Zur Seite gehen</a>\n\n${diff.price}\n\n---------------------\n`, parse_mode: 'HTML', disable_web_page_preview: false })
        });
    });
}

start()