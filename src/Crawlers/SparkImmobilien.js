// import { Logger } from "../Logger"
// import { Crawler } from "./Crawler";
import axios from 'axios'
import cheerio from 'cheerio'


class SparkImmobilien {
    // getRetailerName() {
    //     return "Anzeigen"
    // }
    // productIsValid(stock) {
    //     return !stock.includes("is currently unavailable.")
    // }
    async crawlSite(logger) {
        let announcementList = [];
        try {
            const response = await axios.get('https://www.s-immobilienpartner.de/immodirekt/immobilien/?post_type=immomakler_object&vermarktungsart=kauf&nutzungsart&typ=haus&ort&center&radius=500&objekt-id&collapse&von-qm=0.00&bis-qm=890.00&von-zimmer=0.00&bis-zimmer=14.00&von-kaltmiete=0.00&bis-kaltmiete=100.00&von-kaufpreis=0.00&bis-kaufpreis=4475000.00', {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
                    "Accept-Language": "de-DE,en-US;q=0.9,en;q=0.8"
                }
            })
            const html = response.data
            const $ = cheerio.load(html)
            announcementList = $('div[class="property-container"]').toArray()
            return announcementList.map((node, i) => {
                const price = $(node).find('.price').text()
                const description = $(node).find('div.dt, div.dd').toArray().map((el, i) => $(el).text() + (i % 2 ? ', ' : ' ')).join('')
                return {
                    id: i,
                    title: $(node).find('.property-subtitle').text() || '',
                    description,
                    link: $(node).find('.thumbnail').attr('href') || '',
                    price,
                    priceNum: parseFloat(price.match(/\d+/g).join('')) || 0,
                    type: 'sparkimmobilien',
                    picture: $(node).find('img').attr('src'),
                }
            })

        } catch (error) {
            // logger.error(error.message)
        };
        // logger.info(`Retailer ${this.getRetailerName()} stock text is returning: ${stock_list}`);
    }
}

export default SparkImmobilien