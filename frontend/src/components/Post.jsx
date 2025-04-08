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

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  return (
    <div className="my-8 mt-3 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 p-4">
          <Avatar>
            <AvatarImage src="" alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h3>username</h3>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer mr-4" />
          </DialogTrigger>
          <DialogOverlay className="fixed inset-50 ml-[25%] mr-[25%] bg-black/50 rounded-2xl  backdrop-blur-sm" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-xs">
            <div className="flex flex-col gap-3">
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2">
                Unfollow
              </Button>
              <Button
                variant="ghost"
                className="w-full hover:bg-red-50 text-red-500 font-bold border border-red-100 py-2"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src="https://imgs.search.brave.com/_-S7Wy2ezQ3w_Dk77T7ZlCeqUr0nqyzM3FO2vLEfq1w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9zdHJvbmctYm9k/eWJ1aWxkZXItbWFu/LXdpdGgtcGVyZmVj/dC1hYnMtc2hvdWxk/ZXJzLWJpY2Vwcy10/cmljZXBzLWNoZXN0/LXBvc2luZy1zbW9r/ZS1oYW5kcy11cF8x/MzY0MDMtNDg2My5q/cGc_c2VtdD1haXNf/aHlicmlkJnc9NzQw"
        alt=""
      />

      <div className="flex items-center justify-between ">
        <div className=" flex items-center gap-2 ">
          <FaRegHeart size={"22px"} />
          <MessageCircle className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>

      <span className="font-medium block mb-1 mt-1 "> 1k likes </span>

      <p>
        <span className="font-medium mr-2"> username </span>
        caption
      </p>

      <span>View all 100 comments</span>

      <CommentDialog />

      <div className="flex items-center justify-between gap-2 mt-1 mb-1">
        <input
          type="text"
          placeholder="Add a comment..."
          value={text}
          onChange={changeEventHandler}
          className="outline-none text-sm w-full"
        />
        {text && <span className="text-[#3BADF8] cursor-pointer ">Post</span>}
      </div>
    </div>
  );
};

export default Post;
