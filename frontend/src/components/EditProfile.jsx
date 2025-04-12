import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef()
  const [ input , setInput ] = useState({
    bio : user?.bio,
    gender : user?.gender,
    profilePicture : user?.profilePicture,
  })

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const fileChangeHandler = (e) => {
    const file = e.target.files[0]
    if(file) setInput ({ ...input , profilePicture : file })
  }

  const selectChangeHandler = (value) => {
    setInput({ ...input , gender: value})
  }




  const editProfileHandler = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("bio" , input.bio)
    formData.append("gender" , input.gender)
    if(input.profilePicture) formData.append("profilePicture" , input.profilePicture)

    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit' , formData , {
        headers : {
          "Content-Type" : "multipart/form-data"
        },
        withCredentials : true,
      })
      if(res.data.success) {

        const updatedUserData = {
          ...user , 
          bio : res.data.user.bio ,
          gender : res.data.user.gender,
          profilePicture : res.data.user.profilePicture,
        }
        dispatch(setAuthUser(updatedUserData))
        navigate(`/profile/${user._id}`)

      toast.success(res.data.message)

      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }





  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <h1 className="text-2xl font-semibold mb-8 text-center">Edit Profile</h1>

      <div className="flex items-center gap-6 mb-8">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback className="text-xl">
            {user?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <input ref = {imageRef} onChange = {fileChangeHandler} type="file" className="hidden" />
          <h2 className="font-semibold">{user?.username}</h2>
          <Button
            onClick = {() => imageRef.current.click()}
            variant="secondary"
            className="text-sm text-[#0095F6] hover:!text-blue-600 !border-none !bg-white mr-2"
          >
            Change profile photo
          </Button>
        </div>
      </div>

      <form className="space-y-6" onSubmit = {editProfileHandler}>

        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <Textarea
            name="bio"
            value={input.bio}
            onChange={ (e) => setInput({ ...input , bio: e.target.value})}
            placeholder="Write your bio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <Select className="!bg-white" defaultValue= {input.gender} onValueChange = {selectChangeHandler} >
            <SelectTrigger className="w-[180px] !bg-white">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4">
          {loading ? (
            <Button
              type="submit"
              className="!bg-[#0095F6] hover:!bg-[#0094f6d1] text-white w-full"
            >
              Submitting...
            </Button>
          ) : (
            <Button
              type="submit"
              onClick = {editProfileHandler}
              disabled = {loading}
              className="!bg-[#0095F6] hover:!bg-[#0094f6d1] text-white w-full"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
