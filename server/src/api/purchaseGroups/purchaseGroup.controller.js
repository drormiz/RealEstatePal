import { PurchaseGroupModel } from '../../models/purchaseGroup.model.js';

export const getPurchaseGroups = async (req, res, next) => {
    try {
        const purchaseGroups = await PurchaseGroupModel.find({});

        return res.json(purchaseGroups);
    } catch (error) {
        next(error)
    }
};

export const createPurchaseGroup = async (req, res) => {
    try {
      // Create a new PurchaseGroupModel instance based on the request body
      const newPurchaseGroup = new PurchaseGroupModel(req.body);
  
      // Save the new purchaseGroup to the database
      const savedPurchaseGroup = await newPurchaseGroup.save();
  
      res.status(201).json(savedPurchaseGroup);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const deletePurchaseGroup = async (req, res) => {
    const purchaseGroupId = req.params.id;
  
    try {
      const deletedPurchaseGroup = await PurchaseGroupModel.findByIdAndDelete(
        purchaseGroupId,
        req.body,
        { new: true }
      );
  
      if (!deletedPurchaseGroup) {
        return res.status(404).json({ error: 'PurchaseGroup not found' });
      }
  
      res.status(200).json(deletedPurchaseGroup);
    } catch (error) {
      console.error('Error deleting purchaseGroup:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const updatePurchaseGroup = async (req, res) => {
    const purchaseGroupId = req.params.id;
  
    try {
      const updatedPurchaseGroup = await PurchaseGroupModel.findByIdAndUpdate(
        purchaseGroupId,
        req.body,
        { new: true }
      );
  
      if (!updatedPurchaseGroup) {
        return res.status(404).json({ error: 'PurchaseGroup not found' });
      }
  
      res.status(200).json(updatedPurchaseGroup);
    } catch (error) {
      console.error('Error updating purchaseGroup:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };