import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogOverlay,
} from "@radix-ui/react-dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios, { Axios } from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);

  const { posts } = useSelector((store) => store.post);

  const { user } = useSelector((store) => store.auth);

  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  //  Handler for like or unlike post
  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // Update the post in the Redux store

        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Like/Unlike failed");
      console.log("Like/Unlike failed", error);
    }
  };

  // Handler for adding a comment
  const commentHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        // Update the post in the Redux store
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        setText(""); // Clear the input field

        toast.success(res.data.message || "Comment added successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Comment failed");
      console.log("Comment failed", error);
    }
  };

  const postDeleteHandler = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Remove the deleted post from the posts array in the Redux store
        const updatedPosts = posts.filter(
          (postItems) => postItems._id !== post._id
        );
        dispatch(setPosts(updatedPosts));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Post deletion failed");
      console.log("Post deletion failed", error);
    }
  };

  return (
    <div className="my-8 mt-3 w-full max-w-sm mx-auto bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h3 className="font-medium text-black">{post.author?.username}</h3>
        </div>

        {/* Options Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer mr-2" />
          </DialogTrigger>
          <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-xl w-64 z-50">
            <div className="flex flex-col gap-2">
              <Button className="w-full !bg-white text-red-600  hover:text-blue-400 hover:!border-none font-bold py-2">
                Unfollow
              </Button>
              {user && user._id === post.author._id && (
                <Button
                  onClick={postDeleteHandler}
                  variant="ghost"
                  className="w-full !bg-white text-red-600 hover:!bg-red-600 hover:text-white font-bold py-2"
                >
                  Delete
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <img
        className="w-full aspect-square object-cover"
        src={post.image}
        alt=""
      />

      {/* Actions Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            {liked ? (
              <FaHeart
                onClick={likeOrDislikeHandler}
                size={22}
                className=" text-red-500  cursor-pointer"
              />
            ) : (
              <FaRegHeart
                onClick={likeOrDislikeHandler}
                size={22}
                className="hover:text-gray-600 cursor-pointer"
              />
            )}

            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              size={22}
              className="hover:text-gray-600 cursor-pointer"
            />
            <Send size={22} className="hover:text-gray-600 cursor-pointer" />
          </div>
          <Bookmark size={22} className="hover:text-gray-600 cursor-pointer" />
        </div>

        {/* Likes and Caption */}
        <span className="font-medium block">{postLike} likes</span>
        <p className="mb-1">
          <span className="font-medium mr-2">{post.author.username}</span>
          {post.caption}
        </p>

        {/* Comments Trigger */}
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="text-gray-500 text-sm hover:text-gray-700 mb-2 block cursor-pointer"
        >
          View all {comment.length} comments
        </span>

        {/* Comment Input */}
        <div className="flex items-center gap-2 pt-3 border-t">
          <input
            type="text"
            placeholder="Add a comment..."
            value={text}
            onChange={changeEventHandler}
            className="flex-1 outline-none text-sm bg-transparent"
          />
          <span
            onClick={commentHandler}
            className={`text-[#3BADF8] cursor-pointer font-medium text-sm transition-opacity duration-200 ${
              text ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            Post
          </span>
        </div>
      </div>

      {/* Comment Dialog */}
      <CommentDialog open={open} setOpen={setOpen} />
    </div>
  );
};

export default Post;
