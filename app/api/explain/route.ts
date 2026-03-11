import { ExplainRequest } from "@/app/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey);

export const POST = async (req: NextRequest) => {
  try {
    const { code }: ExplainRequest = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Explain the following code in detail:\n\n${code}\n\n Explanation:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();
    return NextResponse.json({ data: { explanation } }, { status: 200 });
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json({ error: "Failed to explain code" }, { status: 500 });
  }
}