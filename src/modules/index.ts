import dotenv from 'dotenv'
import {getLogger, Logger} from 'log4js';
import { readFile, checkFileIsPresent, createEmptyJsonFile } from '../fileSystem';
import { Parser } from '../Parser';
import { Telegraf } from 'telegraf'
import {createClient, RedisClientType} from 'redis';
import client, {Channel } from 'amqplib'



export const init = async () : Promise<[logger:Logger, settings:any, telegramBot:Telegraf, parser:Parser, redisClient:RedisClientType, channels:Channel[]]> => {
    /**
    * Initialize dot.env
    * Initialize settings
    * get city to start parsing (Berlin, Munich, Hamburg etc.)
    */
    dotenv.config()

    const logger = getLogger()
    logger.level = "debug";
    const city = process.env.CITY
    const jsonFileName = process.env.TELEGRAM_USER_ID!
    logger.info('starting parser for ' + city)

    if (!city) return Promise.reject();

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
     * Instantiate telegram bot
     */
    // @ts-ignore
    const telegramBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    telegramBot.start((ctx) => ctx.reply('Herzlich wilkommen zu Immobot'))

    /**
     * Instantiate parser
     */
    const parser = new Parser()


    /**
     * Instantiate redis
     */
    // // url: 'redis[s]://[[username][:password]@][host][:port][/db-number]'
    // const redisClient = createClient({
    //     url: 'redis://localhost:6379'
    // });
    const redisClient = createClient();
    redisClient.on('error', (err) => console.log('Redis Client Error', err));
    // redisClient.connect().then((data)=>{
    //     console.log(data)
    // }).catch((err)=>{
    //     console.error(err)
    // })
    await redisClient.connect();

    /**
     * Instantiate rabbitMQ
     */
    // const connection: Connection = await client.connect(
    //     'amqp://username:password@localhost:5672'
    // )
    // Create channels
    let channels: Channel[] = []
    // const channelInstant: Channel = await connection.createChannel()// Makes the queue available to the client
    // await channelInstant.assertQueue('immobot-instant')
    //
    // const channelDelayed: Channel = await connection.createChannel()// Makes the queue available to the client
    // await channelDelayed.assertQueue('immobot-delayed')
    //
    // channels.push(channelInstant,channelDelayed)

    return { logger, settings, telegramBot, parser, redisClient, channels }
}
