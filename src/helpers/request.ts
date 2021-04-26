import axios from 'axios'

export const request = async (url: string = '', logger: any) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
                "Accept-Language": "de-DE,en-US;q=0.9,en;q=0.8"
            }
        })
        return response.data
    } catch (error) {
        logger.error(error);

    }

}