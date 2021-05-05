import dotenv from 'dotenv'
import { getLogger } from 'log4js';
import { readFile, checkFileIsPresent, createEmptyJsonFile } from '../fileSystem';
import { Parser } from '../Parser';
import { Telegraf } from 'telegraf'

export const init = () => {
    /**
    * Initialize dot.env
    * Initialize settings
    * get city to start parsing (Berlin, Munich, Hamburg etc.)
    */
    dotenv.config()

    const logger = getLogger()
    logger.level = "default";
    const city = process.env.CITY
    const jsonFileName = process.env.TELEGRAM_USER_ID!
    logger.info('starting parser for ' + city)

    if (!city) return null

    const settings = readFile('../config', `${city}.json`)

    /**
     * check if json file for short time storage is present
     * if not create one
     */

    const isJsonFilePresent = checkFileIsPresent(jsonFileName)

    if (!isJsonFilePresent) {
        createEmptyJsonFile(jsonFileName)
    }

    /**
   * Instantiate bot and parser
   */
    // @ts-ignore
    const telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    telegramBot.start((ctx) => ctx.reply('Herzlich wilkommen zu Immobot'))
    const parser = new Parser()

    return { logger, settings, telegramBot, parser }
}
