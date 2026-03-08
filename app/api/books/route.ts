import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let query = {};
        if (category && category !== 'All') {
            query = { category };
        }

        const books = await Book.find(query);
        const mappedBooks = books.map(book => {
            const obj = book.toObject();
            return { ...obj, id: obj._id.toString() };
        });
        return NextResponse.json(mappedBooks);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
