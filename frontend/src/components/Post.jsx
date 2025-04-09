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

const Post = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  return (
    <div className="my-8 mt-3 w-full max-w-sm mx-auto bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h3 className="font-medium">username</h3>
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
              <Button
                variant="ghost"
                className="w-full !bg-white text-red-600 hover:!bg-red-600 hover:text-white font-bold py-2"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <img
        className="w-full aspect-square object-cover"
        src="https://imgs.search.brave.com/_-S7Wy2ezQ3w_Dk77T7ZlCeqUr0nqyzM3FO2vLEfq1w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9zdHJvbmctYm9k/eWJ1aWxkZXItbWFu/LXdpdGgtcGVyZmVj/dC1hYnMtc2hvdWxk/ZXJzLWJpY2Vwcy10/cmljZXBzLWNoZXN0/LXBvc2luZy1zbW9r/ZS1oYW5kcy11cF8x/MzY0MDMtNDg2My5q/cGc_c2VtdD1haXNf/aHlicmlkJnc9NzQw"
        alt=""
      />

      {/* Actions Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <FaRegHeart
              size={22}
              className="hover:text-gray-600 cursor-pointer"
            />
            <MessageCircle
              onClick={() => setOpen(true)}
              size={22}
              className="hover:text-gray-600 cursor-pointer"
            />
            <Send size={22} className="hover:text-gray-600 cursor-pointer" />
          </div>
          <Bookmark size={22} className="hover:text-gray-600 cursor-pointer" />
        </div>

        {/* Likes and Caption */}
        <span className="font-medium block">1k likes</span>
        <p className="mb-1">
          <span className="font-medium mr-2">username</span>
          caption
        </p>

        {/* Comments Trigger */}
        <span
          onClick={() => setOpen(true)}
          className="text-gray-500 text-sm hover:text-gray-700 mb-2 block"
        >
          View all 100 comments
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
