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



// app/api/accept-message/route.ts
import dbConnect from "@/app/lib/db";
import UserModel from "@/app/model/User";
import { getUserIdFromRequest } from "@/app/lib/proxy";

export async function GET(request: Request) {
  await dbConnect();
  const userId = getUserIdFromRequest(request);
  if (!userId) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const user = await UserModel.findById(userId).select("isAcceptingMessage");
    if (!user) return Response.json({ success: false, message: "User not found" }, { status: 404 });
    return Response.json({ success: true, isAcceptingMessage: user.isAcceptingMessage }, { status: 200 });
  } catch (error) {
    console.error("accept-message GET error:", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const userId = getUserIdFromRequest(request);
  if (!userId) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const acceptMessages = !!body.acceptMessages;

    const updated = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessages }, { new: true });
    if (!updated) return Response.json({ success: false, message: "User not found" }, { status: 404 });

    return Response.json({ success: true, message: "Status updated", isAcceptingMessage: updated.isAcceptingMessage }, { status: 200 });
  } catch (error) {
    console.error("accept-message POST error:", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
