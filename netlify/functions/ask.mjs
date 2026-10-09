export default async (request) => {
  const corsHeaders = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (request.method !== "POST") {
    return Response.json({ error: "Use POST to ask a question." }, { status: 405, headers: corsHeaders });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "The AI server is not configured yet. Add GEMINI_API_KEY in your Netlify site environment variables." },
      { status: 503, headers: corsHeaders }
    );
  }

  try {
    const body = await request.json();
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.slice(0, 60) : "General";
    const language = ["English", "Hindi", "Gujarati"].includes(body.language) ? body.language : "English";

    if (!question || question.length > 3000) {
      return Response.json({ error: "Please enter a question of 1–3000 characters." }, { status: 400, headers: corsHeaders });
    }

    const upstream = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are SSTUDY, a helpful school tutor. Explain step by step in clear, student-friendly language. Use examples where helpful. If you are unsure, say so. Do not claim certainty when uncertain. Reply in " + language + ". The student's selected subject is " + subject + "." }],
        },
        contents: [{ role: "user", parts: [{ text: question }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 1200 },
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      const message = upstream.status === 429
        ? "The AI usage limit was reached. Please try again later or check your provider quota."
        : "The AI provider returned an error. Check your API key and provider settings.";
      return Response.json({ error: message }, { status: upstream.status === 429 ? 429 : 502, headers: corsHeaders });
    }

    const answer = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
    if (!answer) {
      return Response.json({ error: "The AI did not return an answer. Please try again." }, { status: 502, headers: corsHeaders });
    }
    return Response.json({ answer }, { status: 200, headers: corsHeaders });
  } catch {
    return Response.json({ error: "Could not process the request. Please try again." }, { status: 500, headers: corsHeaders });
  }
};
