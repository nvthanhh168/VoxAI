import { NextRequest, NextResponse } from "next/server";
import { analyzeGrammarAndRewrite } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const { sentence } = await req.json();

    if (!sentence || sentence.trim().length === 0) {
      return NextResponse.json({ error: "Sentence is required." }, { status: 400 });
    }

    const result = await analyzeGrammarAndRewrite(sentence);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Grammar coach route error:", error);
    return NextResponse.json(
      { error: error?.message || "Grammar analysis failed" },
      { status: 500 }
    );
  }
}
