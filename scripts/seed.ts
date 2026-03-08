import { books } from '../data/books';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Book from '../models/Book';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected to MongoDB');

        // Clear existing books
        await Book.deleteMany({});
        console.log('Cleared existing books');

        // Remove the 'id' field from static data as MongoDB will generate _id
        const booksToSeed = books.map(({ id, ...rest }) => ({
            ...rest,
            // We can actually use the original IDs as strings if we want, 
            // but it's better to let MongoDB handle it or map them to _id if they are valid ObjectIds.
            // Here they are "1", "2", etc., so we'll just let MongoDB generate new ones.
        }));

        await Book.insertMany(booksToSeed);
        console.log(`Successfully seeded ${booksToSeed.length} books`);

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
