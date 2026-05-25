import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite",
});

const SYSTEM_PROMPT = fs.readFileSync(
  "./prompts/system_prompt.txt",
  "utf-8"
);
const STOCK_PROMPT = fs.readFileSync(
  "./prompts/Stock_Alert.txt",
  "utf-8"
);
const MOVE_PROMPT = fs.readFileSync(
  "./prompts/Move_Prompt.txt",
  "utf-8"
);


export async function askGeminiForAlarm(text, purpose) {
  const result = await model.generateContent(
    SYSTEM_PROMPT + ` 사용자는 ${purpose} 환경에 관심이 있어. 오른쪽의 사용량을 토대로 작성해줘. ${text}`
  );

  return result.response.text();
}

export async function askGeminiForStock(text) {
  const result = await model.generateContent(
    STOCK_PROMPT + text
  );

  return result.response.text();
}

export async function askGeminiForMove(text) {
  const result = await model.generateContent(
    MOVE_PROMPT + text
  );

  return result.response.text();
}

export async function askGeminiForAdmin(text) {
  const result = await model.generateContent(
    `프롬프트 + 내용 해서 한번에 받고(리스트형태, 즉 사용하기 편한 타입으로) 그걸 보여주기`
  );

  return result.response.text();
}