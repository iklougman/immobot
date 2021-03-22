// import { Logger } from "../Logger"
// import { Crawler } from "./Crawler";
import axios from 'axios'
import cheerio from 'cheerio'


class Anzeigen {
    // getRetailerName() {
    //     return "Anzeigen"
    // }
    // productIsValid(stock) {
    //     return !stock.includes("is currently unavailable.")
    // }
    async crawlSite(logger) {
        let announcementList = [];
        try {
            const response = await axios.get('https://www.ebay-kleinanzeigen.de/s-haus-kaufen/koeln/haus/k0c208l945', {
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
                return {
                    id: i,
                    title: $(node).find('.text-module-begin a').text() || '',
                    description: $(node).find('p[class="aditem-main--middle--description"]').text() || '',
                    link: $(node).attr('data-href') || '',
                    price,
                    priceNum: parseFloat(price.split('.').join('')) || 0,
                    type: 'announcement',
                    picture: $(node).find('.imagebox').attr('data-imgsrc'),
                }
            })
            return data

        } catch (error) {
            // logger.error(error.message)
        };
        // logger.info(`Retailer ${this.getRetailerName()} stock text is returning: ${stock_list}`);
    }
}

export default Anzeigen