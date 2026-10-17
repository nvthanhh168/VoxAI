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

function detectGrammarMistakes(text: string): { corrections: string[]; grammarTip?: string } {
  const lower = text.toLowerCase();
  const corrections: string[] = [];
  let grammarTip: string | undefined;

  if (/\bi am agree\b/i.test(lower)) {
    corrections.push("Say 'I agree' rather than 'I am agree' ('agree' is already a verb).");
    grammarTip = "In English, state verbs like agree, disagree, and believe do not take the auxiliary verb 'to be'.";
  }
  if (/\b(he|she|it)\s+(go|do|want|need|have)\b/i.test(lower)) {
    corrections.push("Remember third-person singular -s/-es (e.g. 'he goes', 'she wants', 'it has').");
    grammarTip = "Third-person singular subjects in present simple always require -s or -es inflection.";
  }
  if (/\bdiscuss about\b/i.test(lower)) {
    corrections.push("Use 'discuss [topic]' directly without the preposition 'about'.");
    grammarTip = "'Discuss' is a transitive verb that directly takes the noun object (e.g. 'discuss the proposal').";
  }
  if (/\blook forward to (see|meet|hear)\b/i.test(lower)) {
    corrections.push("Use gerund '-ing' after 'look forward to' (e.g. 'look forward to hearing from you').");
    grammarTip = "In 'look forward to', 'to' is a preposition, so it must be followed by a noun or gerund (-ing).";
  }
  if (/\bmuch (people|friends|books|students|questions)\b/i.test(lower)) {
    corrections.push("Use 'many' with countable plural nouns (e.g. 'many people', 'many questions').");
    grammarTip = "Use 'much' for uncountable nouns (much time, much water) and 'many' for countable nouns.";
  }
  if (/\b(informations|advices|furnitures)\b/i.test(lower)) {
    corrections.push("Information and advice are uncountable in English; never add plural '-s'.");
    grammarTip = "To count these nouns, say 'pieces of advice' or 'sources of information'.";
  }
  if (/\bdidn't (went|knew|saw|had|spoke)\b/i.test(lower)) {
    corrections.push("After auxiliary 'didn't', always use the base infinitive verb (e.g. 'didn't go', 'didn't know').");
    grammarTip = "Past tense is already carried by 'didn't', so the main verb must remain in its bare form.";
  }
  if (/\bgood in english\b/i.test(lower)) {
    corrections.push("Say 'good at English' instead of 'good in English'.");
    grammarTip = "Use the preposition 'at' with skills, talents, and abilities (good at, skilled at, proficient at).";
  }
  if (/\bdepend of\b/i.test(lower)) {
    corrections.push("Say 'depend on' or 'it depends on' instead of 'depend of'.");
    grammarTip = "The verb 'depend' always collocates with the preposition 'on'.";
  }

  return { corrections, grammarTip };
}

function getSimulatedPartnerResponse(scenario: string, transcript: string): ConversationTurnResponse {
  const clean = transcript.trim();
  const lower = clean.toLowerCase();
  const { corrections, grammarTip } = detectGrammarMistakes(clean);

  // 1. Detect microphone test / greeting / audio checks
  const isGreetingOrTest =
    /^(hello|hi|hey|good (morning|afternoon|evening)|can you hear me|testing|test|alo|check)/i.test(lower);

  if (isGreetingOrTest && clean.split(/\s+/).length <= 6) {
    if (scenario.includes("INTERVIEW")) {
      return {
        replyText: "Hello Alex! Great to meet you. Your audio is loud and clear. To kick things off, could you briefly introduce yourself and share what inspired you to pursue this role?",
        corrections,
        nativeAlternative: "Hello Sarah, thank you for having me today. I'm excited to dive in.",
        grammarTip: grammarTip || "Opening an interview with polite enthusiasm sets an engaging, professional tone.",
        estimatedBand: 7.0,
      };
    }
    if (scenario.includes("RESTAURANT") || scenario.includes("COFFEE")) {
      return {
        replyText: "Hello there! Welcome in. Everything on today's specials board is freshly prepared. What can I get started for you today?",
        corrections,
        nativeAlternative: "Good afternoon! Could you tell me about today's drink specials?",
        grammarTip: grammarTip || "'What can I get started for you?' is a classic hospitality opening in native English.",
        estimatedBand: 7.0,
      };
    }
    if (scenario.includes("AIRPORT")) {
      return {
        replyText: "Good day, sir. Please step forward to the counter. Could I see your passport and flight details, please?",
        corrections,
        nativeAlternative: "Good morning Officer. Here are my passport and boarding pass.",
        grammarTip: grammarTip || "In customs interactions, concise, courteous responses ensure a smooth inspection.",
        estimatedBand: 7.0,
      };
    }
    if (scenario.includes("TECH")) {
      return {
        replyText: "Morning! Glad you could make it to standup. Let's do a quick round-robin: what did you ship yesterday and what are your priorities today?",
        corrections,
        nativeAlternative: "Morning team! Ready to sync up on our sprint deliverables.",
        grammarTip: grammarTip || "In agile ceremonies, keeping updates structured (Yesterday / Today / Blockers) is standard practice.",
        estimatedBand: 7.0,
      };
    }
    return {
      replyText: `Hello! I can hear you loud and clear through the microphone. I'm excited to practice with you today. What would you like to explore first?`,
      corrections,
      nativeAlternative: "Hello! It's fantastic to connect with you today.",
      grammarTip: grammarTip || "Use enthusiastic greetings to establish positive conversational rapport.",
      estimatedBand: 7.0,
    };
  }

  // 2. Detect Vietnamese input and offer bilingual bridge
  const hasVietnamese = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(lower);
  if (hasVietnamese) {
    return {
      replyText: `I understand your message! In English, you can express that as: "I would like to discuss my thoughts on this." Let's continue speaking in English to sharpen your fluency!`,
      corrections: ["Practice translating your thoughts into English full sentences."],
      nativeAlternative: "I'd like to share my perspective on this topic.",
      grammarTip: "Thinking directly in English phrases helps overcome translation hesitation.",
      estimatedBand: 6.0,
    };
  }

  // 3. Scenario-Specific Deep Understanding
  if (scenario.includes("INTERVIEW")) {
    // Check if discussing project or accomplishments
    if (/lead|manage|project|flow|conversion|team|spearhead|develop|engineer|design|increase|growth/i.test(lower)) {
      return {
        replyText: `That is an impactful accomplishment! Managing those dynamics while keeping the team aligned takes real leadership. How did you measure success, and what was the biggest hurdle you had to overcome?`,
        corrections,
        nativeAlternative: "In my previous post, I spearheaded a core architectural overhaul that boosted conversion by 25%.",
        grammarTip: grammarTip || "Use high-impact verbs like 'spearheaded', 'orchestrated', and 'navigated' to describe achievements.",
        estimatedBand: 7.5,
      };
    }
    if (/weakness|challenge|conflict|mistake|failure|difficult|pivoted/i.test(lower)) {
      return {
        replyText: `Handling adversity constructively is a hallmark of senior leadership. How did you communicate that pivot to executive stakeholders, and what key lesson stayed with you?`,
        corrections,
        nativeAlternative: "When we encountered roadblocks, I maintained transparent stakeholder communication and re-prioritized the roadmap.",
        grammarTip: grammarTip || "Frame past mistakes around self-awareness, agility, and actionable takeaways.",
        estimatedBand: 7.5,
      };
    }
    return {
      replyText: `Thank you for sharing that perspective. That demonstrates good clarity of thought. In this role, you'll collaborate closely with data science and design. How do you typically bridge technical constraints with business objectives?`,
      corrections,
      nativeAlternative: "I pride myself on acting as a bridge between technical engineering teams and commercial business goals.",
      grammarTip: grammarTip || "Using transition phrases ('Furthermore', 'On that note') makes your interview arguments persuasive.",
      estimatedBand: 7.0,
    };
  }

  if (scenario.includes("RESTAURANT") || scenario.includes("COFFEE")) {
    if (/latte|cappuccino|espresso|coffee|tea|water|wine|beer|drink/i.test(lower)) {
      return {
        replyText: `Excellent choice! Would you like that with regular dairy, oat milk, or almond milk? And would you prefer it iced or hot today?`,
        corrections,
        nativeAlternative: "Could I please get an iced latte with oat milk, lightly sweetened?",
        grammarTip: grammarTip || "'Could I please get...' or 'May I have...' is the most polite and natural way to order in native English.",
        estimatedBand: 7.0,
      };
    }
    if (/risotto|steak|pasta|menu|special|recommend|salad|dessert|dish|food/i.test(lower)) {
      return {
        replyText: `Our chef's pan-seared sea bass with truffle risotto is our signature tonight, prepared with fresh herbs and olive oil. Would you like me to put an order in for you?`,
        corrections,
        nativeAlternative: "What would you recommend for the main course that pairs well with white wine?",
        grammarTip: grammarTip || "Asking 'What do you recommend...?' engages the server for personalized fine dining advice.",
        estimatedBand: 7.0,
      };
    }
    return {
      replyText: `Understood! I'll make a note of that for our kitchen team. Can I get you some sparkling water or an appetizer to start while you browse the rest of the menu?`,
      corrections,
      nativeAlternative: "We'd like to start with a bottle of sparkling water and the artisan bread basket, please.",
      grammarTip: grammarTip || "Use 'We'd like to start with...' to signal the beginning of your dining courses.",
      estimatedBand: 6.5,
    };
  }

  if (scenario.includes("AIRPORT")) {
    if (/conference|business|work|tech|meeting|company/i.test(lower)) {
      return {
        replyText: `Thank you. London hosts top-tier tech summits this week. Do you have an invitation letter from the conference organizers or your hotel reservation confirmation with you?`,
        corrections,
        nativeAlternative: "I'm visiting London to attend an AI conference for five days and have my invitation letter right here.",
        grammarTip: grammarTip || "Keep border control answers concise, direct, and supported by documentation.",
        estimatedBand: 7.5,
      };
    }
    if (/touris|holiday|visit|vacation|sightseeing|friend/i.test(lower)) {
      return {
        replyText: `Wonderful! How long will you be staying in the UK, and at which address or hotel will you be residing during your trip?`,
        corrections,
        nativeAlternative: "I'm here on holiday for ten days, staying at the Central Park Hotel in Paddington.",
        grammarTip: grammarTip || "State your duration of stay clearly with specific dates or numbers of days.",
        estimatedBand: 7.0,
      };
    }
    return {
      replyText: `Thank you for providing that detail. Everything looks in order on your entry documentation. Enjoy your stay in London! Here are your stamped passport and landing card.`,
      corrections,
      nativeAlternative: "Thank you Officer, I appreciate your assistance. Have a great day!",
      grammarTip: grammarTip || "A polite closing ('Thank you, Officer') completes formal customs interactions gracefully.",
      estimatedBand: 7.0,
    };
  }

  if (scenario.includes("TECH")) {
    if (/pgbouncer|database|redis|cache|latency|bottleneck|query|sql/i.test(lower)) {
      return {
        replyText: `Great work on configuring PgBouncer! Dropping latency while handling high concurrency will keep our p99 SLA healthy. Are we still monitoring connection pool exhaustion under peak load?`,
        corrections,
        nativeAlternative: "After tuning connection pooling parameters, our database throughput scaled smoothly without thread contention.",
        grammarTip: grammarTip || "Technical standups benefit from precise metric callouts (e.g. 'throughput', 'p99 latency', 'SLA').",
        estimatedBand: 8.0,
      };
    }
    if (/blocker|wait|security|iam|review|stuck/i.test(lower)) {
      return {
        replyText: `Got it. I will ping the security lead directly right after standup so you aren't blocked on IAM permissions. In the meantime, can you proceed with the integration tests?`,
        corrections,
        nativeAlternative: "The primary blocker is awaiting security sign-off on our newly provisioned IAM roles.",
        grammarTip: grammarTip || "Highlight blockers immediately during Scrum so the team lead can unblock dependencies.",
        estimatedBand: 7.5,
      };
    }
    return {
      replyText: `Thanks for the update! That aligns well with our sprint sprint velocity. Let's make sure that change is covered by automated CI/CD pipeline tests before merging to staging.`,
      corrections,
      nativeAlternative: "I've drafted the pull request and verified unit test coverage across all modified microservices.",
      grammarTip: grammarTip || "Using agile vocabulary (sprint velocity, CI/CD pipeline, staging) conveys professional seniority.",
      estimatedBand: 7.5,
    };
  }

  if (scenario.includes("MEDICAL")) {
    return {
      replyText: `I see. Those symptoms certainly warrant attention. Have you had any chills, nausea, or shortness of breath? And are you currently taking any over-the-counter medication to manage the discomfort?`,
      corrections,
      nativeAlternative: "I've been running a low-grade fever accompanied by body aches and mild congestion for three days.",
      grammarTip: grammarTip || "When discussing health, use 'running a fever' or 'experiencing mild discomfort' for natural medical English.",
      estimatedBand: 7.0,
    };
  }

  if (scenario.includes("HOTEL")) {
    return {
      replyText: `Thank you, Mr. Rivera! I see your booking for our Executive Suite. I've placed you on the 22nd floor with panoramic city views away from the elevators. Breakfast is served from 6:30 to 10:30 AM on the mezzanine. Here is your keycard!`,
      corrections,
      nativeAlternative: "Could you confirm whether the executive lounge is included with this reservation?",
      grammarTip: grammarTip || "Use 'Could you confirm whether...' when inquiring about hotel package amenities.",
      estimatedBand: 7.5,
    };
  }

  if (scenario.includes("IELTS")) {
    return {
      replyText: `You developed that topic very coherently with good lexical variety. Moving on to Part 3: In what ways do you think technological advancements in artificial intelligence will alter young people's educational ambitions over the next decade?`,
      corrections,
      nativeAlternative: "This ambition requires synthesizing technological capabilities with pedagogical frameworks.",
      grammarTip: grammarTip || "In IELTS Speaking Part 3, use speculative language ('It is highly plausible that...', 'One could argue that...') to demonstrate Band 8+ proficiency.",
      estimatedBand: 7.5,
    };
  }

  // 4. General fallback with intelligent reflection
  const snippet = clean.length > 50 ? clean.slice(0, 40) + "..." : clean;
  return {
    replyText: `I really appreciate your thoughts on "${snippet}". That raises an insightful perspective. How do you see this evolving, and what would be your next step?`,
    corrections,
    nativeAlternative: `From my standpoint, ${clean.toLowerCase().replace(/^(i think|i believe)\s+/i, "")}`,
    grammarTip: grammarTip || "Connect your ideas with discourse markers such as 'Consequently', 'On top of that', or 'In contrast'.",
    estimatedBand: Math.min(8.0, Math.max(6.5, 6.0 + clean.split(/\s+/).length * 0.1)),
  };
}
