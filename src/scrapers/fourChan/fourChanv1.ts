import { ImageObject } from '@/resources/imageObject/imageObject.interface';
import ImageObjectService from '@/resources/imageObject/imageObject.service';
import getUrls from './getUrls';
import buildObjectsNew from './buildObjects_new ';
import HttpException from '@/utils/exceptions/http.exception';
import Scraper from '@/utils/interfaces/scraper.interface';
import Logger from '@/utils/logger';

class FourChanScraper implements Scraper {
    ScrollAmount: number = Math.floor(Math.random() * 30);
    SourceList = [
        'https://boards.4chan.org/wg/2',
        'https://boards.4channel.org/w/',
    ];
    private ImageObjectService = new ImageObjectService();
    private logger = Logger.getLogger('fourChanScraper');

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

export default FourChanScraper;
