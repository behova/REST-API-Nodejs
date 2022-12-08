import cron from 'cron';
import RedditScraper from '../../scrapers/reddit/redditV1';
import Scheduler from '@/utils/interfaces/scheduler.interface';
import FourChanScraper from '../../scrapers/fourChan/fourChanv1';
import Logger from '@/utils/logger';
import ImageObjectService from './imageObject.service';

class ImageObjectScheduler implements Scheduler {
    private mainSchedule = '0 0 */6 * * *';
    private logger = Logger.getLogger('scheduler');
    private imageObjectService = new ImageObjectService();

    constructor() {
        this.initSchedule();
    }

    public initSchedule(): void {
        this.scheduleScraper();
    }

    public createScraperSchedule(): string {
        let seconds = Math.floor(Math.random() * 59) + 1;
        let minutes = Math.floor(Math.random() * 59) + 1;
        let hours = '*/' + (Math.floor(Math.random() * 6) + 1);
        let day = '*';
        let month = '*';
        let week = '*';
        let time = `${seconds} ${minutes} ${hours} ${day} ${month} ${week}`;

        return time;
    }

    public scheduleScraper(): void {
        let schedule = this.createScraperSchedule();
        let scheduleTwo = this.createScraperSchedule();
        const service = this.imageObjectService;

        const orchestrateJob = new cron.CronJob({
            cronTime: '0 0 */8 * * *',
            onTick: function () {
                scrapeReddit.stop();
                scrapeReddit.start();
                scrapeFourChan.stop();
                scrapeFourChan.start();
                service.cullMany();
            },
            start: false,
            timeZone: 'America/Los_Angeles',
        });

        const scrapeReddit = new cron.CronJob({
            cronTime: schedule,
            onTick: function () {
                new RedditScraper();
            },
            start: false,
            timeZone: 'America/Los_Angeles',
        });

        const scrapeFourChan = new cron.CronJob({
            cronTime: scheduleTwo,
            onTick: function () {
                new FourChanScraper();
            },
            start: false,
            timeZone: 'America/Los_Angeles',
        });

        orchestrateJob.start();
        this.logger.info('started scraper schedules');
    }
}

export default ImageObjectScheduler;
