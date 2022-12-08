import puppeteer from 'puppeteer';
import { redditScraper as logger } from '@/utils/logger';

let getUrls = async function (
    sourceUrl: string,
    scrollAmount: number,
): Promise<string[]> {
    let urls: string[] = [];
    try {
        //pupeteer init
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //specify url
        await page.goto(sourceUrl);
        console.log('root page loaded');
        await page.waitForNetworkIdle();

        console.log(`scrolling ${scrollAmount} times`);

        //Load more images by scrolling down (i) times
        for (let i = 0; i < scrollAmount; ) {
            await page.keyboard.press('PageDown');
            await page.waitForNetworkIdle();
            i += 1;
        }

        //build array of <img> src stop after max number has been collected
        const imgLinks: string[] = await page.evaluate(() => {
            const images = document.querySelectorAll('img');

            //removes all other data from <img> and returns just the src
            const urls = Array.from(images).map((v) => v.src);

            //only returns src with preview link
            let urlsCleaned = [];
            for (let i = 0; i < urls.length; ) {
                if (urls[i].includes('https://preview.redd.it/')) {
                    urlsCleaned.push(urls[i]);
                    i += 1;
                } else {
                    i += 1;
                }
            }

            //takes preview link removes extra info and appends proper url
            let urlsSliced = [];
            for (let i in urlsCleaned) {
                let slice = urlsCleaned[i].slice(15, 41);
                urlsSliced.push('https://i' + slice);
            }

            //only push urls that end in image format
            let urlImages = [];
            for (let i in urlsSliced) {
                if (urlsSliced[i].includes('jpg')) {
                    urlImages.push(urlsSliced[i]);
                } else if (urlsSliced[i].includes('png')) {
                    urlImages.push(urlsSliced[i]);
                }
            }
            return urlImages;
        });

        await browser.close();
        logger.info(`found ${imgLinks.length} images`);

        for (let i in imgLinks) {
            urls.push(imgLinks[i]);
        }
    } catch (error) {
        logger.error('geturls:', error);
    }
    return urls;
};

export default getUrls;
