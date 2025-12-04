import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect()
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    
    // is accepting message

    if(!user.isAcceptingMessage){
          return Response.json(
      {
        success: false,
        message: "User is not accepting the messages",
      },
      { status: 401 }
    );
    }

    const newMessage = {content,createdAt: new Date()}
   user.messages.push(newMessage as Message)
   await user.save()

     return Response.json(
      {
        success: true,
        message: "Message send successfully",
      },
      { status: 201}
    );
  } catch (error) {
    console.log("Error on send-message route.ts",error)
      return Response.json(
      {
        success: false,
        message: "Internal server problem",
      },
      { status: 500 }
    );
  }
}
