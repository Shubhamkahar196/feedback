import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        {
          error: true,
          message: "Missing GOOGLE_GENERATIVE_AI_API_KEY",
        },
        { status: 500 }
      );
    }

    const prompt =
      "Create exactly three open-ended and engaging questions. Format your response as a single line with each question separated by '||' only. Do not include numbers, bullets, or any other text. Avoid personal topics. Example: What is your favorite hobby?||How do you like to spend your free time?||What are some interesting facts you know?";

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    return new Response(result.text);
  } catch (error: any) {
    console.error("Gemini API Error:", error);

    return NextResponse.json(
      {
        error: true,
        message: error.message || "Unexpected Gemini API error",
      },
      { status: 500 }
    );
  }
}
