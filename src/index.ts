import cron from 'node-cron'
import {constructSingleMessage, findMatches, constructListForMessage, findMatchesRedis} from './helpers';
import { randomizeGiphy } from './helpers/instaFeatures';
import { init } from './modules';
import IFinding from './types/IFinding';
import { Logger } from "log4js";
import { Parser } from "./Parser";
import { RedisClientType } from "redis";
import { Telegraf } from "telegraf";
// import {Channel, Options} from "amqplib";
// import Publish = Options.Publish;

import { createClient } from 'redis';
import client from "amqplib";

async function start() {
    const { logger, settings, telegramBot, parser, redisClient, rabbitMQChannels } = await init()


    await processJob(logger, parser, settings, redisClient, telegramBot, rabbitMQChannels);

    // const cronFreq = process.env.CRON || '*/2 * * * *'
    //
    // cron.schedule(cronFreq, async () => {
    //     await processJob(logger, parser, settings, redisClient, telegramBot, rabbitMQChannels);
    // });
}

async function processJob(logger: Logger, parser: Parser, settings: any, redisClient: RedisClientType, telegramBot: Telegraf, rabbitMQChannels: any) {
    logger.info('parsing started')

    const findings = await parser.parse(settings, logger)
    logger.info(`${findings.length} findings`)

    const matches: IFinding[] = findMatches(findings)
    logger.info(`${matches.length} matches found`)
    console.log(matches)

    const matchesRedis: IFinding[] = await findMatchesRedis(redisClient, findings)
    logger.info(`${matchesRedis.length} matchesRedis found`)
    console.log(matchesRedis)

    if (matches.length > 3) {
        const message = constructListForMessage(matches)
        await telegramBot.telegram.sendAnimation(process.env.TELEGRAM_USER_ID, `${randomizeGiphy()}`,
            {
                caption: message, parse_mode: 'HTML', disable_web_page_preview: false, disable_notification: true
            }).catch((e: any) => logger.error('batch sending resulted to ', e));

    } else {
        await Promise.all(matches.map(async (match: IFinding, index: number) => {
            // send telegram messages
            await telegramBot.telegram.sendPhoto(process.env.TELEGRAM_USER_ID, `${match.picture}`,
                {
                    caption: constructSingleMessage(match), parse_mode: 'HTML', disable_web_page_preview: false,
                    disable_notification: index > 2
                }).catch((e: any) => logger.error('single sending resulted to ', e));


            // publish to rabbitMQ

            // let options: Publish = {
            //     headers:
            // }
            //
            // for (const ch:Channel of rabbitMQChannels) {
            //
            //     ch.("immobot-instant", JSON.stringify(match),)
            // }

        })).catch((e) => logger.error('Telegram message sending results to ', e));
    }
}

start()