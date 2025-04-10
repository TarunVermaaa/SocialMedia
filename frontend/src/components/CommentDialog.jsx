import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";

const CommentDialog = ({ open, setOpen }) => {
  const [moreOpen, setMoreOpen] = useState(false);

  const [ text , setText ] = useState('')
  const {selectedPost} = useSelector(store => store.post)

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }

  const sendMessageHandler = async () => {
    alert(text)
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-2xl w-full bg-white rounded-lg shadow-xl z-[101] p-4"
      >
        {/* ✅ Position absolute icon */}
        <MoreHorizontal
          className="absolute top-4 right-4 cursor-pointer text-black hover:text-gray-600 z-[102]"
          onClick={() => setMoreOpen(true)}
        />

        {/* Main Content */}
        <div className="flex gap-4 w-full">
          <img
            className="w-3/5 h-full aspect-square object-cover rounded-lg"
            src={selectedPost?.image}
            alt="post_img"
          />

          <div className="w-1/3 flex flex-col pr-2">
            <div className="flex-1 overflow-y-auto">
              {/* Avatar section */}
              <div className="flex items-center gap-3 mb-4">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author.profilePicture} alt="post_image" />
                    <AvatarFallback className="text-black">CN</AvatarFallback>
                  </Avatar>
                </Link>
                <Link className="font-semibold text-xs">
                  <span className="text-black">{selectedPost?.author.username}</span>
                </Link>
              </div>
              {/* Rest content */}
              <hr className="mb-2" />
              <div className=" text-sm font-light flex-1 overflow-y-auto max-h-96 ">
                user comments
              </div>
              <div className="flex flex-col gap-2 mt-[130%]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    onChange={changeEventHandler}
                    value={text}
                    className="w-full outline-none border text-sm border-gray-300 p-2 rounded-lg"
                  />
                  <Button variant='outline' disabled={!text.trim()}  onClick={sendMessageHandler} className= '!bg-white w-1  hover:text-blue-700 !border-none   ' > Send </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* More Options Dialog */}
        <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
          <DialogOverlay className="fixed rounded-lg z-[120]" />
          <DialogContent className="fixed flex flex-col items-center text-sm text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-100 p-4 rounded-lg  w-64 z-[121]">
            <div className="flex flex-col gap-2">
              <button className="w-full !bg-gray-100 !border-none text-red-600 hover:bg-gray-100 font-bold py-2 hover:!border-none">
                Unfollow
              </button>

              <button className="w-full !bg-gray-100  text-black  font-bold py-2 !border-none hover:text-red-700">
                Add to favourites
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
