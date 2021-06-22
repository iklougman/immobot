import Kleinanzeigen from './Crawlers/Kleinanzeigen'
import CMS from './Crawlers/CMS/CMS';
import IFinding from './types/IFinding';
import ISetting from './types/ISetting';
import Praxis from './Crawlers/Praxis';

export class Parser {
    async parse(settings: ISetting[], logger: any) {
        logger.level = 'info'
        const anzeigenCrawler = new Kleinanzeigen()
        const cmsCrawler = new CMS()
        const praxisParser = new Praxis()
        return await Promise.all(settings.map(async (setting: ISetting) => {
            logger.info(`crawl ${setting.name} with ${setting.type} parser type`)
            switch (setting.type) {
                case 'generic':
                    return await anzeigenCrawler.crawlSite(setting.url, logger)
                case 'praxis':
                    return await praxisParser.crawlSite(setting.url, logger)
                default:
                    return await cmsCrawler.crawlSite(setting.url);
            }

        }))
            // @ts-ignore
            .then((data: IFinding[]) => data.flat())
            .catch(err => console.log(err))
    }

}
