import { UserModel } from "../../models/user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({});

    return res.json(users);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId, req.body, {
      new: true,
    });

    if (!deletedUser) {
      return res.status(404).json({ error: "user not found" });
    }

    res.status(200).json(deletedUser);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const existingUser = await UserModel.findOne({username: req.body.username});

    if ( existingUser && existingUser._id !== userId) {
      return res.status(400).json({ error: "Username is already taken" });
    }

    const updatedProfile = await UserModel.findByIdAndUpdate(
      userId,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
