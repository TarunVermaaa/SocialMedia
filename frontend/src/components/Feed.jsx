import React from "react";
import Posts from "./Posts";

const Feed = () => {
  return (
    <div className="flex-1 my-12 flex flex-col items-center w-[200%]">
      <Posts />
    </div>
  );
};

export default Feed;