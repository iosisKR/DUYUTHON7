import { askGeminiForAlarm, askGeminiForStock, askGeminiForMove } from "../services/gemini.js";

export async function analyzeTrash(req, res) {
  const test = req.body.text.split("!AND!");
  const text = test[0];
  const purpose = test[1];
  const result = await askGeminiForAlarm(text, purpose);

  res.json({
    result,
  });
}

export async function analyzeStock(req, res) {
  const result = await askGeminiForStock(rentalHistory);

  res.json({
    result,
  });
}

export async function analyzeMove(req, res) {
  const result = await askGeminiForMove(rentalHistory);

  res.json({
    result,
  });
}

