import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import Cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "Something is missing please check" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ message: "Email already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashedPassword });
    res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Something is missing please check", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect email or password", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    //  populating the post with data from the POST model
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 86400000,
      })
      .json({
        message: `Welcome ${user.username}!`,
        success: true,
        user,
      });
  } catch (error) {
    console.error(error);
  }
};

export const logout = async (_, res) => {
  try {
    res.clearCookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    let user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate({ path: "bookmarks" });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    return res.status(200).json({ message: "user Found", user, success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      // ✅ Cloudinary me `buffer` bhejne ka sahi tareeka
      cloudResponse = await new Promise((resolve, reject) => {
        const uploadStream = Cloudinary.uploader.upload_stream(
          { resource_type: "image" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              return reject(error);
            }
            resolve(result);
          }
        );
        uploadStream.end(profilePicture.buffer);
      });
    }

    // ✅ User find karne ka check
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // ✅ User ka data update karna
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (cloudResponse) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user, success: true });
  } catch (error) {
    console.error("Edit Profile Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    if (!suggestedUser) {
      return res
        .status(404)
        .json({ message: "No suggested users found", success: false });
    }

    return res.status(200).json({ users: suggestedUser, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id;
    const jiskoFollowKrunga = req.params.id;

    if (followKrneWala === jiskoFollowKrunga) {
      return res
        .status(400)
        .json({ message: "You cannot follow yourself", success: false });
    }

    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    // now checking that shoudl we follow or unfollow

    const isFollowing = user.following.includes(jiskoFollowKrunga);

    if (isFollowing) {
      // Unfollow logic here

      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $pull: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $pull: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true });
    } else {
      // Follow logic here

      await Promise.all([
        User.updateOne(
          { _id: followKrneWala },
          { $push: { following: jiskoFollowKrunga } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrunga },
          { $push: { followers: followKrneWala } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Followed successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};
