import { Document } from 'mongoose';

export interface ImageObject {
    url: string;
    source: string;
    width: number;
    height: number;
    pallet: number[][];
    thumbnail: string;
}

export interface ImageObjectInterface extends ImageObject, Document {}
