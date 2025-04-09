import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import React, { useRef, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { toast } from "sonner";
import axios from "axios";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();

  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const createPostHandler = async (e) => {
    e.preventDefault();
    try {

      const res = await axios

    } catch (error) {

      toast.error(error.response?.data?.message || "Post creation failed");

    }
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50 w-[90%] max-w-md"
      >
        <div className="space-y-4">
          <h2 className="text-lg text-center font-semibold mb-4">
            Create New Post
          </h2>

          <div className="flex gap-4 items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src="https://example.com/avatar.jpg"
                alt="User Avatar"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h2 className="font-semibold text-sm">Username</h2>
              <span className="text-gray-600 text-xs">Bio here...</span>
            </div>
          </div>

          <Textarea
          value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border-gray-300 focus:ring-2 focus:ring-[#0095F6] rounded-md"
            placeholder="Write a caption..."
            rows={4}
          />

          {imagePreview && (
            <div className="w-full h-64 flex items-center justify-center">
              <img src={imagePreview} alt="previewImg" />
            </div>
          )}

          <div className="flex flex-col items-center gap-4 border-dashed border-2 border-gray-300 p-6 rounded-lg">
            <input
              type="file"
              id="file-upload"
              ref={imageRef}
              className="hidden"
              onChange={fileChangeHandler}
            />
            <Button
              className="w-full max-w-xs !bg-[#0095F6] hover:!bg-[#1877f2] text-white !rounded-2xl py-2 px-6"
              onClick={() => imageRef.current.click()}
            >
              Select from computer
            </Button>

            {imagePreview &&
              (loading ? (
                <Button> Please wait... </Button>
              ) : (
                <Button onClick={createPostHandler} type="submit" className="w-full">
                  Post
                </Button>
              ))}

            <span className="text-gray-500 text-sm">JPEG, PNG supported</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
