import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Check API key first
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

    // Generate text with Gemini
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

    return result.toAIStreamResponse();
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



// import OpenAI from 'openai';
// import {OpenAIStream, StreamingTextResponse} from 'ai';
// import { NextResponse } from 'next/server';

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY.
// })

// export const runtime = 'edge';

// export async function POST(req:Request){
//     try {

//         const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment"

//         const response = await openai.chat.completion.create({
//             model: 'gpt-3.5-turbo',
//             stream: true,
//             messages,
//         })

//         const stream = OpenAIStream(response);
//         return new StreamingTextResponse(stream)
//     } catch (error) {
//         if(error instanceof OpenAI.APIError){
//          const {name, status,headers,message} = error;
//          return NextResponse.json({
//             name,status,headers,message
//          },status)
//         }else{
//             console.error('An unexpected error occured')
//             throw error
//         }
//     }
// }