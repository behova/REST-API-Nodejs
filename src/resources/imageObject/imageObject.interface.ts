import { Document } from 'mongoose';

interface ImageObject extends Document {
    url: string;
    source: string;
    width: number;
    height: number;
    pallet: number[][];

    isValidPassword(password: string): Promise<Error | boolean>;
}

export default ImageObject;
