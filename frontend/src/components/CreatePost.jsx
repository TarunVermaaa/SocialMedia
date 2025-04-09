import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import React from "react";

const CreatePost = ({ open, setOpen }) => {
  const createPostHandler = async (e) => {
    e.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-[90%] max-w-md"
      >
        <h2 className="text-lg text-center font-semibold  mb-2">
          Create New Post
        </h2>
        <div className="flex gap-3 items-center">

          <Avatar>
            <AvatarImage
              src="https://example.com/avatar.jpg"
              alt="User Avatar"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div>
            <h2 className="font-semibold text-xs" > Username</h2>
            <span className="text-gray-600 text-xs" > Bio here... </span>
          </div>
        </div>

        
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
