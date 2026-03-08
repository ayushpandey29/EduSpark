import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
    title: string;
    author: string;
    price: number;
    category: string;
    rating: number;
    reviewCount: number;
    shortDescription: string;
    longDescription: string;
    pageCount: number;
    language: string;
    format: string;
    gradient: string;
}

const BookSchema: Schema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true },
    reviewCount: { type: Number, required: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, required: true },
    pageCount: { type: Number, required: true },
    language: { type: String, required: true },
    format: { type: String, required: true },
    gradient: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
