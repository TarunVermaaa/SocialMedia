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

const CommentDialog = ({ open, setOpen }) => {
  const [moreOpen, setMoreOpen] = useState(false);

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
            src="https://imgs.search.brave.com/_-S7Wy2ezQ3w_Dk77T7ZlCeqUr0nqyzM3FO2vLEfq1w/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9zdHJvbmctYm9k/eWJ1aWxkZXItbWFu/LXdpdGgtcGVyZmVj/dC1hYnMtc2hvdWxk/ZXJzLWJpY2Vwcy10/cmljZXBzLWNoZXN0/LXBvc2luZy1zbW9r/ZS1oYW5kcy11cF8x/MzY0MDMtNDg2My5q/cGc_c2VtdD1haXNf/aHlicmlkJnc9NzQw"
            alt="post_img"
          />

          <div className="w-1/3 flex flex-col pr-2">
            <div className="flex-1 overflow-y-auto">
              {/* Avatar section */}
              <div className="flex items-center gap-3 mb-4">
                <Link>
                  <Avatar>
                    <AvatarImage src="" alt="post_image" />
                    <AvatarFallback className="text-black">CN</AvatarFallback>
                  </Avatar>
                </Link>
                <Link className="font-semibold text-xs">
                  <span className="text-black">username</span>
                </Link>
              </div>
              {/* Rest content */}
            </div>
          </div>
        </div>

        {/* More Options Dialog */}
        <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
          <DialogOverlay className="fixed inset-0 bg-white rounded-lg z-[120]" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg  w-64 z-[121]">
            <div className="flex flex-col gap-2">
              <button className="w-full !bg-white text-red-600 hover:bg-gray-100 font-bold py-2 hover:!border-none">
                Unfollow
              </button>

              <button className="w-full !bg-red-600 text-white  font-bold py-2 hover:!bg-red-700 border border-gray-200">
                Delete
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
