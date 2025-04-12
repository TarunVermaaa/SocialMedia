import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((store) => store.post);

  // Simply reverse the posts array to show newest first
  const reversedPosts = [...posts].reverse();

  return (
    <div>
      {reversedPosts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Posts;
