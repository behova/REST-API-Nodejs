import imageObjectModel from './imageObject.model';
import { ImageObject } from './imageObject.interface';
import { MongooseError } from 'mongoose';
import Logger from '@/utils/logger';

class ImageObjectService {
    private imageObject = imageObjectModel;
    private logger = Logger.getLogger('service');

    /**
     * Get a specified amount of images
     */
    public async getMany(
        amount: number,
    ): Promise<(ImageObject & { _id: string })[]> {
        try {
            const images = await this.imageObject
                .find()
                .sort({ _id: -1 })
                .limit(amount);
            return images;
        } catch (error) {
            this.logger.error(`Failed to retrieve ${amount} images`);
            throw new Error('Unable to retrieve images');
        }
    }

    /**
     * Internal posting method for scrapers
     */
    public async postMany(images: ImageObject[]) {
        try {
            let result = await this.imageObject.insertMany(images, {
                ordered: false,
                rawResult: false,
            });
            return result;
        } catch (error: any | MongooseError) {
            if (error.code == '11000') {
                this.logger.warn(`${error.writeErrors.length} write errors`);
                //this.logger.info(error.result);
                return error.result;
            } else {
                throw new Error('Unable to post images');
            }
        }
    }
    /**
     * Internal cull images
     */
    public async cullMany() {
        try {
            const docCount = await this.imageObject.countDocuments();
            const amount = Math.floor(docCount / 4);
            const images = await this.imageObject
                .find()
                .sort({ _id: 1 })
                .limit(amount);
            let ids = [];
            for (let i in images) {
                ids.push(images[i]._id);
            }

            const deletion = await this.imageObject.deleteMany({
                _id: { $in: ids },
            });
            this.logger.warn('culled', deletion);
        } catch (error) {
            this.logger.error(`Failed to  delete images`, error);
        }
    }

    /**
     * Get images by source
     */

    /**
     * Get large images >1920x1080
     */

    /**
     * Get medium images
     */

    /**
     * Get small images
     */
}
export default ImageObjectService;
