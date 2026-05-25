import { askGeminiForAlarm, askGeminiForStock, askGeminiForMove } from "../services/gemini.js";

export async function analyzeTrash(req, res) {
  console.log("가라 환경 정화 분석!")
  const test = req.body.text.split("!AND!");
  const text = test[0];
  const purpose = test[1];
  const result = await askGeminiForAlarm(text, purpose);

  res.json({
    result,
  });
}

export async function analyzeStock(req, res) {
  console.log("가라 재고 분석!")
  const result = await askGeminiForStock(rentalHistory);
  console.log(result);
  res.json({
    result,
  });
}

export async function analyzeMove(req, res) {
  console.log("가라 이동 분석!")
  const result = await askGeminiForMove(rentalHistory);
  console.log(result);
  res.json({
    result,
  });
}