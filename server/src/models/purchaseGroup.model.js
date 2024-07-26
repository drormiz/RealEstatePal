import mongoose, { Schema, model } from "mongoose";

const PurchaseGroupSchema = new Schema(
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
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "User",
    },
    purchaseGroupRequests: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: "PurchaseGroupRequest",
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      unique: true,
    },
  },
  { timestamps: true }
);

export const PurchaseGroupModel = model("PurchaseGroup", PurchaseGroupSchema);
