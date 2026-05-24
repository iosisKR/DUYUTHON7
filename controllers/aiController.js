import { askGeminiForAlarm } from "../services/gemini.js";

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
  const result = await askGeminiForStock(req.body.text);

  res.json({
    result,
  });
}

export async function analyzeMove(req, res) {
  const result = await askGeminiForMove(req.body.text);

  res.json({
    result,
  });
}

