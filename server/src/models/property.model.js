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
    propertyType: {
      type: String,
      enum: ["Other", "Penthouse", "Two floor", "Ground floor", "Studio"],
    },
    numberOfRooms: {
      type: Number,
    },
    floor: { type: Number },
    hasElevator: { type: Boolean },
    images: { type: [String] },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

export const PropertyModel = model("Property", PropertySchema);
