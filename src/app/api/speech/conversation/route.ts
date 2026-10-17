import { NextRequest, NextResponse } from "next/server";
import { generatePartnerResponse, transcribeAudioWithWhisper } from "@/lib/openai";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let scenario = "JOB_INTERVIEW";
    let history: any[] = [];
    let userTranscript = "";
    let userId = "guest-user";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      scenario = (formData.get("scenario") as string) || "JOB_INTERVIEW";
      const historyRaw = formData.get("history") as string;
      if (historyRaw) history = JSON.parse(historyRaw);
      userId = (formData.get("userId") as string) || "guest-user";

      const audioFile = formData.get("audio") as Blob | null;
      const directTranscript = formData.get("transcript") as string;

      if (directTranscript) {
        userTranscript = directTranscript;
      } else if (audioFile) {
        const arrayBuffer = await audioFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        userTranscript = await transcribeAudioWithWhisper(buffer);
      }
    } else {
      const body = await req.json();
      scenario = body.scenario || "JOB_INTERVIEW";
      history = body.history || [];
      userTranscript = body.transcript || "";
      userId = body.userId || "guest-user";
    }

    if (!userTranscript) {
      return NextResponse.json(
        { error: "No user voice or transcript received." },
        { status: 400 }
      );
    }

    // Generate AI Partner Response
    const partnerTurn = await generatePartnerResponse(scenario, history, userTranscript);

    // Save session in DB if user is authenticated
    if (userId && userId !== "guest-user") {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: { increment: 25 },
            learningMinutesTotal: { increment: 3 },
          },
        });
      } catch (err) {
        console.warn("DB session update warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      userTranscript,
      response: partnerTurn,
    });
  } catch (error: any) {
    console.error("Conversation partner API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process conversational turn" },
      { status: 500 }
    );
  }
}
