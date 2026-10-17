import Link from "next/link";
import {
  Mic,
  Sparkles,
  Flame,
  Award,
  ArrowRight,
  CheckCircle2,
  Volume2,
  Bot,
  Brain,
  Shield,
  Layers,
  Crown,
} from "lucide-react";
import { PLANS } from "@/lib/stripe";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-md shadow-blue-500/20">
              <Mic className="h-5 w-5" />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
              VoxAI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-primary text-white font-extrabold text-xs sm:text-sm shadow-md shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              <span>Launch App</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32">
        <div className="container mx-auto px-4 sm:px-6 text-center space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-extrabold text-xs uppercase tracking-wide">
            <Sparkles className="h-3.5 w-3.5" /> Surpassing ELSA Speak with Voice Memory & Azure AI
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
            Speak English Like a <br />
            <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              Native Speaker
            </span>{" "}
            in Record Time.
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The all-in-one AI pronunciation coach, real-time voice speaking partner, and Spaced Repetition engine powered by Microsoft Azure Speech and OpenAI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/practice"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-base shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Mic className="h-5 w-5" />
              <span>Test Your Pronunciation Free</span>
            </Link>

            <Link
              href="/speaking-partner"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-extrabold text-base border transition-all"
            >
              <Bot className="h-5 w-5 text-primary" />
              <span>Meet AI Voice Partner</span>
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Phoneme-Level Accuracy
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Real-time Speech-to-Speech
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Mock IELTS & TOEIC
            </span>
          </div>
        </div>
      </section>

      {/* Feature Comparison: VoxAI vs Traditional ELSA Speak */}
      <section className="py-16 bg-secondary/30 border-y">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-foreground">Why VoxAI Surpasses ELSA Speak</h2>
            <p className="text-sm text-muted-foreground">Built from the ground up with next-generation generative voice intelligence.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse bg-card rounded-3xl overflow-hidden shadow-sm border">
              <thead>
                <tr className="border-b bg-secondary/50">
                  <th className="p-4 font-bold text-muted-foreground">Capability</th>
                  <th className="p-4 font-extrabold text-primary text-base">VoxAI Speak Pro</th>
                  <th className="p-4 font-semibold text-muted-foreground">Traditional Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { feat: "Phoneme-level Heatmap (IPA)", vox: "Instant color-coded diagnostic", trad: "Generic word-only highlight" },
                  { feat: "Conversational Partner Memory", vox: "Persistent across multi-turn sessions", trad: "Single prompt reply" },
                  { feat: "Real-time Spoken Grammar Rewriting", vox: "Side-by-side native idiomatic alternatives", trad: "Not supported" },
                  { feat: "Official Mock Exam Simulation", vox: "Full IELTS Part 1-3 & TOEIC scoring", trad: "Basic short phrases" },
                  { feat: "Vocabulary Memorization Engine", vox: "SuperMemo SM-2 Spaced Repetition", trad: "Simple word list" },
                  { feat: "Teacher / Parent Monitoring Portal", vox: "Included with School & Enterprise", trad: "Consumer only" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-bold text-foreground">{row.feat}</td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                      <span>{row.vox}</span>
                    </td>
                    <td className="p-4 text-muted-foreground">{row.trad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Simple Transparent SaaS Plans</span>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground">Invest in Your Fluency</h2>
            <p className="text-sm text-muted-foreground">Get unlimited pronunciation practice, real-time voice partner, and verified certificates.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.values(PLANS).slice(0, 3).map((plan) => {
              const isPopular = plan.id === "PREMIUM_YEARLY";

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl border p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all ${
                    isPopular
                      ? "bg-card border-primary shadow-xl shadow-primary/10 ring-2 ring-primary scale-102"
                      : "bg-card border-border shadow-sm hover:shadow-md"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md">
                      Best Value • Save 40%
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-foreground">{plan.name}</h3>
                    <div className="text-3xl font-black text-foreground">{plan.priceLabel}</div>

                    <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-muted-foreground">
                      {plan.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/subscription?plan=${plan.id}`}
                    className={`w-full py-3.5 rounded-2xl font-extrabold text-sm text-center transition-all ${
                      isPopular
                        ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/25"
                        : "bg-secondary hover:bg-secondary/80 text-foreground"
                    }`}
                  >
                    Select {plan.name}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/20">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 VoxAI Inc. Built with Next.js 15, Azure Cognitive Speech & OpenAI.</p>
          <div className="flex gap-4">
            <Link href="/practice" className="hover:underline">Practice</Link>
            <Link href="/speaking-partner" className="hover:underline">Voice Partner</Link>
            <Link href="/vocabulary" className="hover:underline">SRS Vocab</Link>
            <Link href="/admin" className="hover:underline">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
