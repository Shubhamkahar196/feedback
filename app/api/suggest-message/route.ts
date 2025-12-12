import { google } from "@ai-sdk/google";
import { streamText } from "ai";
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
      "Create a list of three open-ended and engaging questions formatted as a single string separated by '||'. Avoid personal topics.";

    const result = await streamText({
      model: google("gemini-2.5-flash-preview-04-17"),
      prompt,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 2048,
          },
        },
      },
    });

    return result.toTextStreamResponse();
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
