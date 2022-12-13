import cron from 'cron';
import RedditScraper from '../../scrapers/reddit/redditV1';
import Scheduler from '@/utils/interfaces/scheduler.interface';
import FourChanScraper from '../../scrapers/fourChan/fourChanv1';
import { scheduler } from '@/utils/logger';

class ImageObjectScheduler implements Scheduler {
    public mainSchedule = '0 0 */5 * * *';

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

    createScraperSchedules(): number[] {
        let min = 3.6e6; //one hour
        let max = 1.44e7; //4 hours
        let timeOne = Math.floor(Math.random() * (max - min) + min);
        let timeTwo = timeOne + 3.6e6;

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
                scheduler.info(
                    `scheduled scrapes in ${timeOne / 3.6e6} and ${
                        timeTwo / 3.6e6
                    } hours`,
                );
            },
            start: false,
            timeZone: 'America/Los_Angeles',
        });
        scheduler.info('started scraper schedule');

        scheduleScrapers.start();
    }

    //<TODO> schedule culling to control size of db
}

export default ImageObjectScheduler;
