import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const Comment = ({ comment }) => {
  if (!comment?.author) return null;

  return (
    <div className="group flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.author?.profilePicture} />
        <AvatarFallback className="bg-gray-100 text-xs">
          {comment.author?.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {comment.author?.username || "Unknown"}
          </span>
        </div>
        <p className="text-sm text-gray-700 mt-0.5 leading-5">
          {comment?.text}
        </p>
      </div>
    </div>
  );
};

export default Comment;
