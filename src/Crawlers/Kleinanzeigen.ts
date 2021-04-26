import cheerio from 'cheerio'
import { searchFilter, vbFilter } from '../helpers/filters';
import { generateHashTags } from '../helpers/instaFeatures';
import { request } from '../helpers/request';


class Kleinanzeigen {
    async crawlSite(url: string, logger: any) {
        let announcementList = [];
        try {
            const html = await request(url, logger)
            const $ = cheerio.load(html)
            announcementList = $('article[class="aditem"]').toArray()
            return announcementList.filter((node, i) => {
                const price = $(node).find('.aditem-main--middle--price').text().trim()

                /**
                 * return false when price is VB
                 * the probability is high, that 
                 * announcement is crap
                 */
                if (vbFilter(price)) return false

                const title = $(node).find('.text-module-begin a').text() || ''
                /**
                 * return false for annoying "I'm searching" announcements
                 */
                if (searchFilter(title)) return false

                const priceNum = parseFloat(price.split('.').join('')) || 0

                /**
                 * return false for prices higher than 800000
                 */
                if (priceNum > 800801) return false
                logger.info(title)
                const hashtags = generateHashTags(priceNum)
                return {
                    id: i,
                    title,
                    description: $(node).find('p[class="aditem-main--middle--description"]').text() || '',
                    link: 'https://www.ebay-kleinanzeigen.de' + $(node).attr('data-href') || '',
                    price,
                    priceNum,
                    type: 'announcement',
                    picture: $(node).find('.imagebox').attr('data-imgsrc'),
                    hashtags
                }
            }).filter(Boolean)

        } catch (error) {
            logger.error(error.message)
        };
    }
}

export default Kleinanzeigen