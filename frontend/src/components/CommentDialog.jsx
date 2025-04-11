import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React, { useState, useLayoutEffect, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";
import axios from "axios";
import gsap from "gsap";

const CommentDialog = ({ open, setOpen, post }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [text, setText] = useState("");
  const [comment, setComment] = useState(post.comments);
  const dialogWrapperRef = useRef(null);
  const dispatch = useDispatch();
  const { selectedPost, posts } = useSelector((store) => store.post);

  useEffect(() => {
    setComment(post.comments);
  }, [post.comments]);

  useLayoutEffect(() => {
    if (open && dialogWrapperRef.current) {
      gsap.fromTo(
        dialogWrapperRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", delay: 0.1 }
      );
    }
  }, [open]);

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-2xl w-full bg-white rounded-lg shadow-xl z-[101] h-[85vh] flex"
      >
        {/* 👇 Hidden title for accessibility */}
        <DialogTitle>
          <VisuallyHidden>Comment Dialog</VisuallyHidden>
        </DialogTitle>

        {/* Wrapper div for GSAP animation */}
        <div ref={dialogWrapperRef} className="flex w-full h-full">
          {/* Image Section */}
          <div className="w-3/5 h-full">
            <img
              className="w-full h-full object-contain rounded-l-lg"
              src={selectedPost?.image}
              alt="post"
            />
          </div>

          {/* Comments Section */}
          <div className="w-2/5 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={selectedPost?.author.profilePicture}
                    alt={selectedPost?.author.username}
                  />
                  <AvatarFallback className="text-black">
                    {selectedPost?.author.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm">
                  {selectedPost?.author.username}
                </span>
              </div>
              <MoreHorizontal
                className="cursor-pointer text-black hover:text-gray-600"
                onClick={() => setMoreOpen(true)}
              />
            </div>

            {/* Comments Container */}
            <div className="flex-1 overflow-y-auto p-4">
              {comment?.length > 0 ? (
                comment.map((c) => <Comment key={c._id} comment={c} />)
              ) : (
                <p className="text-sm text-gray-500">No comments yet.</p>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-4 border-t">
              <form className="flex items-center gap-2" onSubmit={sendMessageHandler}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={text}
                  onChange={changeEventHandler}
                  className="flex-1 outline-none border border-gray-300 p-2 rounded-lg text-sm"
                />
                <Button
                  type="submit"
                  variant="outline"
                  disabled={!text.trim()}
                  className="!bg-white hover:text-blue-700 !border-none"
                >
                  Post
                </Button>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
