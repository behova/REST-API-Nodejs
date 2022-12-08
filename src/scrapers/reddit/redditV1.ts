import { ImageObject } from '@/resources/imageObject/imageObject.interface';
import ImageObjectService from '@/resources/imageObject/imageObject.service';
import getUrls from './getUrls';
import Scraper from '@/utils/interfaces/scraper.interface';
import buildObjectsNew from './buildObjects_new';
import Logger from '@/utils/logger';

class RedditScraper implements Scraper {
    ScrollAmount: number = Math.floor(Math.random() * 30);
    SourceList = [
        'https://www.reddit.com/r/wallpapers/',
        'https://www.reddit.com/r/wallpaper/',
        'https://www.reddit.com/r/wallpaperdump/',
        'https://www.reddit.com/r/wallpaperengine/',
    ];
    private ImageObjectService = new ImageObjectService();
    private logger = Logger.getLogger('redditScraper');

    constructor() {
        this.initScrape();
    }

    private async initScrape(): Promise<void> {
        this.logger.info('Initiating scrape');
        let urlNumber = Math.floor(Math.random() * this.SourceList.length);
        let urls = await getUrls(this.SourceList[urlNumber], this.ScrollAmount);
        let objects = await buildObjectsNew(urls);
        this.postMany(objects);
    }

    private postMany = async (
        objects: ImageObject[],
    ): Promise<Response | void> => {
        try {
            const imageObjects = await this.ImageObjectService.postMany(
                objects,
            );

            this.logger.info(imageObjects);
        } catch (error) {
            this.logger.error('Failed to upload images', error);
        }
    };
}

export default RedditScraper;
