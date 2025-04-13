import sharp from "sharp";
import Cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image)
      return res.status(400).json({ message: "Please upload an image" });

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await Cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findByIdAndUpdate(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    res
      .status(201)
      .json({ success: true, message: "Post created successfully", post });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username  profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username  profilePicture" },
      });

    return res
      .status(200)
      .json({ message: "Posts fetched successfully", posts, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getUserPost = async (req, res) => {
  try {
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username  profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username  profilePicture" },
      });

    return res.status(200).json({
      message: "User Posts fetched successfully",
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const LikeKarneWaleKiID = req.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Like logic here
    await post.updateOne({ $addToSet: { likes: LikeKarneWaleKiID } });
    await post.save();

    // implement socket io for real time liking
    const user = await User.findById(LikeKarneWaleKiID).select(
      "username profilePicture"
    );
    const postOwnerId = post.author.toString();
    if (postOwnerId !== LikeKarneWaleKiID) {
       const notification = {
        type : "like",
        userId : LikeKarneWaleKiID,
        userDetails : user,
        postId , 
        message : `${user.username} liked your post`
       }
       const postOwnerSocketId = getReceiverSocketId(postOwnerId);
       io.to(postOwnerSocketId).emit("notification" ,  notification)
    }

    res
      .status(200)
      .json({ message: "Like added successfully", post, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const dislikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const LikeKarneWaleKiID = req.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Like logic here
    await post.updateOne({ $pull: { likes: LikeKarneWaleKiID } });
    await post.save();

      // implement socket io for real time liking
      const user = await User.findById(LikeKarneWaleKiID).select(
        "username profilePicture"
      );
      const postOwnerId = post.author.toString();
      if (postOwnerId !== LikeKarneWaleKiID) {
         const notification = {
          type : "dislike",
          userId : LikeKarneWaleKiID,
          userDetails : user,
          postId , 
          message : `${user.username} disliked your post`
         }
         const postOwnerSocketId = getReceiverSocketId(postOwnerId);
         io.to(postOwnerSocketId).emit("notification" ,  notification)
      }

    res
      .status(200)
      .json({ message: "DisLike added successfully", post, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { text } = req.body;
    const CommentKarneWaleKiID = req.id;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!text)
      return res.status(400).json({ message: "Please provide a comment" });

    const comment = await Comment.create({
      text,
      author: CommentKarneWaleKiID,
      post: postId,
    });

    await comment.populate({
      path: "author",
      select: "username  profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res
      .status(201)
      .json({ message: "Comment added successfully", comment, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });

    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found for this post" });

    return res.status(200).json({
      message: "Comments fetched successfully",
      comments,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const authorId = req.id;
    const post = await Post.findById(postId);

    //  check if post exists and if it belongs to the authenticated user
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== authorId)
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });

    // delete post
    await Post.findByIdAndDelete(postId);

    // remove post id from user's posts array
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    //  delete all comments associated with the post
    await Comment.deleteMany({ post: postId });

    return res
      .status(200)
      .json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

// bookmarking a post

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ message: "Post not found" });

    // check if the user has already bookmarked the post
    const user = await User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        message: "Post unbookmarked successfully",
        type: "unsaved",
        success: true,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({ message: "Post bookmarked successfully", type: "saved" });
    }
  } catch (error) {
    console.log(error);
  }
};
