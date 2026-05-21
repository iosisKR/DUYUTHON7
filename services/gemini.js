import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAUhgiLCnXotkJRPmgt-IWFE4MVPL8GDmM");

const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

export async function askGemini(text) {
  const result = await model.generateContent(
    `${text}여기에 대충 내용 넣으세여`
  );

  return result.response.text();
}