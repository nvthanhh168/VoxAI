import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripeSecret = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecret && stripeSecret !== "sk_test_your_stripe_secret_key"
  ? new Stripe(stripeSecret, {
      apiVersion: "2024-11-20.acacia" as any,
      typescript: true,
    })
  : null;

export const PLANS = {
  FREE: {
    id: "FREE",
    name: "Free Starter",
    price: 0,
    priceLabel: "$0 / month",
    features: [
      "5 Pronunciation assessments per day",
      "1 AI conversation roleplay session",
      "Standard CEFR placement test",
      "Community leaderboard access",
    ],
  },
  PREMIUM_MONTHLY: {
    id: "PREMIUM_MONTHLY",
    name: "VoxAI Pro Monthly",
    price: 19.99,
    priceLabel: "$19.99 / month",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || "price_monthly_mock",
    features: [
      "Unlimited Azure Phoneme Pronunciation Scoring",
      "Unlimited AI Voice Partner with Memory (All Personas)",
      "Full Mock IELTS & TOEIC Speaking assessments",
      "SuperMemo SM-2 Spaced Repetition Flashcard Engine",
      "AI Grammar Coach with native idiomatic rewrites",
      "Voice Cloning & Shadowing practice",
      "Detailed Phoneme Heatmap & Exportable Progress Reports",
    ],
  },
  PREMIUM_YEARLY: {
    id: "PREMIUM_YEARLY",
    name: "VoxAI Pro Yearly (Save 40%)",
    price: 143.88,
    priceLabel: "$11.99 / mo (Billed $143.88/yr)",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || "price_yearly_mock",
    features: [
      "Everything in Pro Monthly",
      "2 Months Free (40% Savings)",
      "Priority AI voice latency (<300ms)",
      "1-on-1 AI Masterclass Roadmaps",
      "Offline Audio PWA Mode",
      "Verified Certificate of Spoken English Proficiency",
    ],
  },
  ENTERPRISE_SCHOOL: {
    id: "ENTERPRISE_SCHOOL",
    name: "Enterprise & School Package",
    price: 499,
    priceLabel: "Custom / School cohort",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise_mock",
    features: [
      "Up to 250 Student accounts included",
      "Teacher/Parent monitoring analytics portal",
      "Custom curriculum & classroom assignments",
      "LMS integration (Canvas, Google Classroom)",
      "Dedicated account manager & SLA",
    ],
  },
};

export async function createCheckoutSession(userId: string, userEmail: string, priceId: string, planType: string) {
  const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/subscription?status=success`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/subscription?status=cancelled`;

  if (!stripe) {
    // In dev / preview without live Stripe credentials, simulate subscription upgrade directly in DB
    try {
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          planType: planType as any,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
        create: {
          userId,
          planType: planType as any,
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    } catch (e) {
      console.warn("DB mock subscription update:", e);
    }
    return { url: `${returnUrl}&mock=true` };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: userEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: returnUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planType,
    },
  });

  return { url: session.url };
}
