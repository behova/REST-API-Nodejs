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
            `${this.path}/:amount`,
            validationMiddleware(validate.getMany.params, 'params'),
            this.getMany,
        );
    }

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
