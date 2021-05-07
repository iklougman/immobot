import cron from 'node-cron'
import { constructSingleMessage, findMatches, constructListForMessage } from './helpers';
import { randomizeGiphy } from './helpers/instaFeatures';
import { init } from './modules';
import IFinding from './types/IFinding';

async function start() {
    const start: any = init()
    const { logger, settings, telegramBot, parser } = start

    cron.schedule('*/2 * * * *', async () => {

        logger.info('parsing started')

        const findings = await parser.parse(settings, logger)

        const matches: IFinding[] = findMatches(findings)

        logger.info(`${matches.length} matches found`)

        if (matches.length > 3) {
            const message = constructListForMessage(matches)
            await telegramBot.telegram.sendAnimation(process.env.TELEGRAM_USER_ID, `${randomizeGiphy()}`,
                {
                    caption: message, parse_mode: 'HTML', disable_web_page_preview: false, disable_notification: true
                })
        }

        await Promise.all(matches.map(async (match: IFinding, index: number) => {
            await telegramBot.telegram.sendPhoto(process.env.TELEGRAM_USER_ID, `${match.picture}`,
                {
                    caption: constructSingleMessage(match), parse_mode: 'HTML', disable_web_page_preview: false,
                    disable_notification: index > 2 && true
                })
        })).catch((e) => logger.error('Telegram message sending results to ', e));
    });
}

start()