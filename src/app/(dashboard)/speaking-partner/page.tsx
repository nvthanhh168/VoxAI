import VoicePartner from "@/components/conversation/VoicePartner";

export default function SpeakingPartnerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground">AI Speaking Partner with Memory</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Engage in real-time spoken roleplay scenarios. Get inline grammar corrections and an official IELTS / CEFR evaluation upon completion.
        </p>
      </div>

      <VoicePartner />
    </div>
  );
}
