import cheerio from 'cheerio'
import { request } from '../helpers/request';


class Praxis {
    async crawlSite(url: string, logger: any) {
        let announcementList = [];
        try {
            const html = await request(url, logger)

            const $ = cheerio.load(html)
            announcementList = $('section[class="m-download-list"]').toArray()

            return announcementList.map((node, i) => {
                const date = new Date()

                const title = $(node).find('.m-download-list__item-title span').text()
                const description = $(node).find('.m-download-list__header h2').text() || `Neues Dokument, gefunden am ${date.toLocaleString()}`
                const link = $(node).find('.m-download-list__list a').attr('href') || ''
                logger.info(title)
                return {
                    id: i,
                    title,
                    description,
                    link: 'https://www.kvno.de' + link || '',
                    price: '',
                    priceNum: '',
                    type: 'praxis',
                    picture: 'https://image.flaticon.com/icons/png/512/337/337946.png',
                    hashtags: ''
                }
            }).filter(Boolean)

        } catch (error) {
            logger.error(error.message)
        };
    }
}

export default Praxis