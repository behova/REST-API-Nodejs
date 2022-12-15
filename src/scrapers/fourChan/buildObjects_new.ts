import axios from 'axios';
import { AxiosError } from 'axios';
import sharp from 'sharp';
import { ImageObject } from '@/resources/imageObject/imageObject.interface';
import getPallet from './quantize';
import { fourChanScraper as logger } from '@/utils/logger';

let buildObjectsNew = async function (urls: string[]): Promise<ImageObject[]> {
    let objects: ImageObject[] = [];
    let bufferA: Buffer;
    let metadata: sharp.Metadata;
    let colorArray: Uint8ClampedArray = new Uint8ClampedArray();
    let thumbnailB: Buffer;

    const getAxios = async (url: string) => {
        try {
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
            });
            bufferA = Buffer.from(response.data, 'binary');
        } catch (error: any | AxiosError) {
            if (error.response) {
                // Request made and server responded
                //console.log(error.response.data);
                logger.error(`Axios ${error.response.status}`);
                //console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                logger.error('Axios', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                logger.error('Axios', error);
            }
        }
    };

    const sharpProccessing = async () => {
        try {
            metadata = await sharp(bufferA).metadata();
            thumbnailB = await sharp(bufferA)
                .resize({ width: 500 })
                .png()
                .toBuffer();

            let { data, info } = await sharp(bufferA)
                .resize({ width: 500 })
                .raw()
                .toBuffer({ resolveWithObject: true });

            if (data.buffer !== undefined) {
                colorArray = new Uint8ClampedArray(data.buffer);
            }
        } catch (error) {
            logger.error('sharp', error);
        }
    };

    const buildObject = async () => {
        let width = 0;
        let height = 0;
        let channels = 3;
        let thumbnail = 'none';
        if (metadata.width !== undefined) {
            width = metadata.width;
        }
        if (metadata.height !== undefined) {
            height = metadata.height;
        }
        if (metadata.channels !== undefined) {
            channels = metadata.channels;
        }
        if (metadata.channels !== undefined) {
            thumbnail = thumbnailB.toString();
        }
        return {
            width: width,
            height: height,
            channels: channels,
            thumbnail: thumbnail,
        };
    };

    for (let i in urls) {
        await getAxios(urls[i]);
        await sharpProccessing();
        let { width, height, channels, thumbnail } = await buildObject();
        let pallet = await getPallet(colorArray, channels);

        objects.push({
            url: urls[i],
            source: urls[i],
            width: width,
            height: height,
            pallet: pallet,
            thumbnail: thumbnail,
        });
    }

    return objects;
};

export default buildObjectsNew;
