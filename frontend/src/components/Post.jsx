
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const Post = () => {
  return (
    <div className="my-8 bg-red-200 mt-3  w-full max-w-sm mx-auto">
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
          <DialogContent className="fixed bg-white p-4 rounded-lg shadow-lg">
            <Button variant='ghost' className="cursor-pointer w-fit text-red-600 font-bold">
              Unfollow
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Post;






