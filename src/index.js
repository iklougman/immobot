import Anzeigen from './Crawlers/Anzeigen.js'
import cron from 'node-cron'
import dotenv from 'dotenv'

import { Telegraf } from 'telegraf'
import { findDiffs } from './helpers/createTelegramMessage.js';
import settings from './helpers/settings.js';
import SparkImmobilien from './Crawlers/SparkImmobilien.js';

// ******* APPLICATION START ***********

async function start() {
    dotenv.config()
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    bot.start((ctx) => ctx.reply('Herzlich wilkommen zu Immobot'))
    const anzeigenCrawler = new Anzeigen()
    const sparkImmoCrawler = new SparkImmobilien()
    cron.schedule('* * * * *', async () => {
        console.log('PARSING.....')
        const findings1 = await anzeigenCrawler.crawlSite();
        const findings2 = await sparkImmoCrawler.crawlSite();

        const diffs = findDiffs([...findings1, ...findings2])
        diffs.forEach(diff => {
            bot.telegram.sendPhoto(process.env.TELEGRAM_USER_ID, `${diff.picture}`,
                { caption: `\n---------------------\n<b>${diff.title}</b>\n\n<i>${diff.description}</i>\n<a href="${settings.kleinanzeigen.url}/${diff.link}">Zur Seite gehen</a>\n\n${diff.price}\n\n---------------------\n`, parse_mode: 'HTML', disable_web_page_preview: false })
        });
    });
}

start()