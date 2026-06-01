import Users from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import Notifications from "../models/notifications.model.js";

const getProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await Users.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getProfile controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
  } catch (error) {
    console.log(`Error in getSuggestedUsers controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (id.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ error: "User cannot follow/unfollow themself" });
    }

    const user = await Users.findById(userId).select("following");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = user.following.includes(id);

    if (!isFollowing) {
      await Users.findOneAndUpdate(
        { _id: userId },
        { $push: { following: id } },
      );
      await Users.findOneAndUpdate(
        { _id: id },
        { $push: { followers: userId } },
      );
      await Notifications.create({
        to: id,
        from: userId,
        type: "follow",
      });

      return res.status(200).json({ message: "User followed successfully" });
    } else {
      await Users.findOneAndUpdate(
        { _id: userId },
        { $pull: { following: id } },
      );
      await Users.findOneAndUpdate(
        { _id: id },
        { $pull: { followers: userId } },
      );

      return res.status(200).json({ message: "User unfollowed successfully" });
    }
  } catch (error) {
    console.log(`Error in followUnfollowUser controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword, bio } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;

    console.log(`currentPassword: ${currentPassword}`);
    console.log(`newPassword: ${newPassword}`);

    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (
      (!currentPassword && newPassword) ||
      (currentPassword && !newPassword)
    ) {
      return res.status(400).json({
        error: "Both current and new password is required",
      });
    }

    if (currentPassword && newPassword) {
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isValidPassword) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be more than 6 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
    }

    if (username) {
      const existingUsername = await Users.findOne({
        username,
        _id: { $ne: userId },
      });

      if (existingUsername) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      user.username = username;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }

      const existingEmail = await Users.findOne({
        email,
        _id: { $ne: userId },
      });

      if (existingEmail) {
        return res.status(400).json({ error: "Email is already taken" });
      }

      user.email = email;
    }

    if (profileImg) {
      if (user.profileImgPublicId) {
        await cloudinary.uploader.destroy(user.profileImgPublicId);
      }

      const response = await cloudinary.uploader.upload(profileImg);

      user.profileImg = response.secure_url;
      user.profileImgPublicId = response.public_id;
    }

    if (coverImg) {
      if (user.coverImgPublicId) {
        await cloudinary.uploader.destroy(user.coverImgPublicId);
      }

      const response = await cloudinary.uploader.upload(coverImg);

      user.coverImg = response.secure_url;
      user.coverImgPublicId = response.public_id;
    }

    user.bio = bio !== undefined ? bio : user.bio;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json(userResponse);
  } catch (error) {
    console.error(`Error in updateProfile controller: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getProfile, getSuggestedUsers, followUnfollowUser, updateProfile };
