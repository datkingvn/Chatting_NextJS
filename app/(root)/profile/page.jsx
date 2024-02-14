"use client";
import React, {useEffect, useState} from "react";
import TopBar from "@components/TopBar";
import {PersonOutline, UploadFile} from "@mui/icons-material";
import {useSession} from "next-auth/react";
import {useForm} from "react-hook-form";
import {CldUploadButton} from "next-cloudinary";
import Loader from "@components/Loader";

const Profile = () => {
    const {data: session} = useSession();
    const user = session?.user;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            reset({
                username: user?.username,
                profileImage: user?.profileImage,
            })
        }

        setLoading(false);
    }, [user]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: {errors},
    } = useForm();

    const uploadPhoto = (result) => {
        setValue("profileImage", result?.info?.secure_url);
        // Update the user object to reflect the new profile image
        const updatedUser = { ...user, profileImage: result?.info?.secure_url };
        // Update the session data
        reset({ username: updatedUser.username, profileImage: updatedUser.profileImage });
    };

    const updateUser = async (data) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/users/${user._id}/update`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            console.log(res)

            setLoading(false);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    return loading ? <Loader/> : (
        <>
            <TopBar/>
            <div className="flex items-center justify-center h-screen">
                <div className="mx-auto w-full max-w-[550px] bg-white rounded-xl">
                    <form className="py-4 px-9" onSubmit={handleSubmit(updateUser)}>
                        <div className="mb-5">
                            <label
                                htmlFor="username"
                                className="mb-1 block text-xl font-semibold text-[#07074D]"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <input
                                    defaultValue=""
                                    type="text"
                                    placeholder="Username"
                                    className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md pr-10"
                                    {...register("username", {
                                        required: "Vui lòng nhập Username!",
                                        validate: (value) => {
                                            if (value.length < 3) {
                                                return "Username tối thiểu là 3 kí tự!";
                                            }
                                        },
                                    })}
                                />
                                {errors.username && (
                                    <p className='text-red-500 italic text-sm'
                                       style={{fontSize: '14px'}}>{errors.username.message}</p>
                                )}

                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <PersonOutline sx={{color: "#374151"}}/>
                                </div>
                            </div>
                        </div>
                        <div className="mb-6 pt-4">
                            <label className="mb-5 block text-xl font-semibold text-[#07074D]">
                                Thay Avatar
                            </label>
                            <div className="flex flex-row items-center justify-center mb-8">
                                <div className="mr-4">
                                    <img
                                        className="w-[140px] h-[140px] rounded-full object-cover"
                                        src={watch("profileImage") || user?.profileImage || "assets/person.jpg"}
                                        alt="Avatar"
                                    />
                                </div>
                                <input type="file" name="file" id="file" className="sr-only"/>
                                <label
                                    htmlFor="file"
                                    className="relative flex items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center cursor-pointer"
                                >
                                    <div>
                                        <CldUploadButton options={{maxFiles: 1}} onUpload={uploadPhoto}
                                                         uploadPreset="dchatapp">
                  <span
                      className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#374151]">
                    <UploadFile
                        sx={{color: "#374151"}}
                        className="mr-2"
                    />
                    Upload
                  </span>
                                        </CldUploadButton>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="hover:shadow-form w-full rounded-md bg-gray-700 py-3 px-8 text-center text-base font-semibold text-white outline-none uppercase"
                            >
                                Thay đổi ngay
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Profile;