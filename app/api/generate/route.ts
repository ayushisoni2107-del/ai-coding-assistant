import { GenerateRequest } from "@/app/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey);

export const POST = async (req: NextRequest) => {
  try {
    const { description, language }: GenerateRequest = await req.json();
    if (!description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Generate ${language || "Javascript"} code for: ${description} \n\n Code:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generateCode = response.text();
    return NextResponse.json({ data: { generateCode } }, { status: 200 });
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
  }
}