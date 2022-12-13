import cron from 'cron';
import RedditScraper from '../../scrapers/reddit/redditV1';
import Scheduler from '@/utils/interfaces/scheduler.interface';
import FourChanScraper from '../../scrapers/fourChan/fourChanv1';
import Logger from '@/utils/logger';
import ImageObjectService from './imageObject.service';

class ImageObjectScheduler implements Scheduler {
    private mainSchedule = '0 0 */7 * * *';
    private logger = Logger.getLogger('scheduler');

    constructor() {
        this.initSchedule();
    }

    // private createScraperSchedule(): string[] {
    //     let seconds = Math.floor(Math.random() * 59) + 1;
    //     let minutes = Math.floor(Math.random() * 59) + 1;
    //     let hours = '*/4';
    //     let day = '*';
    //     let month = '*';
    //     let week = '*';
    //     let time = `${seconds} ${minutes} ${hours} ${day} ${month} ${week}`;
    //     let timeTwo = `${seconds} ${minutes} */6 ${day} ${month} ${week}`;

    //     return [time, timeTwo];
    // }

    private createScraperSchedules(): number[] {
        let min = 3600000; //one hour
        let max = 18000000; //5 hours
        let timeOne = Math.floor(Math.random() * (max - min) + min);
        let timeTwo = timeOne + 3600000;

        this.logger.info(
            `scheduled scrapes in ${timeOne / 3600000} and ${
                timeTwo / 3600000
            } hours`,
        );

        return [timeOne, timeTwo];
    }

    initSchedule(): void {
        let createSchedules = this.createScraperSchedules;
        const scheduleScrapers = new cron.CronJob({
            cronTime: this.mainSchedule,
            onTick: function () {
                let [timeOne, timeTwo] = createSchedules();
                setTimeout(function () {
                    new RedditScraper();
                }, timeOne);
                setTimeout(function () {
                    new FourChanScraper();
                }, timeTwo);
            },
            start: false,
            timeZone: 'America/Los_Angeles',
        });
        scheduleScrapers.start();
    }

    //<TODO> schedule culling to control size of db
}

export default ImageObjectScheduler;
