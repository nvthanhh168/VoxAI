import { NextRequest, NextResponse } from "next/server";
import { TECH_ARTICLES, NewsArticle, getFormattedDate } from "@/lib/news-data";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const search = searchParams.get("search")?.toLowerCase().trim();
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // Refresh dynamic date relative to current invocation
    let articles: NewsArticle[] = TECH_ARTICLES.map((art, idx) => ({
      ...art,
      publishedDate: getFormattedDate(Math.floor(idx / 3)),
    }));

    if (category && category !== "all" && category !== "Tất cả") {
      articles = articles.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }

    if (level && level !== "all" && level !== "Tất cả") {
      articles = articles.filter((a) => a.cefrLevel.toLowerCase() === level.toLowerCase());
    }

    if (search) {
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.subtitle.toLowerCase().includes(search) ||
          a.category.toLowerCase().includes(search) ||
          a.paragraphs.some((p) => p.toLowerCase().includes(search))
      );
    }

    const total = articles.length;
    const startIndex = (page - 1) * limit;
    const paginatedArticles = articles.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      lastUpdated: new Date().toISOString(),
      data: paginatedArticles,
    });
  } catch (error) {
    console.error("Error fetching daily news:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch daily news articles" },
      { status: 500 }
    );
  }
}
