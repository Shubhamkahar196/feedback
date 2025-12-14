"use client";

import React, { useState, useEffect } from "react";
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


import * as z from "zod";
import { ApiResponse } from "@/app/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageSchema } from "@/app/schema/messageSchema";
import { toast } from "sonner";

const specialChar = "||";

const parseStringMessages = (messageString: string): string[] => {
  if (!messageString) return [];
  return messageString
    .split(specialChar)
    .map((s) => s.trim())
    .filter(Boolean);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams();
  const username = params?.username as string;

  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-message",
    initialCompletion: initialMessageString,
  });

  useEffect(() => {
    const checkUserExists = async () => {
      if (!username) {
        setUserExists(false);
        setCheckingUser(false);
        return;
      }
      try {
        const response = await axios.get(`/u/${encodeURIComponent(username)}`);
        setUserExists(response.data.exists ?? true);
      } catch (err: unknown) {
        setUserExists(false);
      } finally {
        setCheckingUser(false);
      }
    };
    checkUserExists();
  }, [username]);

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: { content: "" },
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);

  // send anonymous message
  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    if (!username) {
      toast.error("Missing username. Cannot send message: missing profile username.");

      return;
    }

    const content = (data.content || "").toString().trim();
    if (!content) {
      toast.error("Please enter message before send")
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        content,
        username,
      });
     
     toast.success("message sent successfully",)
     console.log(response);

      // reset the content field only
      form.reset({ ...form.getValues(), content: "" });
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiResponse>;
      toast.error("Failed to send message")
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      // this triggers the `useCompletion` to fetch from `/api/suggest-message`
      await complete("");
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast.error("Could not fetch suggested messages. Try again later.")
    }
  };

  // If username is missing (route misconfigured), show friendly UI
  if (!username) {
    return (
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-2xl font-semibold mb-4">Invalid profile</h1>
        <p>Profile username missing from URL. Please check the link.</p>
        <Separator className="my-6" />
        <Link href="/sign-up">
          <Button>Create Your Account</Button>
        </Link>
      </div>
    );
  }

  if (checkingUser) {
    return (
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl text-center">
        Checking user...
      </div>
    );
  }

  if (userExists === false) {
    return (
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
        <h1 className="text-2xl font-semibold mb-4">User not found</h1>
        <p>This user does not exist. Please check the link.</p>
        <Separator className="my-6" />
        <Link href="/sign-up">
          <Button>Create Your Account</Button>
        </Link>
      </div>
    );
  }

  const messagesString = completion || initialMessageString;
  const suggested = parseStringMessages(messagesString);

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || isSuggestLoading || !(messageContent || "").trim()}
              >
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button onClick={fetchSuggestedMessages} className="my-4" disabled={isSuggestLoading}>
            {isSuggestLoading ? "Loading..." : "Suggest Messages"}
          </Button>
          <p className="text-sm text-muted-foreground">Click on any message below to select it.</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {error ? (
              <p className="text-red-500">{error.message}</p>
            ) : (
              suggested.map((message, index) => (
                <Button key={index} variant="outline" className="mb-2" onClick={() => handleMessageClick(message)}>
                  {message}
                </Button>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
