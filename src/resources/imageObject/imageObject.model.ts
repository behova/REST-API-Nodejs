import { array, number } from 'joi';
import { Schema, model } from 'mongoose';
import ImageObject from './imageObject.interface';

const ImageObjectSchema = new Schema(
    {
        url: {
            type: String,
            required: true,
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
    },
    { timestamps: true },
);
export default model<ImageObject>('images', ImageObjectSchema);
