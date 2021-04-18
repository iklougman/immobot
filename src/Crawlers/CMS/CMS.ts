import axios from 'axios'
import cheerio from 'cheerio'
import { generateHashTags } from '../../helpers/instaFeatures';

// some maklers use special cms, possibly Openimmo 
// http://www.openimmo.de/go.php/p/24/download.htm
class CMS {
    async crawlSite(url: string): Promise<any> {
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
            announcementList = $('div[class="property-container"]').toArray()
            return announcementList.map((node, i) => {
                const title = $(node).find('.property-subtitle').text() || ''
                const price = $(node).find('.price').text()
                const description = $(node).find('div.dt, div.dd').toArray().map((el, i) => $(el).text() + (i % 2 ? ', ' : ' ')).join('')
                // @ts-ignore
                const priceNum = parseFloat(price.match(/\d+/g).join('')) || 0
                const hashtags = generateHashTags(priceNum)
                return {
                    id: i,
                    title,
                    description,
                    link: $(node).find('.thumbnail').attr('href') || '',
                    price,
                    priceNum,
                    type: 'CMS',
                    picture: $(node).find('img').attr('src'),
                    hashtags
                }
            })

        } catch (error) {
            console.log(error)
        };
        // logger.info(`Retailer ${this.getRetailerName()} stock text is returning: ${stock_list}`);
    }
}

export default CMS