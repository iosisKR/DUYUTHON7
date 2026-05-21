import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI("AIzaSyAUhgiLCnXotkJRPmgt-IWFE4MVPL8GDmM");

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

const SYSTEM_PROMPT = fs.readFileSync(
  "./prompts/system_prompt.txt",
  "utf-8"
);

export async function askGemini(text, purpose) {
  const result = await model.generateContent(
    SYSTEM_PROMPT + ` 사용자는 ${purpose}에 관심이 있어. 오른쪽 내용을 토대로 작성해줘. ${text}`
  );

  return result.response.text();
}