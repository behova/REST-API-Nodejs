// import axios from 'axios';
// import { AxiosError } from 'axios';
// import sharp from 'sharp';
// import { ImageObject } from '@/resources/imageObject/imageObject.interface';
// import getPallet from '@/utils/scrapers/reddit/quantize';

// let buildObjects = async function (urls: string[]): Promise<ImageObject[]> {
//     let objects: ImageObject[] = [];

//     for (let i in urls) {
//         try {
//             const response = await axios.get(urls[i], {
//                 responseType: 'arraybuffer',
//             });
//             const bufferArray = Buffer.from(response.data, 'binary');

//             const metadata = await sharp(bufferArray).metadata();
//             let width = 0;
//             let height = 0;
//             if (metadata.width !== undefined) {
//                 width = metadata.width;
//             }
//             if (metadata.height !== undefined) {
//                 height = metadata.height;
//             }

//             let { data, info } = await sharp(bufferArray)
//                 .resize({ width: 500 })
//                 .raw()
//                 .toBuffer({ resolveWithObject: true });

//             const pixelArray = new Uint8ClampedArray(data.buffer);

//             let pallet = await getPallet(pixelArray, info.channels);

//             objects.push({
//                 url: urls[i],
//                 source: urls[i],
//                 width: width,
//                 height: height,
//                 pallet: pallet,
//             });
//         } catch (error: any | AxiosError) {
//             if (error.response) {
//                 // Request made and server responded
//                 //console.log(error.response.data);
//                 console.log(`Axios ${error.response.status}`);
//                 console.log(error.response.headers);
//             } else if (error.request) {
//                 // The request was made but no response was received
//                 console.log(error.request);
//             } else {
//                 // Something happened in setting up the request that triggered an Error
//                 console.log('Error', error);
//             }
//         }
//     }

//     return objects;
// };

// export default buildObjects;
