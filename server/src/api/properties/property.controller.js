import { PropertyModel } from "../../models/property.model.js";

export const getProperties = async (req, res, next) => {
  try {
    const { name } = req.query;

    let properties;
    if (name) {
      properties = await PropertyModel.find({
        name: { $regex: new RegExp(name, "i") },
      }).populate({
        path: "owner",
        select: "_id username name image phoneNumber email",
      });
    } else {
      properties = await PropertyModel.find({}).populate({
        path: "owner",
        select: "_id username name image phoneNumber email",
      });
    }

    return res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const property = await PropertyModel.findById(propertyId).populate({
      path: "owner",
      select: "_id username name image phoneNumber email",
    });

    return res.json(property);
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req, res) => {
  try {
    const newProperty = new PropertyModel(req.body);

    const savedProperty = await newProperty.save();

    res.status(201).json(savedProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProperty = async (req, res) => {
  const propertyId = req.params.id;

  try {
    const deletedProperty = await PropertyModel.findByIdAndDelete(
      propertyId,
      req.body,
      { new: true }
    );

    if (!deletedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(deletedProperty);
  } catch (error) {
    console.error("Error deleting Property:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProperty = async (req, res) => {
  const propertyId = req.params.id;

  try {
    const updatedProperty = await PropertyModel.findByIdAndUpdate(
      propertyId,
      req.body,
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
