import imageObjectModel from './imageObject.model';
import ImageObject from './imageObject.interface';

class ImageObjectService {
    private imageObject = imageObjectModel;

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
            throw new Error('Unable to retrieve images');
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
