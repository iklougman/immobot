import axios from 'axios'
import cheerio from 'cheerio'
import { generateHashTags } from '../helpers/instaFeatures';


class Kleinanzeigen {
    async crawlSite(url: string) {
        let announcementList = [];
        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
                    "Accept-Language": "de-DE,en-US;q=0.9,en;q=0.8"
                }
            })
            const html = response.data
            const $ = cheerio.load(html)
            announcementList = $('article[class="aditem"]').toArray()
            const data = announcementList.map((node, i) => {
                const price = $(node).find('.aditem-main--middle--price').text().trim()
                const priceNum = parseFloat(price.split('.').join('')) || 0
                const hashtags = generateHashTags(priceNum)
                return {
                    id: i,
                    title: $(node).find('.text-module-begin a').text() || '',
                    description: $(node).find('p[class="aditem-main--middle--description"]').text() || '',
                    link: 'https://www.ebay-kleinanzeigen.de' + $(node).attr('data-href') || '',
                    price,
                    priceNum,
                    type: 'announcement',
                    picture: $(node).find('.imagebox').attr('data-imgsrc'),
                    hashtags
                }
            })
            return data

        } catch (error) {
            // logger.error(error.message)
        };
        // logger.info(`Retailer ${this.getRetailerName()} stock text is returning: ${stock_list}`);
    }
}

export default Kleinanzeigen