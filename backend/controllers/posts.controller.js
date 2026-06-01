import Users from "../models/users.model.js";
import Notifications from "../models/notifications.model.js";
import Posts from "../models/posts.model.js";
import { v2 as cloudinary } from "cloudinary";

const getAllPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const posts = await Posts.find({ user: { $ne: userId } })
      .populate("user", "-password")
      .populate("likes", "-password")
      .populate("comments.user", "-password");

    return res.status(200).json(posts);
  } catch (error) {
    console.log(`Error in getAllPosts controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id;

    if (!text && !img) {
      return res
        .status(400)
        .json({ error: "An image or text body is required" });
    }

    const user = await Users.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let imgPublicId;

    if (img) {
      const response = await cloudinary.uploader.upload(img);
      img = response.secure_url;
      imgPublicId = response.public_id;
    }

    const newPost = await Posts.create({
      user: userId,
      text,
      img,
      imgPublicId,
    });

    return res.status(201).json(newPost);
  } catch (error) {
    console.log(`Error in createPost controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const commentOnPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    const user = await Users.findById(userId).select("-password");
    const post = await Posts.findById(postId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!text) {
      return res.status(400).json({ error: "Comment body is required" });
    }

    if (userId.toString() === post.user.toString()) {
      return res
        .status(400)
        .json({ error: "User cannot comment on their posts" });
    }

    await Posts.findByIdAndUpdate(postId, {
      $push: {
        comments: {
          user: userId,
          text,
        },
      },
    });

    return res.status(200).json({ message: "Added comment successfully" });
  } catch (error) {
    console.log(`Error in commentOnPost controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const user = await Users.findById(userId).select("-password");
    const post = await Posts.findById(postId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (userId.toString() === post.user.toString()) {
      return res.status(400).json({ error: "User cannot like their posts" });
    }

    await Posts.findByIdAndUpdate(postId, { $push: { likes: userId } });
    await Notifications.create({
      to: post.user,
      from: userId,
      type: "like",
    });

    return res.status(200).json({ message: "Liked post successfully" });
  } catch (error) {
    console.log(`Error in likePost controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await Users.findById(userId).select("-password");

    const userFollowing = user.following;

    const followingPosts = await Posts.find({ user: { $in: userFollowing } })
      .populate("user", "-password")
      .populate("likes", "-password")
      .populate("comments", "-password");

    return res.status(200).json(followingPosts);
  } catch (error) {
    console.log(`Error in getFollowingPosts controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Posts.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (userId.toString() !== post.user.toString()) {
      return res
        .status(400)
        .json({ error: "User not authorized to delete post" });
    }

    await Posts.findByIdAndDelete(postId);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(`Error in getAllPosts controller: ${error.message}`);
    return res.status(500).json("Internal Server Error");
  }
};

export {
  getAllPosts,
  createPost,
  commentOnPost,
  likePost,
  getFollowingPosts,
  deletePost,
};
