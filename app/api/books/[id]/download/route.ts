import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Book from '@/models/Book';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const book = await Book.findById(id);

        if (!book || !book.pdfUrl) {
            return NextResponse.json({ error: 'Book or PDF not found' }, { status: 404 });
        }

        return NextResponse.redirect(book.pdfUrl);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
