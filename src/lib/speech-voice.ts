/**
 * Advanced Neural Speech & Expressive Native English Voice Engine
 * Combines server-side studio-quality native MP3 audio with client-side prosody modulation.
 */

let cachedVoice: SpeechSynthesisVoice | null = null;
let currentAudio: HTMLAudioElement | null = null;
let isPlaybackCancelled = false;

export function findBestNaturalVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  // 1. Edge & Windows "Natural" / "Neural" / "Online" voices (e.g. Jenny, Guy, Aria, Christopher)
  const edgeNatural = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Natural") ||
        v.name.includes("Neural") ||
        v.name.includes("Online (Natural)") ||
        v.name.includes("Jenny") ||
        v.name.includes("Guy") ||
        v.name.includes("Aria") ||
        v.name.includes("Christopher") ||
        v.name.includes("Michelle"))
  );
  if (edgeNatural) return edgeNatural;

  // 2. Google US English / Enhanced Neural
  const googleNatural = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      (v.name.includes("Google US English") ||
        v.name.includes("Google") ||
        v.name.includes("Enhanced") ||
        v.name.includes("Premium") ||
        v.name.includes("Samantha") ||
        v.name.includes("Daniel"))
  );
  if (googleNatural) return googleNatural;

  // 3. Any standard en-US native voice
  const usVoice = voices.find((v) => v.lang === "en-US" || v.lang === "en_US");
  if (usVoice) return usVoice;

  // 4. Any English voice
  const anyEnglish = voices.find((v) => v.lang.startsWith("en"));
  return anyEnglish || voices[0] || null;
}

/**
 * Split long text into natural sentence chunks with punctuation preserved
 */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  // Match sentence endings (. ! ?) followed by space or end of string
  const sentences = text
    .replace(/([.?!])\s+/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return sentences.length > 0 ? sentences : [text];
}

export interface PlayVoiceOptions {
  rate?: number;
  pitch?: number;
  voiceGender?: "female" | "male";
  onSentenceStart?: (sentenceIndex: number, sentenceText: string) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

/**
 * Stop any ongoing audio playback (both HTML5 Audio and SpeechSynthesis)
 */
export function stopAllSpeech() {
  isPlaybackCancelled = true;
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.src = "";
    } catch {}
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Primary Native Voice Player:
 * Uses High-Definition Studio Audio from /api/speech/tts for natural human inflection.
 * Automatically falls back to Web Speech synthesis with prosody enhancement.
 */
export async function playNeuralVoice(text: string, options?: PlayVoiceOptions) {
  stopAllSpeech();
  isPlaybackCancelled = false;

  const sentences = splitIntoSentences(text);
  if (sentences.length === 0) {
    options?.onEnd?.();
    return;
  }

  // Play sequentially with natural breathing pauses
  let currentIndex = 0;

  const playNextSentence = async () => {
    if (isPlaybackCancelled) return;

    if (currentIndex >= sentences.length) {
      options?.onEnd?.();
      return;
    }

    const sentence = sentences[currentIndex];
    options?.onSentenceStart?.(currentIndex, sentence);

    const speedParam = options?.rate ? options.rate.toString() : "1.0";
    const voiceParam = options?.voiceGender === "male" ? "en-US-Neural2-D" : "en-US-Neural2-F";
    const ttsUrl = `/api/speech/tts?text=${encodeURIComponent(sentence)}&speed=${speedParam}&voice=${voiceParam}`;

    try {
      const audio = new Audio();
      currentAudio = audio;
      audio.src = ttsUrl;
      audio.playbackRate = options?.rate ?? 1.0;

      audio.onended = () => {
        currentIndex++;
        // Short human breathing pause (250ms) between sentences
        setTimeout(playNextSentence, 250);
      };

      audio.onerror = () => {
        console.warn("Studio audio failed for sentence, falling back to browser synthesis:", sentence);
        // Fallback to local speech synthesis for this chunk
        speakBrowserSentence(sentence, options, () => {
          currentIndex++;
          setTimeout(playNextSentence, 250);
        });
      };

      await audio.play();
    } catch (err) {
      console.warn("Audio play exception, fallback to browser voice:", err);
      speakBrowserSentence(sentence, options, () => {
        currentIndex++;
        setTimeout(playNextSentence, 250);
      });
    }
  };

  playNextSentence();
}

/**
 * Fallback browser sentence speaker with dynamic prosody & pitch contour
 */
function speakBrowserSentence(
  sentence: string,
  options?: PlayVoiceOptions,
  onComplete?: () => void
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onComplete?.();
    return;
  }

  const utt = new SpeechSynthesisUtterance(sentence);
  utt.lang = "en-US";
  utt.rate = options?.rate ?? 0.94;

  // Intonation prosody: Questions have slightly higher rising pitch (1.08), exclamations have punchy pitch (1.05)
  if (sentence.endsWith("?")) {
    utt.pitch = (options?.pitch ?? 1.0) * 1.08;
  } else if (sentence.endsWith("!")) {
    utt.pitch = (options?.pitch ?? 1.0) * 1.05;
  } else {
    utt.pitch = options?.pitch ?? 1.0;
  }

  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = cachedVoice || findBestNaturalVoice(voices);
  if (naturalVoice) {
    cachedVoice = naturalVoice;
    utt.voice = naturalVoice;
  }

  utt.onend = () => {
    onComplete?.();
  };

  utt.onerror = () => {
    onComplete?.();
  };

  window.speechSynthesis.speak(utt);
}

/**
 * Fast one-shot speech for single words or short phrases
 */
export function speakNaturalEnglish(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
) {
  if (typeof window === "undefined") return;

  // For short phrases (<= 15 words), use playNeuralVoice for realistic human pronunciation
  if (text.split(" ").length <= 20) {
    playNeuralVoice(text, {
      rate: options?.rate ?? 0.95,
      pitch: options?.pitch ?? 1.0,
      onEnd: options?.onEnd,
      onError: options?.onError,
    });
    return;
  }

  // Otherwise, use segmented neural player
  playNeuralVoice(text, options);
}
