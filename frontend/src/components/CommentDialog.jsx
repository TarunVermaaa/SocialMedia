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
import Comment from "./Comment";

const CommentDialog = ({ open, setOpen }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const [text, setText] = useState('');
  const { selectedPost } = useSelector(store => store.post);

  const changeEventHandler = (e) => {
    setText(e.target.value);
  };

  const sendMessageHandler = async () => {
    alert(text);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-2xl w-full bg-white rounded-lg shadow-xl z-[101] h-[85vh] flex"
      >
        {/* Image Section */}
        <div className="w-3/5 h-full">
          <img
            className="w-full h-full object-contain rounded-l-lg"
            src={selectedPost?.image}
            alt="post_img"
          />
        </div>

        {/* Comments Section */}
        <div className="w-2/5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedPost?.author.profilePicture} alt="post_image" />
                <AvatarFallback className="text-black">
                  {selectedPost?.author.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm">{selectedPost?.author.username}</span>
            </div>
            <MoreHorizontal
              className="cursor-pointer text-black hover:text-gray-600"
              onClick={() => setMoreOpen(true)}
            />
          </div>

          {/* Comments Container */}
          <div className="flex-1 overflow-y-auto p-4">
            {selectedPost?.comments.map(comment => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={text}
                onChange={changeEventHandler}
                className="flex-1 outline-none border border-gray-300 p-2 rounded-lg text-sm"
              />
              <Button variant='outline' disabled={!text.trim()}  onClick={sendMessageHandler} className= '!bg-white w-1  hover:text-blue-700 !border-none   ' > Post </Button> 
            </div>
          </div>
        </div>

        {/* More Options Dialog */}
        <Dialog open={moreOpen} onOpenChange={setMoreOpen}>
          <DialogOverlay className="fixed inset-0 bg-black/50 z-[120]" />
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg w-64 z-[121]">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="text-red-600 hover:bg-gray-100">
                Unfollow
              </Button>
              <Button variant="ghost" className="hover:bg-gray-100">
                Add to favorites
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;





