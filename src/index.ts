import cron from 'node-cron'
import dotenv from 'dotenv'

import { Telegraf } from 'telegraf'
import { constructSingleMessage, findMatches, readFile } from './helpers';
import { Parser } from './Parser';
import IFinding from './types/IFinding';
import { getLogger } from 'log4js';

// ******* APPLICATION START ***********

async function start() {
    /**
     * Initialize dot.env
     * Initialize settings
     * get city to start parsing (Berlin, Munich, Hamburg etc.)
     */
    dotenv.config()
    const logger = getLogger()
    logger.level = "info";
    const city = process.env.CITY
    logger.info('starting parser for ' + city)

    if (!city) return null

    const settings = readFile('../config', `${city}.json`)
    /**
     * Instantiate bot and parser
     */
    // @ts-ignore
    const telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    telegramBot.start((ctx) => ctx.reply('Herzlich wilkommen zu Immobot'))
    const parser = new Parser()

    cron.schedule('*/2 * * * *', async () => {

        logger.info('parsing started')

        const findings = await parser.parse(settings, logger)

        const matches: IFinding[] = findMatches(findings)

        logger.info(`${matches.length} matches found`)

        await Promise.all(matches.map(async (match: IFinding) => {
            //@ts-ignore
            await telegramBot.telegram.sendPhoto(process.env.TELEGRAM_USER_ID, `${match.picture}`,
                {
                    caption: constructSingleMessage(match), parse_mode: 'HTML', disable_web_page_preview: false
                })
        })).catch((e) => logger.error('Telegram message sending results to ', e));
    });
}

start()