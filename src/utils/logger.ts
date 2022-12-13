import { options } from 'joi';
import log4js from 'log4js';

const Logger = log4js;

Logger.configure({
    appenders: {
        console: { type: 'stdout', layout: { type: 'colored' } },
        withFile: { type: 'file', filename: 'catch.log' },
        multi: {
            type: 'multiFile',
            base: 'logs/',
            property: 'categoryName',
            extension: '.log',
            maxLogsize: 10485760,
            backup: 3,
            compress: true,
        },
    },
    categories: {
        default: { appenders: ['console', 'withFile'], level: 'trace' },
        general: { appenders: ['console', 'multi'], level: 'trace' },
        service: { appenders: ['console', 'multi'], level: 'trace' },
        scheduler: { appenders: ['console', 'multi'], level: 'trace' },
        controller: { appenders: ['console', 'multi'], level: 'trace' },
        sharp: { appenders: ['console', 'multi'], level: 'trace' },
        axios: { appenders: ['console', 'multi'], level: 'trace' },
        redditScraper: { appenders: ['console', 'multi'], level: 'trace' },
        fourChanScraper: { appenders: ['console', 'multi'], level: 'trace' },
        express: { appenders: ['console', 'multi'], level: 'trace' },
    },
    pm2: true,
});

export const redditScraper = Logger.getLogger('redditScraper');
export const fourChanScraper = Logger.getLogger('fourChanScraper');
export const express = Logger.connectLogger(Logger.getLogger('express'), {
    level: 'any',
});
export const scheduler = Logger.getLogger('scheduler');

export default Logger;
