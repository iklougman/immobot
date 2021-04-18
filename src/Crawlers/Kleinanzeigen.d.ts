declare class Kleinanzeigen {
    crawlSite(url: string): Promise<{
        id: number;
        title: string;
        description: string;
        link: string;
        price: string;
        priceNum: number;
        type: string;
        picture: string | undefined;
        hashtags: string;
    }[] | undefined>;
}
export default Kleinanzeigen;
