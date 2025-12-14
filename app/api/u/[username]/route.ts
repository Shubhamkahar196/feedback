import UserModel from "@/app/model/User";
import dbConnect from "@/app/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  await dbConnect();

  try {
    const { username } = await params;
    const usernameTrimmed = username?.toString().trim();
    if (!usernameTrimmed) {
      return Response.json({ exists: false }, { status: 400 });
    }

    const user = await UserModel.findOne({ username: usernameTrimmed });
    return Response.json({ exists: !!user }, { status: 200 });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return Response.json({ exists: false }, { status: 500 });
  }
}
