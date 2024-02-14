import {connectToDB} from "@services/mongodb";
import User from "@models/User";

export const GET = async (req, res) => {
  try {
      await connectToDB();


      const allUsers = await User.find();

      return new Response(JSON.stringify(allUsers), {status: 200})
  } catch (e) {
      console.log(e)
      return new Response("Thất bại khi lấy dữ liệu toàn bộ người dùng!")
  }
}