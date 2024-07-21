import mongoose, { Schema, model } from 'mongoose';

const PropertySchema = new Schema({
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
    price: {type: Number},
    image: {type:String},
}, { timestamps: true });

export const PropertyModel = model('Property', PropertySchema);