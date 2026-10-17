export interface MockCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  targetLevel: string;
  category: string;
  thumbnail: string;
  lessonsCount: number;
  totalMinutes: number;
}

export const MOCK_COURSES: MockCourse[] = [
  {
    id: "course-1",
    title: "Everyday Conversational Mastery",
    slug: "everyday-conversational-mastery",
    description: "Master everyday spoken English, fluid rhythm, and natural reductions for confident communication.",
    targetLevel: "B1",
    category: "DAILY_CONVERSATION",
    thumbnail: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
    lessonsCount: 12,
    totalMinutes: 180,
  },
  {
    id: "course-2",
    title: "IELTS Speaking Band 7.5+ Blueprint",
    slug: "ielts-speaking-band-7-plus",
    description: "Conquer Parts 1, 2, and 3 with advanced lexical resource, idiomatic nuance, and fluent discourse markers.",
    targetLevel: "B2",
    category: "IELTS",
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    lessonsCount: 20,
    totalMinutes: 300,
  },
  {
    id: "course-3",
    title: "Silicon Valley Tech & Executive Pitch",
    slug: "tech-executive-pitch",
    description: "Present complex technical solutions, negotiate with stakeholders, and speak with persuasive executive presence.",
    targetLevel: "C1",
    category: "BUSINESS",
    thumbnail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    lessonsCount: 15,
    totalMinutes: 240,
  },
  {
    id: "course-4",
    title: "TOEIC Speaking High-Score Sprint",
    slug: "toeic-speaking-sprint",
    description: "Timed drills on reading texts aloud, describing pictures, and expressing opinions under pressure.",
    targetLevel: "B1",
    category: "TOEIC",
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
    lessonsCount: 10,
    totalMinutes: 150,
  },
];

export const MOCK_PRONUNCIATION_DRILLS = [
  {
    id: "drill-1",
    sentence: "Could I get an iced caramel latte with oat milk, please?",
    ipa: "/kʊd aɪ ɡɛt ən aɪst ˈkærəmɛl ˈlɑːteɪ wɪð oʊt mɪlk pliːz/",
    meaning: "Cho tôi một ly latte caramel đá với sữa yến mạch được không?",
    level: "A2",
    tips: "Focus on connecting 'get' and 'an' into 'get-an' /ɡɛtən/, and soft 'd' in 'could'.",
  },
  {
    id: "drill-2",
    sentence: "Throughout my career, I have consistently exceeded performance benchmarks.",
    ipa: "/θruːˈaʊt maɪ kəˈrɪər, aɪ hæv kənˈsɪstəntli ɪkˈsiːdɪd pərˈfɔːrməns ˈbɛntʃmɑːrks/",
    meaning: "Trong suốt sự nghiệp, tôi luôn liên tục vượt qua các tiêu chuẩn hiệu suất.",
    level: "B2",
    tips: "Stick tongue slightly between teeth for 'th' in 'Throughout' without vocal cord vibration.",
  },
  {
    id: "drill-3",
    sentence: "The unprecedented technological shifts require nimble organizational restructuring.",
    ipa: "/ðiː ʌnˈprɛsɪdɛntɪd ˌtɛknəˈlɒdʒɪkəl ʃɪfts rɪˈkwaɪər ˈnɪmbəl ˌɔːrɡənaɪˈzeɪʃənəl ˌriːˈstrʌktʃərɪŋ/",
    meaning: "Những chuyển dịch công nghệ chưa từng có đòi hỏi sự tái cấu trúc tổ chức linh hoạt.",
    level: "C1",
    tips: "Deliver 'unprecedented' with primary stress on '-ce-'. Maintain crisp /ʃ/ and /tʃ/ sounds.",
  },
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: "Sarah Jenkins", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", xp: 4820, streak: 34, level: "C1" },
  { rank: 2, name: "Kenji Sato", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", xp: 4210, streak: 28, level: "B2" },
  { rank: 3, name: "Alex Rivera (You)", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100", xp: 3750, streak: 14, level: "B2" },
  { rank: 4, name: "Maria Garcia", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100", xp: 3340, streak: 21, level: "B1" },
  { rank: 5, name: "David Chen", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", xp: 2980, streak: 9, level: "B1" },
];
