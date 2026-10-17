"use client";

import React, { useState } from "react";
import { CheckCircle2, Crown, Sparkles, RefreshCw } from "lucide-react";
import { PLANS } from "@/lib/stripe";

export default function SubscriptionPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState(false);

  const handleCheckout = async (planKey: string) => {
    setLoadingPlan(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: planKey,
          userId: "demo-user",
          userEmail: "demo@voxai.com",
        }),
      });

      const data = await res.json();
      if (data.url) {
        if (data.url.includes("mock=true")) {
          setSuccessBanner(true);
        } else {
          window.location.href = data.url;
        }
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Subscriptions & Licensing</span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground">Unlock Unlimited VoxAI Pro</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Gain full access to real-time voice partners, Azure phoneme diagnostics, and IELTS mock speaking tests.
        </p>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold text-sm text-center">
          🎉 Pro Plan successfully activated! Enjoy unlimited AI pronunciation evaluations and speaking coach sessions.
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(PLANS).slice(0, 3).map(([key, plan]) => {
          const isProYearly = key === "PREMIUM_YEARLY";

          return (
            <div
              key={key}
              className={`rounded-3xl border p-6 flex flex-col justify-between space-y-6 ${
                isProYearly
                  ? "bg-card border-primary shadow-xl ring-2 ring-primary"
                  : "bg-card border-border shadow-sm"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg text-foreground">{plan.name}</h3>
                  {isProYearly && <Crown className="h-5 w-5 text-amber-500 fill-amber-500" />}
                </div>

                <div className="text-2xl font-black text-foreground">{plan.priceLabel}</div>

                <ul className="space-y-2.5 text-xs text-muted-foreground pt-2">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleCheckout(key)}
                disabled={loadingPlan === key}
                className={`w-full py-3 rounded-2xl font-extrabold text-xs transition-all ${
                  isProYearly
                    ? "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/25"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                {loadingPlan === key ? (
                  <RefreshCw className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
