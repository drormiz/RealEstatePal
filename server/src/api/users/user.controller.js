import { UserModel } from "../../models/user.model.js";
import { hashPassword, comparePaswords } from "../../services/hashPassword.js";

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
  const { image, name, username, currentPassword, newPassword } = req.body;

  try {
    if ( (image && (name || username || currentPassword || newPassword)) ||
         ((name || username) && (image || currentPassword || newPassword)) ||
         ((currentPassword && newPassword) && (image || name || username)) ) {
      return res.status(400).json({ error: "You can only update the image, username/name, or password at a time." });
    }

    let updatedProfile;

    if (image) {
      updatedProfile = await UserModel.findByIdAndUpdate(userId, { image }, { new: true });
    } 
    
    else if (name || username) {
      const existingUser = await UserModel.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: "Username is already taken" });
      }
      updatedProfile = await UserModel.findByIdAndUpdate(userId, { name, username }, { new: true });
    } 
    
    else if (currentPassword && newPassword) {
      const user = await UserModel.findById(userId);
      const match = await comparePaswords(currentPassword, user.password);
      if (!match) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      else{
        user.password = newPassword
        await user.save();
        updatedProfile = user;
      }      
    }

    if (!updatedProfile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
