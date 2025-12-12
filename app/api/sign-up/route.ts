import bcrypt from "bcryptjs";
import UserModel from "@/app/model/User";
import dbConnect from "@/app/lib/db";
import { signUpSchema } from "@/app/schema/signUpSchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ success: false, message: parsed.error }, { status: 400 });
    }

    const data = parsed.data;

    const existingUser = await UserModel.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });

    if (existingUser) {
      return Response.json(
        { success: false, message: "Email or Username already exists" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(data.password, 10);

    const newUser = await UserModel.create({
      ...data,
      password: hash,
    });

    return Response.json(
      { success: true, message: "User created successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ success: false, message: "Signup error" }, { status: 500 });
  }
}
