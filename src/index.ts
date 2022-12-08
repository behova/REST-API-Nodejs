import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import ImageObjectController from '@/resources/imageObject/imageObject.controller';
import ImageObjectScheduler from '@/resources/imageObject/imageObject.scheduler';

validateEnv();

const app = new App(
    [new ImageObjectController()],
    [new ImageObjectScheduler()],
    Number(process.env.PORT),
);

app.listen();
