import { Schema, model } from 'mongoose';

const PurchaseGroupRequestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    group: {
        type: Schema.Types.ObjectId,
        ref: 'PurchaseGroup',
        required: true,
    },
    priceToInvest: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    }
}, { timestamps: true });

export const PurchaseGroupRequestModel = model('PurchaseGroupRequest', PurchaseGroupRequestSchema);
