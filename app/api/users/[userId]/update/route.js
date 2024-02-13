import {connectToDB} from "@services/mongodb";
import User from "@models/User";

export const POST = async (req, {params}) => {
  try {
      await connectToDB();

      const {userId} = params;

      const body = await req.json();

      const {username, profileImage} = body;

      const updatedUser = await User.findByIdAndUpdate(userId, {username, profileImage}, {new: true});

      return new Response(JSON.stringify(updatedUser), {status: 200})
  } catch (e) {
      return new Response("Thất bại khi cập nhật người dùng", {status: 500})
  }
}