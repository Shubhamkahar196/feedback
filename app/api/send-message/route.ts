// // app/api/send-message/route.ts
// import UserModel, { Message } from "@/app/model/User";
// import dbConnect from "@/app/lib/db";
// import mongoose from "mongoose";
// // optional: import your proxy if you want to identify the sender
// import { getUserIdFromRequest } from "@/app/lib/proxy";

// type SendBody = {
//   username: string; // recipient's username
//   content: string;
//   // optional: anonymous boolean or other metadata
//   anonymous?: boolean;
// };

// export async function POST(request: Request) {
//   await dbConnect();

//   try {
//     const body = (await request.json()) as SendBody;
//     const username = (body.username || "").toString().trim();
//     const content = (body.content || "").toString().trim();

//     // basic validation
//     if (!username) {
//       return Response.json({ success: false, message: "Missing username" }, { status: 400 });
//     }
//     if (!content) {
//       return Response.json({ success: false, message: "Message content is required" }, { status: 400 });
//     }
//     if (content.length > 2000) {
//       return Response.json({ success: false, message: "Message too long (max 2000 chars)" }, { status: 400 });
//     }

//     // Optional: identify sender (if you want to store senderId or prevent abuse)
//     // const senderId = getUserIdFromRequest(request); // uncomment to require auth
//     // if (!senderId) { return Response.json({ success: false, message: "Unauthorized" }, { status: 401 }); }

//     // find recipient
//     const user = await UserModel.findOne({ username });
//     if (!user) {
//       return Response.json({ success: false, message: "Recipient not found" }, { status: 404 });
//     }

//     if (!user.isAcceptingMessage) {
//       return Response.json(
//         { success: false, message: "User is not accepting messages" },
//         { status: 403 }
//       );
//     }

//     // create message object with createdAt
//     const newMessage: Message = {
//       content,
//       createdAt: new Date(),
//       // optional fields:
//       // sender: senderId ?? null,
//       // anonymous: !!body.anonymous
//     } as any;

//     user.messages.push(newMessage);
//     await user.save();

//     return Response.json(
//       { success: true, message: "Message sent successfully", messageId: newMessage._id },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error on send-message route:", error);
//     return Response.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }



// app/api/send-message/route.ts
import UserModel, { Message } from "@/app/model/User";
import dbConnect from "@/app/lib/db";

type SendBody = {
  username: string;
  content: string;
  anonymous?: boolean;
};

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = (await request.json()) as SendBody;
    const username = (body.username || "").toString().trim();
    const content = (body.content || "").toString().trim();

    if (!username) {
      return Response.json({ success: false, message: "Missing username" }, { status: 400 });
    }
    if (!content) {
      return Response.json({ success: false, message: "Message content is required" }, { status: 400 });
    }
    if (content.length > 2000) {
      return Response.json({ success: false, message: "Message too long (max 2000 chars)" }, { status: 400 });
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json({ success: false, message: "Recipient not found" }, { status: 404 });
    }

    if (!user.isAcceptingMessage) {
      return Response.json({ success: false, message: "User is not accepting messages" }, { status: 403 });
    }

    // Build message (Mongoose will add _id)
    const newMessage: Partial<Message> = {
      content,
      createdAt: new Date(),
    };

    user.messages.push(newMessage as any);
    await user.save();

    // Return the new message (last pushed)
    const saved = user.messages[user.messages.length - 1];

    return Response.json(
      { success: true, message: "Message sent successfully", newMessage: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error on send-message route:", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
