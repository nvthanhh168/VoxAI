import { NextRequest, NextResponse } from "next/server";
import { TECH_DICTIONARY } from "@/lib/news-data";

// Fallback dictionary for common English words in news articles
const GENERAL_DICTIONARY: Record<string, { ipa: string; pos: string; vi: string; en: string }> = {
  the: { ipa: "/ðiː/", pos: "article", vi: "cái, người, con (mạo từ xác định)", en: "Denoting one or more people or things already mentioned." },
  global: { ipa: "/ˈɡloʊbəl/", pos: "adjective", vi: "toàn cầu, trên toàn thế giới", en: "Relating to the whole world; worldwide." },
  technology: { ipa: "/tɛkˈnɒlədʒi/", pos: "noun", vi: "công nghệ, kỹ thuật", en: "The application of scientific knowledge for practical purposes." },
  landscape: { ipa: "/ˈlændskeɪp/", pos: "noun", vi: "bối cảnh, bức tranh toàn cảnh", en: "The distinctive features of a sphere of activity." },
  witnessing: { ipa: "/ˈwɪtnəsɪŋ/", pos: "verb", vi: "đang chứng kiến, trải qua", en: "Seeing, experiencing, or being present at an event." },
  agents: { ipa: "/ˈeɪdʒənts/", pos: "noun", vi: "tác tử, đại lý, chương trình AI tự hành", en: "Entities that act or produce an effect, autonomous software programs." },
  evolve: { ipa: "/ɪˈvɒlv/", pos: "verb", vi: "phát triển, tiến hóa, chuyển mình", en: "Develop gradually, especially from a simple to a more complex form." },
  passive: { ipa: "/ˈpæsɪv/", pos: "adjective", vi: "bị động, thụ động", en: "Accepting or allowing what happens without active response." },
  assistants: { ipa: "/əˈsɪstənts/", pos: "noun", vi: "trợ lý, công cụ hỗ trợ", en: "Helpers who assist in a particular task." },
  engineering: { ipa: "/ˌɛndʒɪˈnɪərɪŋ/", pos: "noun", vi: "ngành kỹ thuật, công nghệ kỹ nghệ", en: "The branch of science and technology concerned with building and designing." },
  teammates: { ipa: "/ˈtiːmmeɪts/", pos: "noun", vi: "đồng đội, cộng sự trong nhóm", en: "Fellow members of a team." },
  merely: { ipa: "/ˈmɪərli/", pos: "adverb", vi: "chỉ là, đơn thuần chỉ là", en: "Just; only." },
  predicting: { ipa: "/prɪˈdɪktɪŋ/", pos: "verb", vi: "dự đoán, tiên đoán", en: "Saying or estimating that a specified thing will happen in the future." },
  token: { ipa: "/ˈtoʊkən/", pos: "noun", vi: "token (đơn vị từ/âm vị trong mô hình ngôn ngữ AI)", en: "A basic unit of text processed by language models." },
  modern: { ipa: "/ˈmɒdərn/", pos: "adjective", vi: "hiện đại, tân tiến", en: "Relating to the present or recent times." },
  architectures: { ipa: "/ˈɑːrkɪtɛktʃərz/", pos: "noun", vi: "kiến trúc hệ thống, cấu trúc", en: "Complex or carefully designed structures of software or hardware." },
  dedicated: { ipa: "/ˈdɛdɪkeɪtɪd/", pos: "adjective", vi: "chuyên dụng, tận tâm", en: "Exclusively allocated to a specific purpose." },
  planning: { ipa: "/ˈplænɪŋ/", pos: "noun / verb", vi: "lập kế hoạch, lên chiến lược", en: "The process of making plans for something." },
  execution: { ipa: "/ˌɛksɪˈkjuːʃən/", pos: "noun", vi: "thực thi, thi hành lệnh", en: "The carrying out or putting into effect of a plan, order, or course of action." },
  reflection: { ipa: "/rɪˈflɛkʃən/", pos: "noun", vi: "sự tự suy ngẫm, tự đánh giá sửa lỗi (self-reflection)", en: "Serious thought or consideration; self-evaluation." },
  tasked: { ipa: "/tæskt/", pos: "verb", vi: "được giao nhiệm vụ, phân công", en: "Assigned a task to someone or an agent." },
  solving: { ipa: "/ˈsɒlvɪŋ/", pos: "verb", vi: "giải quyết, xử lý (lỗi, bài toán)", en: "Finding an answer to, explanation for, or means of dealing with a problem." },
  codebase: { ipa: "/ˈkoʊdbeɪs/", pos: "noun", vi: "toàn bộ mã nguồn của dự án", en: "The complete collection of source code for a software system." },
  dependencies: { ipa: "/dɪˈpɛndənsiz/", pos: "noun", vi: "các thư viện phụ thuộc trong phần mềm", en: "External software packages or libraries relied upon." },
  isolated: { ipa: "/ˈaɪsəleɪtɪd/", pos: "adjective", vi: "cô lập, cách ly an toàn", en: "Separated from other persons or things; a secure sandbox." },
  remarkable: { ipa: "/rɪˈmɑːrkəbəl/", pos: "adjective", vi: "đáng chú ý, phi thường, xuất sắc", en: "Worthy of attention; striking." },
  precision: { ipa: "/prɪˈsɪʒən/", pos: "noun", vi: "độ chính xác cao, tỉ mỉ", en: "The quality, condition, or fact of being exact and accurate." },
  streamline: { ipa: "/ˈstriːmlaɪn/", pos: "verb", vi: "tinh gọn hóa, tối ưu hóa quy trình", en: "Make an organization or system more efficient." },
  redundant: { ipa: "/rɪˈdʌndənt/", pos: "adjective", vi: "dư thừa, lặp đi lặp lại không cần thiết", en: "Not or no longer needed or useful; superfluous." },
  bottlenecks: { ipa: "/ˈbɒtəlˌnɛks/", pos: "noun", vi: "nút thắt cổ chai, điểm nghẽn hiệu năng", en: "Points of congestion in a system that slow down performance." },
  ingenuity: { ipa: "/ˌɪndʒəˈnjuːɪti/", pos: "noun", vi: "trí tuệ sáng tạo, sự khéo léo tài tình", en: "The quality of being clever, original, and inventive." },
  strategic: { ipa: "/strəˈtiːdʒɪk/", pos: "adjective", vi: "mang tính chiến lược", en: "Relating to the identification of long-term overall aims." },
  rigorous: { ipa: "/ˈrɪɡərəs/", pos: "adjective", vi: "nghiêm ngặt, khắt khe, chặt chẽ", en: "Extremely thorough, exhaustive, or accurate." },
  sandboxing: { ipa: "/ˈsændˌbɒksɪŋ/", pos: "noun", vi: "cơ chế hộp cát an toàn (cách ly phần mềm)", en: "A security mechanism for separating running programs to prevent unauthorized access." },
  indispensable: { ipa: "/ˌɪndɪˈspɛnsəbəl/", pos: "adjective", vi: "không thể thiếu, thiết yếu", en: "Absolutely necessary; essential." },
  crucial: { ipa: "/ˈkruːʃəl/", pos: "adjective", vi: "cực kỳ quan trọng, then chốt", en: "Decisive or critical, especially in the success or failure of something." },
  milestone: { ipa: "/ˈmaɪlstoʊn/", pos: "noun", vi: "cột mốc quan trọng, bước ngoặt", en: "A significant stage or event in the development of something." },
  superposition: { ipa: "/ˌsuːpərpəˈzɪʃən/", pos: "noun", vi: "trạng thái chồng chập lượng tử", en: "The ability of a quantum system to be in multiple states simultaneously." },
  semiconductor: { ipa: "/ˌsɛmikənˈdʌktər/", pos: "noun", vi: "chất bán dẫn, vi mạch chip", en: "Materials that conduct electricity under certain conditions, powering all modern electronics." },
  geothermal: { ipa: "/ˌdʒiːoʊˈθɜːrməl/", pos: "adjective", vi: "địa nhiệt, năng lượng từ lòng đất", en: "Relating to heat from the internal earth." },
  nuclear: { ipa: "/ˈnjuːkliər/", pos: "adjective", vi: "hạt nhân, nguyên tử", en: "Relating to the nucleus of an atom or nuclear energy." },
  clean: { ipa: "/kliːn/", pos: "adjective", vi: "sạch, thân thiện với môi trường (zero-carbon)", en: "Free from pollutants or carbon emissions." },
};

export async function POST(req: NextRequest) {
  try {
    const { word } = await req.json();
    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    const cleanWord = String(word).toLowerCase().replace(/[^a-z0-9'-]/g, "").trim();

    // 1. Check specialized tech dictionary
    if (TECH_DICTIONARY[cleanWord]) {
      return NextResponse.json({ data: TECH_DICTIONARY[cleanWord] });
    }

    // 2. Check general news dictionary
    if (GENERAL_DICTIONARY[cleanWord]) {
      const entry = GENERAL_DICTIONARY[cleanWord];
      return NextResponse.json({
        data: {
          word: cleanWord,
          ipa: entry.ipa,
          partOfSpeech: entry.pos,
          vietnameseMeaning: entry.vi,
          englishDefinition: entry.en,
          collocations: [`learn ${cleanWord}`, `use ${cleanWord}`],
          exampleInNews: `The term '${cleanWord}' is highlighted in the current article.`,
        },
      });
    }

    // 3. Fallback online translation via MyMemory API
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=en|vi`
      );
      const data = await response.json();
      if (data?.responseData?.translatedText) {
        const viText = data.responseData.translatedText;
        return NextResponse.json({
          data: {
            word: cleanWord,
            ipa: `/${cleanWord}/`,
            partOfSpeech: "từ vựng",
            vietnameseMeaning: viText,
            englishDefinition: `Contextual English word used in the technology news report.`,
            collocations: [`learn ${cleanWord}`, `speak ${cleanWord}`],
            exampleInNews: `This term is highlighted in the current article.`,
          },
        });
      }
    } catch {}

    // 4. Default graceful fallback
    return NextResponse.json({
      data: {
        word: cleanWord,
        ipa: `/${cleanWord}/`,
        partOfSpeech: "từ vựng",
        vietnameseMeaning: `Từ vựng tiếng Anh: "${cleanWord}"`,
        englishDefinition: `Word identified in the article.`,
        collocations: [`practice ${cleanWord}`],
        exampleInNews: `Highlighted in the current text.`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
