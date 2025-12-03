import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
  await dbConnect();

  try {
    const { identifier, password } = await request.json();

    const user = await UserModel.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
      ],
    });
    
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No user found with this email or username",
        },
        { status: 404 }
      );
    }

    if (!user.isVerified) {
      return Response.json(
        {
          success: false,
          message: "Please verify your account before login",
        },
        { status: 403 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "Incorrect password",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          isAcceptingMessage: user.isAcceptingMessage,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error logging in user", error);
    return Response.json(
      {
        success: false,
        message: "Error logging in user",
      },
      {
        status: 500,
      }
    );
  }
}
