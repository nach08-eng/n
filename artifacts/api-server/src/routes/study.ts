import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { GeneratePlanBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/generate-plan", async (req, res) => {
  const parsed = GeneratePlanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body. 'goal' is required." });
    return;
  }

  const { goal } = parsed.data;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      max_completion_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Create a 1-day study plan for a beginner learning ${goal}. Return only 3 short tasks as a JSON array of strings. Example: ["Task 1", "Task 2", "Task 3"]. Return ONLY the JSON array, no other text.`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      res.status(500).json({ error: "No response from AI." });
      return;
    }

    let tasks: string[];
    try {
      tasks = JSON.parse(content);
      if (!Array.isArray(tasks)) throw new Error("Not an array");
    } catch {
      const lines = content
        .split("\n")
        .map((l: string) => l.replace(/^[-\d.\s*]+/, "").trim())
        .filter((l: string) => l.length > 0)
        .slice(0, 3);
      tasks = lines;
    }

    res.json({ tasks });
  } catch (err: unknown) {
    req.log.error({ err }, "Failed to generate plan");
    res.status(500).json({ error: "Failed to generate study plan." });
  }
});

export default router;
