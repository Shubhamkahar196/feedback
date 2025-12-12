
// "use client";

// import MessageCard from "@/components/MessageCard";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
// import { toast } from "sonner";
// import { Message } from "@/app/model/User";
// import { ApiResponse } from "@/app/types/ApiResponse";
// import axios from "axios";
// import { Loader2, RefreshCcw } from "lucide-react";
// import React, { useCallback, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { acceptMessageSchema } from "@/app/schema/aceeptMessageSchema";
// import { zodResolver } from "@hookform/resolvers/zod";

// /** safe JWT parser (client-only) */
// function parseJwtPayload(token?: string | null): Record<string, any> | null {
//   if (!token) return null;
//   try {
//     const parts = token.split(".");
//     if (parts.length !== 3) return null;
//     let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
//     while (payload.length % 4) payload += "=";
//     const decoded = atob(payload);
//     // handle utf-8 properly
//     const json = decodeURIComponent(
//       decoded
//         .split("")
//         .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
//         .join("")
//     );
//     return JSON.parse(json);
//   } catch {
//     return null;
//   }
// }

// function getTokenFromLocal() {
//   if (typeof window === "undefined") return null;
//   try {
//     return localStorage.getItem("token");
//   } catch {
//     return null;
//   }
// }

// function safeUsernameFromToken(token?: string | null) {
//   const payload = parseJwtPayload(token);
//   if (!payload) return "";
//   return (payload.username as string) ?? (payload.email as string) ?? "";
// }

// function UserDashboard() {
//   // read token directly (same as you were doing)
//   const token = typeof window !== "undefined" ? getTokenFromLocal() : null;

//   const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSwitchLoading, setIsSwitchLoading] = useState(false);

//   const form = useForm({
//     resolver: zodResolver(acceptMessageSchema),
//   });

//   const { register, watch, setValue } = form;
//   const acceptMessages = watch("acceptMessages");

//   const fetchAcceptMessages = useCallback(async () => {
//     if (!token) return;
//     setIsSwitchLoading(true);

//     try {
//       const response = await axios.get<ApiResponse>("/api/accept-message", {
//         headers: authHeaders,
//       });
//       setValue("acceptMessages", response.data.isAcceptingMessage ?? false);
//     } catch (error) {
//       toast.error("Failed to fetch message settings");
//     } finally {
//       setIsSwitchLoading(false);
//     }
//   }, [token, setValue]);

//   const fetchMessages = useCallback(
//     async (refresh = false) => {
//       if (!token) return;
//       setIsLoading(true);

//       try {
//         const response = await axios.get<ApiResponse>("/api/get-message", {
//           headers: authHeaders,
//         });
//         setMessages(response.data.messages || []);
//         if (refresh) toast.success("Refreshed messages");
//       } catch (error) {
//         toast.error("Failed to fetch messages");
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [token]
//   );

//   useEffect(() => {
//     if (!token) return;
//     fetchMessages();
//     fetchAcceptMessages();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [token]);

//   const handleSwitchChange = async () => {
//     if (!token) {
//       toast.error("Not authenticated");
//       return;
//     }

//     try {
//       const response = await axios.post<ApiResponse>(
//         "/api/accept-message",
//         { acceptMessages: !acceptMessages },
//         { headers: authHeaders }
//       );
//       setValue("acceptMessages", !acceptMessages);
//       toast.success(response.data.message);
//     } catch (error) {
//       toast.error("Failed to update message settings");
//     }
//   };

//   const handleDeleteMessage = (id: string) => {
//     setMessages((prev) => prev.filter((msg) => msg._id.toString() !== id));
//   };

//   if (!token) {
//     return (
//       <div className="text-center mt-10 text-red-500">Please login first.</div>
//     );
//   }

//   // safe username extraction:
//   const username = safeUsernameFromToken(token);

//   // safe origin check:
//   const origin =
//     typeof window !== "undefined" && window.location?.origin
//       ? window.location.origin
//       : "";

//   const profileUrl = username ? `${origin}/u/${encodeURIComponent(username)}` : `${origin}/u/{username}`;

//   return (
//     <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
//       <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

//       <div className="mb-4">
//         <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
//         <div className="flex items-center">
//           <input
//             type="text"
//             value={profileUrl}
//             disabled
//             className="input input-bordered w-full p-2 mr-2"
//           />
//           <Button
//             onClick={() => {
//               if (!username) {
//                 toast.error("Username not available yet.");
//                 return;
//               }
//               navigator.clipboard.writeText(profileUrl);
//               toast.success("URL Copied!");
//             }}
//             disabled={!username}
//           >
//             Copy
//           </Button>
//         </div>
//         {!username && (
//           <p className="text-sm text-muted-foreground mt-2">
//             Username not loaded yet — please wait.
//           </p>
//         )}
//       </div>

//       <div className="mb-4">
//         <Switch
//           {...register("acceptMessages")}
//           checked={acceptMessages}
//           onCheckedChange={handleSwitchChange}
//           disabled={isSwitchLoading}
//         />
//         <span className="ml-2">
//           Accept Messages: {acceptMessages ? "On" : "Off"}
//         </span>
//       </div>

//       <Separator />

//       <Button
//         className="mt-4"
//         variant="outline"
//         onClick={() => fetchMessages(true)}
//       >
//         {isLoading ? (
//           <Loader2 className="h-4 w-4 animate-spin" />
//         ) : (
//           <RefreshCcw className="h-4 w-4" />
//         )}
//       </Button>

//       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
//         {messages.length > 0 ? (
//           messages.map((message) => (
//             <MessageCard
//               key={message._id.toString()}
//               message={message}
//               onMessageDelete={handleDeleteMessage}
//             />
//           ))
//         ) : (
//           <p>No messages found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UserDashboard;




// components/UserDashboard.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Message } from "@/app/model/User";
import { ApiResponse } from "@/app/types/ApiResponse";
import axios from "axios";
import { Loader2, RefreshCcw } from "lucide-react";

function parseJwtPayload(token?: string | null) {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (payload.length % 4) payload += "=";
    const decoded = atob(payload);
    const json = decodeURIComponent(decoded.split("").map(c => "%" + c.charCodeAt(0).toString(16).padStart(2,"0")).join(""));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export default function UserDashboard() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const usernameFromToken = token ? (parseJwtPayload(token)?.username || parseJwtPayload(token)?.email) : "";
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [acceptMessages, setAcceptMessages] = useState(false);
  const profileUrl = usernameFromToken ? `${origin}/u/${encodeURIComponent(usernameFromToken)}` : `${origin}/u/{username}`;

  const getAuthHeaders = () => (token ? { Authorization: `Bearer ${token}` } : {});

  const fetchMessages = useCallback(async (refresh = false) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/get-message", { headers: getAuthHeaders() });
      setMessages(res.data.messages ?? []);
      if (refresh) toast.success("Refreshed messages");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchAcceptMessages = useCallback(async () => {
    if (!token) return;
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/accept-message", { headers: getAuthHeaders() });
      setAcceptMessages(res.data.isAcceptingMessage ?? false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchMessages();
    fetchAcceptMessages();

    // Poll for new messages every 8s
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 8000);

    return () => clearInterval(interval);
  }, [token, fetchMessages, fetchAcceptMessages]);

  const handleSwitchChange = async () => {
    if (!token) return toast.error("Not authenticated");
    setIsSwitchLoading(true);
    try {
      const res = await axios.post<ApiResponse>("/api/accept-message", { acceptMessages: !acceptMessages }, { headers: getAuthHeaders() });
      setAcceptMessages(!acceptMessages);
      toast.success(res.data.message || "Settings updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m._id.toString() !== id));
  };

  if (!token) return <div className="text-center mt-10 text-red-500">Please login first.</div>;

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2" />
          <Button onClick={() => { if (!usernameFromToken) return toast.error("Username missing"); navigator.clipboard.writeText(profileUrl); toast.success("URL Copied!");}} disabled={!usernameFromToken}>Copy</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <Switch checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isSwitchLoading} />
        <span>Accept Messages: {acceptMessages ? "On" : "Off"}</span>
      </div>

      <Separator />

      <Button className="mt-4" variant="outline" onClick={() => fetchMessages(true)}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? messages.map(m => <MessageCard key={m._id.toString()} message={m} onMessageDelete={handleDeleteMessage} />) : <p>No messages found.</p>}
      </div>
    </div>
  );
}
