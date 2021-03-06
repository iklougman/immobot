import cron from 'node-cron'
import { constructSingleMessage, findMatches, constructListForMessage } from './helpers';
import { randomizeGiphy } from './helpers/instaFeatures';
import { init } from './modules';
import IFinding from './types/IFinding';

async function start() {
    const start: any = init()
    const { logger, settings, telegramBot, parser } = start

    const cronFreq = process.env.CRON || '*/2 * * * *'

    cron.schedule(cronFreq, async () => {

        logger.info('parsing started')

        const findings = await parser.parse(settings, logger)

        const matches: IFinding[] = findMatches(findings)

        logger.info(`${matches.length} matches found`)
        console.log(matches)
        if (matches.length > 3) {
            const message = constructListForMessage(matches)
            await telegramBot.telegram.sendAnimation(process.env.TELEGRAM_USER_ID, `${randomizeGiphy()}`,
                {
                    caption: message, parse_mode: 'HTML', disable_web_page_preview: false, disable_notification: true
                }).catch((e: any) => logger.error('batch sending resulted to ', e));
        }

        await Promise.all(matches.map(async (match: IFinding, index: number) => {
            await telegramBot.telegram.sendPhoto(process.env.TELEGRAM_USER_ID, `${match.picture}`,
                {
                    caption: constructSingleMessage(match), parse_mode: 'HTML', disable_web_page_preview: false,
                    disable_notification: index > 2
                }).catch((e: any) => logger.error('single sending resulted to ', e));
        })).catch((e) => logger.error('Telegram message sending results to ', e));
    });
}

start()