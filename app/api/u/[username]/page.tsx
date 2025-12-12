


// "use client";

// import React, { useState } from "react";
// import axios, { AxiosError } from "axios";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { CardHeader, CardContent, Card } from "@/components/ui/card";
// import { useCompletion } from "@ai-sdk/react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import * as z from "zod";
// import { ApiResponse } from "@/app/types/ApiResponse";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import { MessageSchema } from "@/app/schema/messageSchema";

// const specialChar = "||";
// const MAX_MESSAGE_LENGTH = 300;

// const parseStringMessages = (messageString: string | undefined): string[] => {
//   if (!messageString) return [];
//   return messageString
//     .split(specialChar)
//     .map((s) => s.trim())
//     .filter(Boolean);
// };

// const initialMessageString =
//   "What's your favorite movie?||Do you have any pets?||What's your dream job?";

// export default function SendMessagePage() {
//   const params = useParams();
//   const username = params?.username;

//   const {
//     complete,
//     completion,
//     isLoading: isSuggestLoading,
//     error,
//   } = useCompletion({
//     api: "/api/suggest-message",
//     initialCompletion: initialMessageString,
//   });

//   const form = useForm<z.infer<typeof MessageSchema>>({
//     resolver: zodResolver(MessageSchema),
//     defaultValues: { content: "" },
//   });

//   const messageContent = form.watch("content");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleMessageClick = (message: string) => {
//     form.setValue("content", message);
//   };

//   const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
//     if (!username) {
//       toast.error("Missing username. Cannot send message — username missing from URL.");
//       return;
//     }

//     const content = (data.content || "").toString().trim();
//     if (!content) {
//       toast.error("Empty message. Please enter a message before sending.");
//       return;
//     }

//     if (content.length > MAX_MESSAGE_LENGTH) {
//       toast.error(`Message too long. Max ${MAX_MESSAGE_LENGTH} characters allowed.`);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post<ApiResponse>("/api/send-message", {
//         username,
//         content,
//       });

//       if (response.data?.success) {
//         toast.success(response.data.message ?? "Message sent");
//         form.reset({ ...form.getValues(), content: "" });
//       } else {
//         toast.error(response.data.message ?? "Could not send message");
//       }
//     } catch (err: any) {
//       const axiosError = err as AxiosError<ApiResponse>;
//       const status = axiosError.response?.status;
//       if (status === 403) {
//         toast.error(
//           axiosError.response?.data?.message ?? "This user is not accepting messages."
//         );
//       } else if (status === 404) {
//         toast.error(axiosError.response?.data?.message ?? "Recipient not found.");
//       } else {
//         toast.error(axiosError.response?.data?.message ?? "Failed to send message");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchSuggestedMessages = async () => {
//     try {
//       await complete("");
//     } catch (err) {
//       console.error("Error fetching suggestions:", err);
//       toast.error("Could not fetch suggested messages. Try again later.");
//     }
//   };

//   if (!username) {
//     return (
//       <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
//         <h1 className="text-2xl font-semibold mb-4">Invalid profile</h1>
//         <p>Profile username missing from URL. Please check the link.</p>
//         <Separator className="my-6" />
//         <Link href="/sign-up">
//           <Button>Create Your Account</Button>
//         </Link>
//       </div>
//     );
//   }

//   const suggested = parseStringMessages(completion || initialMessageString);

//   return (
//     <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
//       <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>

//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Send Anonymous Message to @{username}</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder="Write your anonymous message here"
//                     className="resize-none"
//                     maxLength={MAX_MESSAGE_LENGTH}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <div className="flex justify-center">
//             {isLoading ? (
//               <Button disabled>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Please wait
//               </Button>
//             ) : (
//               <Button type="submit" disabled={isLoading || !messageContent?.trim()}>
//                 Send It
//               </Button>
//             )}
//           </div>
//         </form>
//       </Form>

//       <div className="space-y-4 my-8">
//         <div className="space-y-2">
//           <Button onClick={fetchSuggestedMessages} className="my-4" disabled={isSuggestLoading}>
//             {isSuggestLoading ? "Loading..." : "Suggest Messages"}
//           </Button>
//           <p className="text-sm text-muted-foreground">Click on any message below to select it.</p>
//         </div>

//         <Card>
//           <CardHeader>
//             <h3 className="text-xl font-semibold">Messages</h3>
//           </CardHeader>
//           <CardContent className="flex flex-col space-y-4">
//             {error ? (
//               <p className="text-red-500">{error.message}</p>
//             ) : (
//               suggested.map((msg, idx) => (
//                 <Button key={idx} variant="outline" className="mb-2" onClick={() => handleMessageClick(msg)}>
//                   {msg}
//                 </Button>
//               ))
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       <Separator className="my-6" />
//       <div className="text-center">
//         <div className="mb-4">Get Your Message Board</div>
//         <Link href={"/sign-up"}>
//           <Button>Create Your Account</Button>
//         </Link>
//       </div>
//     </div>
//   );
// }




"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { useCompletion } from "@ai-sdk/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as z from "zod";
import { ApiResponse } from "@/app/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageSchema } from "@/app/schema/messageSchema";

const specialChar = "||";
const MAX_MESSAGE_LENGTH = 300;
const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const parseStringMessages = (s?: string) => (s ? s.split(specialChar).map(x => x.trim()).filter(Boolean) : []);

export default function SendMessagePage() {
  const params = useParams();
  const username = params?.username;

  const { complete, completion, isLoading: isSuggestLoading, error } = useCompletion({
    api: "/api/suggest-message",
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: { content: "" },
  });

  const messageContent = form.watch("content");
  const [isLoading, setIsLoading] = useState(false);

  const handleMessageClick = (message: string) => form.setValue("content", message);

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    if (!username) return toast.error("Missing profile username.");
    const content = (data.content || "").toString().trim();
    if (!content) return toast.error("Please enter a message.");
    if (content.length > MAX_MESSAGE_LENGTH) return toast.error(`Message too long. Max ${MAX_MESSAGE_LENGTH} chars.`);

    setIsLoading(true);
    try {
      const res = await axios.post<ApiResponse>("/api/send-message", { username, content });
      if (res.data.success) {
        toast.success(res.data.message || "Message sent");
        // optional: if you want sender to see message appended, do it here
        form.reset({ content: "" });
      } else {
        toast.error(res.data.message || "Could not send message");
      }
    } catch (err: any) {
      const axiosErr = err as AxiosError<ApiResponse>;
      const status = axiosErr.response?.status;
      if (status === 403) toast.error(axiosErr.response?.data?.message || "This user is not accepting messages.");
      else if (status === 404) toast.error(axiosErr.response?.data?.message || "User not found.");
      else toast.error(axiosErr.response?.data?.message || "Failed to send message.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      await complete("");
    } catch (e) {
      console.error(e);
      toast.error("Could not fetch suggestions");
    }
  };

  if (!username) {
    return (
      <div className="container mx-auto p-6 bg-white rounded max-w-4xl">
        <h2>Invalid profile</h2>
        <p>Username missing in URL</p>
      </div>
    );
  }

  const suggested = (completion ?? initialMessageString).split("||").map(s => s.trim()).filter(Boolean);

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Send Anonymous Message</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField control={form.control} name="content" render={({ field }) => (
            <FormItem>
              <FormLabel>Send to @{username}</FormLabel>
              <FormControl>
                <Textarea maxLength={MAX_MESSAGE_LENGTH} placeholder="Write your anonymous message…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending…</Button>
            ) : (
              <Button type="submit" disabled={!messageContent?.trim()}>Send It</Button>
            )}
          </div>
        </form>
      </Form>

      <div className="my-8">
        <Button onClick={fetchSuggestedMessages} disabled={isSuggestLoading}>{isSuggestLoading ? "Loading…" : "Suggest Messages"}</Button>
        <Card className="mt-4">
          <CardHeader><h3 className="text-lg font-semibold">Suggestions</h3></CardHeader>
          <CardContent className="flex flex-col gap-3">
            {error ? <p className="text-red-500">{error.message}</p> : suggested.map((s, i) => (
              <Button key={i} variant="outline" onClick={() => handleMessageClick(s)}>{s}</Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="text-center mt-6">
        <Link href="/sign-up"><Button>Create Your Account</Button></Link>
      </div>
    </div>
  );
}
