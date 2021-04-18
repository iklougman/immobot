import Kleinanzeigen from './Crawlers/Kleinanzeigen'
import CMS from './Crawlers/CMS/CMS';
import settings from './Crawlers/settings'
import IFinding from './types/IFinding';

export class Parser {
    async parse() {
        const anzeigenCrawler = new Kleinanzeigen()
        const cmsCrawler = new CMS()
        return await Promise.all(settings.map(async (setting) => {
            switch (setting.type) {
                case 'generic':
                    return await anzeigenCrawler.crawlSite(setting.url)
                default:
                    return await cmsCrawler.crawlSite(setting.url);
            }

        }))
            // @ts-ignore
            .then((data: IFinding[]) => data.flat())
            .catch(err => console.log(err))
    }

}
