/**
 * Utility for selecting the highest quality natural native English voice
 * available in modern browsers (Edge Natural, Chrome Google US, Safari Enhanced).
 */

let cachedVoice: SpeechSynthesisVoice | null = null;

export function findBestNaturalVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // 1. Highest tier: Edge & Windows "Natural" / "Neural" / "Online" voices (e.g. Jenny, Guy, Aria)
  const edgeNatural = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Natural") ||
        v.name.includes("Neural") ||
        v.name.includes("Online (Natural)") ||
        v.name.includes("Jenny") ||
        v.name.includes("Guy") ||
        v.name.includes("Aria") ||
        v.name.includes("Christopher"))
  );
  if (edgeNatural) return edgeNatural;

  // 2. High tier: Google US English / Enhanced
  const googleNatural = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Google US English") ||
        v.name.includes("Google") ||
        v.name.includes("Enhanced") ||
        v.name.includes("Premium") ||
        v.name.includes("Samantha"))
  );
  if (googleNatural) return googleNatural;

  // 3. Any standard en-US native voice
  const usVoice = voices.find((v) => v.lang === "en-US" || v.lang === "en_US");
  if (usVoice) return usVoice;

  // 4. Any English voice
  const anyEnglish = voices.find((v) => v.lang.startsWith("en"));
  return anyEnglish || voices[0] || null;
}

export function speakNaturalEnglish(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = options?.rate ?? 0.95;
  utterance.pitch = options?.pitch ?? 1.02; // Warm, natural human cadence

  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = cachedVoice || findBestNaturalVoice(voices);
  if (naturalVoice) {
    cachedVoice = naturalVoice;
    utterance.voice = naturalVoice;
  } else {
    // If voices haven't loaded yet, listen once
    window.speechSynthesis.onvoiceschanged = () => {
      const reloaded = window.speechSynthesis.getVoices();
      const best = findBestNaturalVoice(reloaded);
      if (best) cachedVoice = best;
    };
  }

  if (options?.onEnd) utterance.onend = options.onEnd;
  if (options?.onError) utterance.onerror = options.onError;

  window.speechSynthesis.speak(utterance);
}
