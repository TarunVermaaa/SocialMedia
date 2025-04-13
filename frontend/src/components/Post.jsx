import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

const Post = ({ post }) => {
  if (!post) return null;

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [postLike, setPostLike] = useState(post?.likes?.length || 0);
  const [comment, setComment] = useState(post?.comments || []);
  const [commentCount, setCommentCount] = useState(post?.comments?.length || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);

  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const dispatch = useDispatch();

  useEffect(() => {
    const latestPost = posts.find((p) => p._id === post._id);
    if (latestPost) {
      setComment(latestPost.comments || []);
      setCommentCount(latestPost.comments?.length || 0);
    }
  }, [posts, post._id]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      setIsLiking(true);
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

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
    } finally {
      setTimeout(() => {
        setIsLiking(false);
      }, 500);
    }
  };

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
        setCommentCount(updatedCommentData.length);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message || "Comment added successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Comment failed");
      console.log("Comment failed", error);
    }
  };

  const postDeleteHandler = async () => {
    try {
      setDeleting(true);
      const response = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const updatedPosts = posts.filter(
          (postItems) => postItems._id !== post._id
        );
        dispatch(setPosts(updatedPosts));
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Post deletion failed");
      console.log("Post deletion failed", error);
    } finally {
      setTimeout(() => {
        setDeleting(false);
      }, 500);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsBookmarked(!isBookmarked);
        toast.success(res.data.message || "Bookmark Successfully");
      }
    } catch (error) {
      console.log("Bookmark failed", error);
    }
  };

  return (
    <div className="my-8 mt-3 w-full max-w-sm mx-auto bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={post?.author?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-black">{post?.author?.username}</h3>
            {user._id === post.author._id && (
              <Badge variant="secondary" className="text-xs">
                Author
              </Badge>
            )}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer mr-2" />
          </DialogTrigger>
          <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-xl w-64 z-50">
            <div className="flex flex-col gap-2">
              {post?.author?._id !== user?._id && (
                <Button className="w-full !bg-white text-red-600 hover:text-blue-400 hover:!border-none font-bold py-2">
                  Unfollow
                </Button>
              )}
              {user && user._id === post?.author?._id && (
                <Button
                  disabled={deleting}
                  onClick={postDeleteHandler}
                  variant="ghost"
                  className="w-full !bg-white text-red-600 hover:!bg-red-600 hover:text-white font-bold py-2"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <img
        className="w-full aspect-square object-cover"
        src={post?.image}
        alt=""
      />

      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            {liked ? (
              <motion.div
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isLiking ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <FaHeart
                  onClick={likeOrDislikeHandler}
                  size={22}
                  className="text-red-500 cursor-pointer transition-colors duration-300"
                />
              </motion.div>
            ) : (
              <motion.div
                whileTap={{ scale: 0.9 }}
                animate={{ scale: isLiking ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                <FaRegHeart
                  onClick={likeOrDislikeHandler}
                  size={22}
                  className="hover:text-red-500 cursor-pointer transition-colors duration-300"
                />
              </motion.div>
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
          <Bookmark
            onClick={bookmarkHandler}
            size={22}
            className={`cursor-pointer ${
              isBookmarked
                ? "text-blue-500 fill-blue-500"
                : "hover:text-gray-600"
            }`}
          />
        </div>

        <span className="font-medium block">{postLike} likes</span>
        <p className="mb-1">
          <span className="font-medium mr-2">{post?.author?.username}</span>
          {post?.caption}
        </p>

        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="text-gray-500 text-sm hover:text-gray-700 mb-2 block cursor-pointer"
        >
          View all {commentCount} comments
        </span>

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

      <CommentDialog open={open} setOpen={setOpen} post={post} />
    </div>
  );
};

export default Post;
