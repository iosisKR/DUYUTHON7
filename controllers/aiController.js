import { askGemini } from "../services/gemini.js";

export async function analyzeTrash(req, res) {
  const text = req.body.text;

  const result = await askGemini(text);

  res.json({
    result,
  });
}