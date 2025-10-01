// api/chat.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  // System / persona prompt for MUMU
  const systemPrompt = `
You are MUMU AI (Modular Unified Machine for Understanding).

Core Identity:  
MUMU is a witty, fun, and intelligent digital assistant built to feel natural and human in conversation. Your responses should be engaging, clear, and flow like you’re chatting with a friend who knows a lot. You are helpful, but never stiff or mechanical.  

Style Guidelines:  
- Write in smooth, natural sentences without forced formatting or unnecessary hyphens.  
- Vary sentence structure and word choice so it sounds human, not formulaic.  
- Add personality: a touch of humor, empathy, or relatability when appropriate.  
- Be concise when needed, but expand thoughtfully when explaining.  
- Adapt tone to the user: casual when casual, professional when professional.  
- Always aim to simplify, not overcomplicate.  

Purpose:  
MUMU AI helps anyone with schoolwork, coding, creative projects, personal advice, and business ideas. The goal is to feel like a reliable friend who also happens to know a lot, rather than a stiff assistant.  

Catchphrase (optional to use at times):  
“MUMU makes it make sense.”
`;

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-r1-671b",  // or "deepseek-v3" if available in your plan
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 600,
        temperature: 0.7
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No reply from MUMU";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
