import dbConnect from "@/app/lib/db";
import UserModel from "@/app/model/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signInSchema } from "@/app/schema/signInSchema"; 

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, message: "Invalid input", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return Response.json(
        { success: false, message: "No user found with this email" },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return Response.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    return Response.json(
      {
        success: true,
        message: "Login successful",
        token, 
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          isAcceptingMessage: user.isAcceptingMessage,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Signin error:", error);
    return Response.json(
      { success: false, message: "Error while signing in" },
      { status: 500 }
    );
  }
}
