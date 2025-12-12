// // // app/api/messages/[messageid]/route.ts  (or wherever your route lives)
// // import UserModel from "@/app/model/User";
// // import dbConnect from "@/app/lib/db";
// // import { getUserIdFromRequest } from "@/app/lib/proxy";


// // export async function DELETE(
// //   request: Request,
// //   { params }: { params: { messageid: string } }
// // ) {
// //   await dbConnect();

// //   const userId = getUserIdFromRequest(request);
// //   if (!userId) {
// //     return Response.json(
// //       { success: false, message: "Unauthorized" },
// //       { status: 401 }
// //     );
// //   }

// //   const messageid = params.messageid;
// //   if (!messageid) {
// //     return Response.json(
// //       { success: false, message: "Missing message id" },
// //       { status: 400 }
// //     );
// //   }

// //   try {
// //     const updateResult = await UserModel.updateOne(
// //       { _id: userId },
// //       { $pull: { messages: { _id: messageid } } }
// //     );

// //     const modified =
// //       (updateResult as any).modifiedCount ?? (updateResult as any).nModified ?? 0;

// //     if (modified === 0) {
// //       return Response.json(
// //         { success: false, message: "Message not found or already deleted" },
// //         { status: 404 }
// //       );
// //     }

// //     return Response.json(
// //       { success: true, message: "Message deleted" },
// //       { status: 200 }
// //     );
// //   } catch (error) {
// //     console.error("Error deleting message:", error);
// //     return Response.json(
// //       { success: false, message: "Error deleting message" },
// //       { status: 500 }
// //     );
// //   }
// // }


// // app/api/delete-message/[messageid]/route.ts
// import dbConnect from "@/app/lib/db";
// import UserModel from "@/app/model/User";
// import { getUserIdFromRequest } from "@/app/lib/proxy";

// export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
//   await dbConnect();
//   const userId = getUserIdFromRequest(request);
//   if (!userId) return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });

//   const messageid = params.messageid;
//   if (!messageid) return Response.json({ success: false, message: "Missing message id" }, { status: 400 });

//   try {
//     const updateResult = await UserModel.updateOne({ _id: userId }, { $pull: { messages: { _id: messageid } } });
//     if (updateResult.modifiedCount === 0) {
//       return Response.json({ success: false, message: "Message not found or already deleted" }, { status: 404 });
//     }

//     return Response.json({ success: true, message: "Message deleted" }, { status: 200 });
//   } catch (error) {
//     console.error("delete-message error:", error);
//     return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
//   }
// }

// app/api/delete-message/[messageid]/route.ts
import dbConnect from "@/app/lib/db";
import UserModel from "@/app/model/User";
import { getUserIdFromRequest } from "@/app/lib/proxy";
import mongoose from "mongoose";

export async function DELETE(request: Request, context: any) {
  await dbConnect();

  try {
    // Next may pass params as a Promise. Await it safely.
    const params = await (context?.params ?? {});
    // DEBUG logs:
    console.log("DELETE /api/delete-message handler called");
    console.log("request.url:", request.url);
    console.log("params (after await):", params);

    const userId = getUserIdFromRequest(request);
    if (!userId) {
      console.log("Unauthorized: no userId from token");
      return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const messageid = params?.messageid;
    if (!messageid) {
      console.log("Bad request: missing params.messageid");
      return Response.json({ success: false, message: "Missing message id in params" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(messageid)) {
      console.log("Bad request: invalid ObjectId:", messageid);
      return Response.json({ success: false, message: "Invalid message id format" }, { status: 400 });
    }

    const updateResult = await UserModel.updateOne(
      { _id: userId },
      { $pull: { messages: { _id: messageid } } }
    );

    console.log("updateResult:", updateResult);

    if (!updateResult) {
      return Response.json({ success: false, message: "Update failed" }, { status: 500 });
    }

    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, message: "Message deleted" }, { status: 200 });
  } catch (error) {
    console.error("delete-message route error:", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
