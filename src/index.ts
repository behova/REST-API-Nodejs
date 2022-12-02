import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import validateEnv from '@/utils/validateEnv';
import PostController from '@/resources/post/post.controller';
import UserController from '@/resources/user/user.controller';
import ImageObjectController from '@/resources/imageObject/imageObject.controller';

validateEnv();

const app = new App(
    [new PostController(), new UserController(), new ImageObjectController()],
    Number(process.env.PORT),
);

app.listen();
