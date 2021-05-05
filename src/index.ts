import cron from 'node-cron'
import { constructSingleMessage, findMatches } from './helpers';
import { init } from './modules';
import IFinding from './types/IFinding';



// ******* APPLICATION START ***********

async function start() {
    const start: any = init()
    const { logger, settings, telegramBot, parser } = start

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