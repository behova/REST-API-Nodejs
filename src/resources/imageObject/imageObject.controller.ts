import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/imageObject/imageObject.validation';
import ImageObjectService from '@/resources/imageObject/imageObject.service';
import Logger from '@/utils/logger';

class ImageObjectController implements Controller {
    public path = '/images';
    public router = Router();
    private ImageObjectService = new ImageObjectService();
    private logger = Logger.getLogger('controller');

    constructor() {
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get(
            `${this.path}/count`,
            //validationMiddleware(validate.getMany.params, 'params'),
            this.getDocumentCount,
        );

        this.router.get(
            `${this.path}/page/:page`,
            validationMiddleware(validate.getByPage.params, 'params'),
            this.getByPage,
        );

        this.router.get(
            `${this.path}/:amount`,
            validationMiddleware(validate.getMany.params, 'params'),
            this.getMany,
        );
    }

    private getDocumentCount = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const count = await this.ImageObjectService.getDocumentCount();

            res.status(200).json({ count });

            this.logger.info(`There are ${count} images in the database..`);
        } catch (error) {
            this.logger.error(error);
            next(
                new HttpException(400, 'Could not retrieve document count (C)'),
            );
        }
    };

    private getByPage = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const page = Number(req.params.page) || 0;
            const imgPerPage = 25;

            const total = await this.ImageObjectService.getDocumentCount();
            const imageObjects = await this.ImageObjectService.getByPage(
                page,
                imgPerPage,
            );

            res.status(200).json({ imageObjects });

            this.logger.info(
                `Retrieved page ${page} of ${Math.ceil(total / imgPerPage)}`,
            );
        } catch (error) {
            this.logger.error(error);
            next(new HttpException(400, 'Could not retrieve image page (C)'));
        }
    };

    private getMany = async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response | void> => {
        try {
            const amount = Number(req.params.amount);

            const imageObjects = await this.ImageObjectService.getMany(amount);

            res.status(200).json({ imageObjects });

            this.logger.info(`Retrieved ${amount} images`);
        } catch (error) {
            this.logger.error(error);
            next(new HttpException(400, 'Could not retrieve images (C)'));
        }
    };
}

export default ImageObjectController;
