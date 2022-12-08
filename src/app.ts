import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import { express as logger } from '@/utils/logger';
import helmet from 'helmet';
import Controller from '@/utils/interfaces/controller.interface';
import errorMiddleware from '@/middleware/error.middleware';
import Scheduler from '@/utils/interfaces/scheduler.interface';

class App {
    public express: Application;
    public port: number;

    constructor(
        controllers: Controller[],
        schedulers: Scheduler[],
        port: number,
    ) {
        this.express = express();
        this.port = port;

        this.initDatabaseConnection();
        this.initMiddleware();
        this.initControllers(controllers);
        this.initSchedulers(schedulers);
        this.initErrorHandling();
    }

    private initMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(logger);
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/poppet', controller.router);
        });
    }

    private initSchedulers(schedulers: Scheduler[]): void {
        schedulers.forEach(() => {});
    }

    private initErrorHandling(): void {
        this.express.use(errorMiddleware);
    }

    private initDatabaseConnection(): void {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;

        mongoose.connect(
            `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`,
        );
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listening on port ${this.port}...`);
        });
    }
}

export default App;
