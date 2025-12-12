// import UserModel from "@/app/model/User";
// import dbConnect from "@/app/lib/db";
// import { getUserIdFromRequest } from "@/app/lib/proxy";

// export async function POST(request: Request) {
//   await dbConnect();

//   const userId = getUserIdFromRequest(request);
//   if (!userId) {
//     return Response.json(
//       { success: false, message: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const { acceptMessages } = await request.json();

//   const updatedUser = await UserModel.findByIdAndUpdate(
//     userId,
//     { isAcceptingMessage: acceptMessages },
//     { new: true }
//   );

//   if (!updatedUser) {
//     return Response.json(
//       { success: false, message: "User not found" },
//       { status: 404 }
//     );
//   }

//   return Response.json({
//     success: true,
//     message: "Status updated",
//     isAcceptingMessage: updatedUser.isAcceptingMessage,
//   });
// }

// export async function GET(request: Request) {
//   await dbConnect();

//   const userId = getUserIdFromRequest(request);
//   if (!userId) {
//     return Response.json(
//       { success: false, message: "Unauthorized" },
//       { status: 401 }
//     );
//   }

//   const foundUser = await UserModel.findById(userId);

//   if (!foundUser) {
//     return Response.json(
//       { success: false, message: "User not found" },
//       { status: 404 }
//     );
//   }

//   return Response.json({
//     success: true,
//     isAcceptingMessage: foundUser.isAcceptingMessage,
//   });
// }



// app/api/get-messages/route.ts
import dbConnect from "@/app/lib/db";
import UserModel from "@/app/model/User";
import { getUserIdFromRequest } from "@/app/lib/proxy";

export async function GET(request: Request) {
  await dbConnect();

  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await UserModel.findById(userId).select("messages username email isAcceptingMessage");
    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      message: "Messages fetched",
      messages: user.messages ?? [],
      isAcceptingMessage: user.isAcceptingMessage,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("get-messages error:", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
