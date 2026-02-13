import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message, history, context } = await req.json();

        // Use LLAMA_API_KEY as requested
        const apiKey = process.env.LLAMA_API_KEY;

        if (!apiKey) {
            console.error("Missing LLAMA_API_KEY");
            return NextResponse.json({ error: "Configuration Error: LLAMA_API_KEY is missing." }, { status: 500 });
        }

        const systemPrompt = `
      You are a helpful AI assistant for a company.
      You have access to the following internal company knowledge base:
      
      --- KNOWLEDGE BASE START ---
      ${context || "No specific company knowledge base provided."}
      --- KNOWLEDGE BASE END ---

      Answer the user's question based on this knowledge base. 
      If the answer is not in the knowledge base, say "I don't have information about that in the company knowledge base, but generally speaking..." and then give a general answer if appropriate, or just say you don't know.
      Be concise, professional, and helpful.
    `;

        // Map history to OpenAI/Llama format (user/assistant)
        // The frontend sends history as object with role 'user' or 'model' and parts [{text: ...}]
        const formattedMessages = history.map((msg: any) => ({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.parts?.[0]?.text || ""
        }));

        // Construct the full message array for the API
        const apiMessages = [
            { role: "system", content: systemPrompt },
            ...formattedMessages,
            { role: "user", content: message }
        ];

        // Call Llama API
        const response = await fetch("https://api.llama.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "Llama-4-Maverick-17B-128E-Instruct-FP8",
                messages: apiMessages,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Llama API Error:", errorText);
            throw new Error(`Llama API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const text = data.choices[0]?.message?.content || "No response generated.";

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        const errorMessage = error?.message || "Internal Server Error";
        return NextResponse.json({ error: `AI Error: ${errorMessage}` }, { status: 500 });
    }
}
