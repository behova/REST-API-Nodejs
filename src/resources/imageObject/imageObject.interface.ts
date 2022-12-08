import { Document } from 'mongoose';

export interface ImageObject {
    url: string;
    source: string;
    width: number;
    height: number;
    pallet: number[][];
}

export interface ImageObjectInterface extends ImageObject, Document {}
