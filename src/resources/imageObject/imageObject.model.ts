import { Schema, model } from 'mongoose';
import { ImageObjectInterface } from './imageObject.interface';

const ImageObjectSchema = new Schema(
    {
        url: {
            type: String,
            required: true,
            unique: true,
        },
        source: {
            type: String,
            required: true,
        },
        width: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        pallet: {
            type: [[Number]],
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);
export default model<ImageObjectInterface>('imageObject', ImageObjectSchema);
