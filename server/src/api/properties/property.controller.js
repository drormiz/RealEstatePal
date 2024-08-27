import { PropertyModel } from '../../models/property.model.js';

export const getProperties = async (req, res, next) => {
  try {
    const { name, type, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (name) {
      filter.name = { $regex: new RegExp(name, 'i') };
    }

    if (type && type !== 'All') {
      filter.propertyType = type;
    }

    const skip = (page - 1) * limit;

    const properties = await PropertyModel.find(filter)
      .populate({
        path: 'owner',
        select: '_id username name image phoneNumber email'
      })
      .skip(skip)
      .limit(Number(limit));

    const totalProperties = await PropertyModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProperties / limit);

    return res.status(200).json({
      properties,
      totalPages,
      currentPage: Number(page),
      totalProperties
    });
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (req, res, next) => {
  try {
    const propertyId = req.params.id;
    const property = await PropertyModel.findById(propertyId).populate({
      path: 'owner',
      select: '_id username name image phoneNumber email'
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
    res.status(500).json({ error: 'Internal Server Error' });
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
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(deletedProperty);
  } catch (error) {
    console.error('Error deleting Property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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
      return res.status(404).json({ error: 'Property not found' });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
