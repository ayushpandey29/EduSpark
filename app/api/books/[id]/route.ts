import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const book = await Book.findById(id);

        if (!book) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        const obj = book.toObject();
        return NextResponse.json({ ...obj, id: obj._id.toString() });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
