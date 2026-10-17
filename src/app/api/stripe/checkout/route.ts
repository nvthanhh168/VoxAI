import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, PLANS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { planId, userId, userEmail } = await req.json();

    const selectedPlan = PLANS[planId as keyof typeof PLANS];
    if (!selectedPlan) {
      return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
    }

    const priceId = (selectedPlan as any).stripePriceId || "mock_price";
    const session = await createCheckoutSession(
      userId || "guest-user",
      userEmail || "user@example.com",
      priceId,
      planId
    );

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initiate Stripe checkout" },
      { status: 500 }
    );
  }
}
