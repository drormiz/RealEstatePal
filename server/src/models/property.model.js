import mongoose, { Schema, model } from "mongoose";

const PropertySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: { type: String },
    price: { type: Number },
    meters: { type: Number },
    // loction: {type: String},
    type: {
      type: String,
      enum: ['קוטג', 'דו קומתי', 'אחר', 'בית קרקע'],
    },
    numberOfRooms: {
      type: Number
    },
    floor: {type: Number},
    elevator: {type: Boolean},
    images: { type: [String] },
    purchaseGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PurchaseGroup",
    },
  },
  { timestamps: true }
);

export const PropertyModel = model("Property", PropertySchema);
