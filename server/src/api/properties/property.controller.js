import { PropertyModel } from '../../models/property.model.js';

export const getProperties = async (req, res, next) => {
    try {
        const properties = await PropertyModel.find({});

        return res.json(properties);
    } catch (error) {
        next(error)
    }
};

export const createProperty = async (req, res) => {
    try {
      // Create a new PurchaseGroupModel instance based on the request body
      const newProperty = new PropertyModel(req.body);
  
      // Save the new purchaseGroup to the database
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