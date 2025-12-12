// "use client";

// import React, { useState } from "react";
// import {
//   Card,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import dayjs from 'dayjs'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Button } from "./ui/button";
// import { X } from "lucide-react";
// import { Message } from "@/app/model/User";
// import axios from "axios";
// import { ApiResponse } from "@/app/types/ApiResponse";
// import { toast } from "sonner";


// type MessageCardProps = {
//   message: Message;
//   onMessageDelete: (messageId: string) => void;
// };

// const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleDeleteConfirm = async () => {
//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     if (!token) {
//       toast.error("Not authenticated");
//       return;
//     }

//     setIsDeleting(true);
//     try {
//       const res = await axios.delete<ApiResponse>(`/api/messages/${message._id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.data?.success) {
//         toast.success(res.data.message ?? "Message deleted");
//         onMessageDelete(message._id.toString());
//       } else {
//         toast.error(res.data?.message ?? "Failed to delete message");
//       }
//     } catch (err: any) {
//       console.error("Delete message error:", err);
//       toast.error(
//         err?.response?.data?.message ?? "Server error while deleting message"
//       );
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader className="flex items-start justify-between gap-4">
//         <div>
//           <CardTitle className="text-base">
//             {message?.content?.slice(0, 60) || "Message"}
//           </CardTitle>
//           <CardDescription className="text-sm text-muted-foreground">
//             {message?.content}
//           </CardDescription>
//           <div className="text-xs text-muted-foreground mt-2">
//             {message?.createdAt
//               ? dayjs(message.createdAt).format("MMM D, YYYY h:mm A")
//               : ""}
//           </div>
//         </div>

//         <div>
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button variant="destructive" aria-label="Delete message" disabled={isDeleting}>
//                 <X className="w-5 h-5" />
//               </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Delete message?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   This will permanently remove this message from your inbox.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
//                 <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
//                   {isDeleting ? "Deleting..." : "Delete"}
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </div>
//       </CardHeader>
//     </Card>
//   );
// };

// export default MessageCard;






"use client";

import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/app/model/User";
import axios from "axios";
import { ApiResponse } from "@/app/types/ApiResponse";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    setIsDeleting(true);
    try {
      // <-- CHANGED endpoint to match server: /api/delete-message/[messageid]
      const res = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        toast.success(res.data.message ?? "Message deleted");
        onMessageDelete(message._id.toString());
      } else {
        toast.error(res.data?.message ?? "Failed to delete message");
      }
    } catch (err: any) {
      console.error("Delete message error:", err);
      toast.error(
        err?.response?.data?.message ?? "Server error while deleting message"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">
            {message?.content?.slice(0, 60) || "Message"}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {message?.content}
          </CardDescription>
          <div className="text-xs text-muted-foreground mt-2">
            {message?.createdAt
              ? dayjs(message.createdAt).format("MMM D, YYYY h:mm A")
              : ""}
          </div>
        </div>

        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" aria-label="Delete message" disabled={isDeleting}>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove this message from your inbox.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;

