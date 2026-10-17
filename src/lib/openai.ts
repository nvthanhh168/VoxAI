import OpenAI, { toFile } from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = new OpenAI({
  apiKey: apiKey && apiKey !== "sk-proj-your-openai-api-key" ? apiKey : "dummy-key-for-initialization",
});

export interface PartnerMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ConversationTurnResponse {
  replyText: string;
  corrections: string[];
  nativeAlternative: string;
  grammarTip?: string;
  estimatedBand?: number;
}

/**
 * Transcribe recorded voice with OpenAI Whisper API
 */
export async function transcribeAudioWithWhisper(audioBuffer: Buffer, fileName = "recording.wav"): Promise<string> {
  if (!apiKey || apiKey === "sk-proj-your-openai-api-key" || audioBuffer.length === 0) {
    return "";
  }

  try {
    const file = await toFile(audioBuffer, fileName);
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "en",
    });
    return response.text;
  } catch (error) {
    console.warn("Whisper API error:", error);
    return "";
  }
}

/**
 * AI Speaking Partner with Persona Memory & Real-time corrections
 */
export async function generatePartnerResponse(
  scenario: string,
  history: PartnerMessage[],
  userVoiceTranscript: string
): Promise<ConversationTurnResponse> {
  const systemPrompt = `
You are VoxAI, an elite English Speaking Coach and conversation partner.
Current Roleplay Scenario: ${scenario}.
Guidelines:
1. Stay in character naturally and keep the dialogue engaging (2-3 sentences max per turn).
2. Ask follow-up questions to elicit rich responses from the learner.
3. Concurrently analyze the user's transcript for any grammar, preposition, or word choice errors.
4. Output your response strictly in the following JSON format:
{
  "replyText": "your spoken reply in roleplay",
  "corrections": ["any specific grammar/lexical corrections, or empty array if perfect"],
  "nativeAlternative": "more natural, native-like way to rephrase what user said",
  "grammarTip": "concise tip explaining the grammar nuance",
  "estimatedBand": 7.0
}
`;

  if (!apiKey || apiKey === "sk-proj-your-openai-api-key") {
    // High-quality contextual fallback
    return getSimulatedPartnerResponse(scenario, userVoiceTranscript);
  }

  try {
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: "user" as const, content: userVoiceTranscript },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const parsed = JSON.parse(completion.choices[0].message.content || "{}");
    return {
      replyText: parsed.replyText || "That's an interesting point! Could you elaborate more on how that affected your team?",
      corrections: parsed.corrections || [],
      nativeAlternative: parsed.nativeAlternative || "To put it another way, you could say: 'I managed to balance multiple priorities effortlessly.'",
      grammarTip: parsed.grammarTip,
      estimatedBand: parsed.estimatedBand || 7.0,
    };
  } catch (error) {
    console.error("OpenAI Partner error:", error);
    return getSimulatedPartnerResponse(scenario, userVoiceTranscript);
  }
}

/**
 * Grammar Coach: Detailed explanations, rewrites, and alternative idioms
 */
export async function analyzeGrammarAndRewrite(userInput: string) {
  if (!apiKey || apiKey === "sk-proj-your-openai-api-key") {
    return {
      original: userInput,
      corrected: userInput.replace(/(\bi am agree\b)/gi, "I agree").replace(/(\bhe go\b)/gi, "he goes"),
      analysis: [
        {
          issue: "Subject-Verb Agreement / Phrasing",
          explanation: "In English, 'agree' is already a verb, so say 'I agree' rather than 'I am agree'.",
          suggestion: "I completely agree with your perspective.",
        },
      ],
      nativeExpressions: [
        "I'm totally on board with that.",
        "That resonates with me completely.",
        "You took the words right out of my mouth.",
      ],
      cefrLevel: "B1 -> B2",
    };
  }

  const prompt = `
Analyze the following English sentence from a non-native speaker:
"${userInput}"

Provide:
1. A corrected version.
2. List of specific grammatical/vocabulary improvements.
3. 3 natural native-level idioms or casual expressions expressing the same idea.
4. Suggested CEFR transition level.

Return JSON:
{
  "original": "${userInput}",
  "corrected": "string",
  "analysis": [
    { "issue": "string", "explanation": "string", "suggestion": "string" }
  ],
  "nativeExpressions": ["string", "string", "string"],
  "cefrLevel": "string"
}
`;

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    return JSON.parse(res.choices[0].message.content || "{}");
  } catch {
    return {
      original: userInput,
      corrected: userInput,
      analysis: [],
      nativeExpressions: ["That makes a lot of sense.", "Couldn't agree more."],
      cefrLevel: "B2",
    };
  }
}

function getSimulatedPartnerResponse(scenario: string, transcript: string): ConversationTurnResponse {
  if (scenario.includes("INTERVIEW")) {
    return {
      replyText: "That highlights your analytical mindset well. Can you give me a specific example of when a project didn't go as planned and how you pivoted?",
      corrections: ["Ensure subject-verb consistency when describing past projects."],
      nativeAlternative: "Rather than saying 'I do project manager', say: 'I spearheaded cross-functional product initiatives.'",
      grammarTip: "Use active action verbs (spearheaded, delivered, orchestrated) instead of generic verbs in interviews.",
      estimatedBand: 7.0,
    };
  }
  if (scenario.includes("RESTAURANT")) {
    return {
      replyText: "Certainly! Would you like that with regular dairy milk, or would you prefer oat or almond milk?",
      corrections: [],
      nativeAlternative: "Could I have an iced caramel latte with oat milk, please?",
      grammarTip: "'Could I get...' or 'May I have...' sounds much more natural and polite than 'Give me...'.",
      estimatedBand: 6.5,
    };
  }
  return {
    replyText: `I hear you! That's a great observation about ${transcript.slice(0, 20)}... What do you think is the biggest advantage of that approach?`,
    corrections: [],
    nativeAlternative: "From my standpoint, it offers tremendous flexibility.",
    grammarTip: "Use connecting discourse markers ('Furthermore', 'On the flip side') to make your answers cohesive.",
    estimatedBand: 7.0,
  };
}
