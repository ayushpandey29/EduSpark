import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    bookId: mongoose.Types.ObjectId;
    title: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    userEmail: string;
    customerName: string;
    items: IOrderItem[];
    totalAmount: number;
    transactionId?: string;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'pending' | 'completed' | 'cancelled';
}

const OrderSchema: Schema = new Schema({
    userEmail: { type: String, required: true },
    customerName: { type: String, required: true },
    transactionId: { type: String },
    items: [{
        bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'pending', 'completed', 'cancelled'], default: 'Processing' },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
