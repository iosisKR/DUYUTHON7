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