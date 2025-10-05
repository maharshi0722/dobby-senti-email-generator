import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { points, tone, name } = await req.json();

    if (!points || points.trim() === "") {
      return NextResponse.json({ error: "Key points are required." }, { status: 400 });
    }

    const payload = {
      model: "accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b",
      messages: [
        {
          role: "system",
          content:
            "You are an AI email generator. Create clear, well-structured emails based on user input. Always format like a real email with greeting, body, and closing."
        },
        {
          role: "user",
          content: `Write a ${tone} email using these points:\n${points}\nInclude the sender's name as '${name || "Your Name"}'.`
        }
      ],
      max_tokens: 400
    };

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer fw_3Ze4FBGeo3zikXy9Yf9anWHK`
    };

    const response = await axios.post(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      payload,
      { headers }
    );

    console.log("Raw API response:", JSON.stringify(response.data, null, 2));

    let content = response.data?.choices?.[0]?.message?.content || "";

  
    return NextResponse.json({ email: content });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.response?.data || error.message || "Unexpected server error" },
      { status: 500 }
    );
  }
}
