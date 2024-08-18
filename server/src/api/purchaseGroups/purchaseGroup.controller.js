import { PurchaseGroupModel } from '../../models/purchaseGroup.model.js';
import { PropertyModel } from '../../models/property.model.js';
import { PurchaseGroupRequestModel } from '../../models/purchaseGroupRequest.model.js';
import { UserModel } from '../../models/user.model.js';

const populatePurchaseGroup = [
  {
    path: 'members',
    select: 'name username phoneNumber email image _id',
  },
  {
    path: "owner",
    select: "name username phoneNumber email _id",
  },
  {
    path: 'purchaseGroupRequests',
    populate: {
      path: "user",
      model: "User",
      select: "name username phoneNumber email _id",
    },
    select: 'priceToInvest description status',
  },
  {
    path: 'property',
    select: '_id name description images',
  },
];

const findPurchaseGroupById = (id) =>
  PurchaseGroupModel.findById(id).populate(populatePurchaseGroup);

export const getPurchaseGroups = ({}, {}) => PurchaseGroupModel.find().populate('owner');

export const getPurchaseGroupById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const purchaseGroup = await findPurchaseGroupById(id);

    if (!purchaseGroup) {
      return res.status(404).json({ message: 'Purchase group not found' });
    }

    return res.json(purchaseGroup);
  } catch (error) {
    next(error);
  }
};

export const createPurchaseGroup = async (req, res) => {
  try {
    const purchaseGroupModelData = {
      ...req.body,
      members: [req.user._id],
    };

    const newPurchaseGroup = new PurchaseGroupModel(purchaseGroupModelData);
    const savedPurchaseGroup = await newPurchaseGroup.save();

    await PropertyModel.findByIdAndUpdate(
      req.body.property,
      { purchaseGroup: savedPurchaseGroup._id },
      { new: true }
    );

    res.status(201).json(savedPurchaseGroup);
  } catch (error) {
    console.error(error);
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

export const deletePurchaseGroup = async (req, res) => {
  const purchaseGroupId = req.params.id;

  try {
    const deletedPurchaseGroup = await PurchaseGroupModel.findByIdAndDelete(
      purchaseGroupId
    );

    if (!deletedPurchaseGroup) {
      return res.status(404).json({ error: 'PurchaseGroup not found' });
    }

    await PurchaseGroupRequestModel.deleteMany({ group: purchaseGroupId });

    res.status(200).json(deletedPurchaseGroup);
  } catch (error) {
    console.error('Error deleting purchaseGroup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPurchaseGroupRequests = async (req, res) => {
  try {
    const { userId, groupId } = req.query;

    let query = {};

    if (userId) {
      query.user = userId;
    }

    if (groupId) {
      query.group = groupId;
    }

    const requests = await PurchaseGroupRequestModel.find(query)
      .populate('group')
      .exec();

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching purchase group requests:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
export const createPurchaseGroupRequest = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { group: groupId } = req.body;

    const group = await PurchaseGroupModel.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: 'PurchaseGroup not found' });
    }

    const isMember = group.members.some((member) => member.equals(userId));

    if (isMember) {
      return res
        .status(400)
        .json({ error: 'User is already a member of the group' });
    }

    const existingRequest = await PurchaseGroupRequestModel.findOne({
      user: userId,
      group: groupId,
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'Request already exists' });
    }

    const groupRequestData = {
      ...req.body,
      user: userId,
    };

    const newGroupRequest = new PurchaseGroupRequestModel(groupRequestData);
    const savedGroupRequest = await newGroupRequest.save();

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { purchaseGroupRequests: savedGroupRequest._id } },
      { new: true, useFindAndModify: false }
    );

    await PurchaseGroupModel.findByIdAndUpdate(
      groupId,
      { $push: { purchaseGroupRequests: savedGroupRequest._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json(savedGroupRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updatePurchaseGroupRequest = async (req, res) => {
  const groupRequestId = req.params.id;

  try {
    const updatedGroupRequest =
      await PurchaseGroupRequestModel.findByIdAndUpdate(
        groupRequestId,
        req.body,
        { new: true }
      );

    if (!updatedGroupRequest) {
      return res.status(404).json({ error: 'GroupRequest not found' });
    }

    res.status(200).json(updatedGroupRequest);
  } catch (error) {
    console.error('Error updating groupRequest:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deletePurchaseGroupRequest = async (req, res) => {
  const groupRequestId = req.params.id;

  try {
    const deletedPurchaseGroupRequest =
      await PurchaseGroupRequestModel.findByIdAndDelete(groupRequestId);

    if (!deletedPurchaseGroupRequest) {
      return res.status(404).json({ error: 'Group request not found' });
    }

    await UserModel.updateMany(
      { purchaseGroupRequests: groupRequestId },
      { $pull: { purchaseGroupRequests: groupRequestId } }
    );

    await PurchaseGroupModel.updateMany(
      { purchaseGroupRequests: groupRequestId },
      { $pull: { purchaseGroupRequests: groupRequestId } }
    );

    res.status(200).json({
      message: 'Group request deleted successfully',
      deletedPurchaseGroupRequest,
    });
  } catch (error) {
    console.error('Error deleting group request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const changeRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedRequest = await PurchaseGroupRequestModel.findById(id);

    if (!updatedRequest) {
      return res.status(404).json({ error: 'PurchaseGroupRequest not found' });
    }

    const previousStatus = updatedRequest.status;
    updatedRequest.status = status;
    await updatedRequest.save();

    let group;

    if (status === 'approved' && previousStatus === 'pending') {
      group = await PurchaseGroupModel.findByIdAndUpdate(
        updatedRequest.group,
        { $addToSet: { members: updatedRequest.user } },
        { new: true }
      ).populate(populatePurchaseGroup);
    } else if (status === 'rejected' && previousStatus === 'pending') {
      group = await PurchaseGroupModel.findById(updatedRequest.group).populate(
        populatePurchaseGroup
      );
    }

    if (!group) {
      return res.status(404).json({ error: 'PurchaseGroup not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error('Error updating purchaseGroupRequest:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
