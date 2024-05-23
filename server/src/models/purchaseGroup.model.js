import mongoose, { Schema, model } from 'mongoose';

const PurchaseGroupSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    description: {type: String},
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: "User",
      },
      property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property"
      }
}, { timestamps: true });

export const PurchaseGroupModel = model('PurchaseGroup', PurchaseGroupSchema);