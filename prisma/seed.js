const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial VoxAI data...');

  // Create default achievements
  const achievements = [
    {
      code: 'FIRST_WORDS',
      title: 'First Syllable',
      description: 'Complete your first pronunciation assessment.',
      badgeIcon: 'mic',
      xpReward: 50,
      category: 'PRONUNCIATION',
    },
    {
      code: 'STREAK_7',
      title: 'Consistency Hero',
      description: 'Maintain a 7-day learning streak.',
      badgeIcon: 'flame',
      xpReward: 150,
      category: 'STREAK',
    },
    {
      code: 'PERFECT_PITCH',
      title: 'Native Accent',
      description: 'Score 95% or higher on an advanced sentence.',
      badgeIcon: 'sparkles',
      xpReward: 200,
      category: 'PRONUNCIATION',
    },
    {
      code: 'POLYGLOT_VOCAB',
      title: 'Vocab Master',
      description: 'Review 50 vocabulary flashcards with Spaced Repetition.',
      badgeIcon: 'book-open',
      xpReward: 300,
      category: 'VOCABULARY',
    },
    {
      code: 'IELTS_WARRIOR',
      title: 'IELTS Band 7+ Aspirant',
      description: 'Complete a full Mock IELTS Speaking assessment.',
      badgeIcon: 'award',
      xpReward: 500,
      category: 'EXAM',
    },
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: {},
      create: ach,
    });
  }

  // Seed sample course: Everyday Conversational Fluency
  const course = await prisma.course.upsert({
    where: { slug: 'everyday-conversational-mastery' },
    update: {},
    create: {
      title: 'Everyday Conversational Mastery',
      slug: 'everyday-conversational-mastery',
      description: 'Master everyday spoken English, fluid rhythm, and natural reductions for confident communication.',
      targetLevel: 'B1',
      category: 'DAILY_CONVERSATION',
      thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80',
      orderIndex: 1,
      lessons: {
        create: [
          {
            title: 'Coffee Shop Ordering & Small Talk',
            description: 'Practice natural intonation, polite requests, and vowel stress in social situations.',
            cefrLevel: 'A2',
            estimatedMinutes: 10,
            orderIndex: 1,
            isFreePreview: true,
            exercises: {
              create: [
                {
                  type: 'PRONUNCIATION',
                  promptSentence: "Could I get an iced caramel latte with oat milk, please?",
                  targetIpa: "/kʊd aɪ ɡɛt ən aɪst ˈkærəmɛl ˈlɑːteɪ wɪð oʊt mɪlk pliːz/",
                  translation: "Cho tôi một ly latte caramel đá với sữa yến mạch được không?",
                  tips: "Focus on the soft /d/ in 'could', the clear /t/ in 'latte', and smooth linking between 'get' and 'an'.",
                },
                {
                  type: 'PRONUNCIATION',
                  promptSentence: "I'd like to pay with contactless card if that works.",
                  targetIpa: "/aɪd laɪk tuː peɪ wɪð ˈkɒntækts kɑːrd ɪf ðæt wɜːrks/",
                  translation: "Tôi muốn thanh toán bằng thẻ không tiếp xúc nếu được.",
                  tips: "Contract 'I would' cleanly into /aɪd/ without pausing.",
                },
              ],
            },
          },
          {
            title: 'Professional Job Interview Pitch',
            description: 'Learn executive presence, clear consonants, and persuasive tone.',
            cefrLevel: 'B2',
            estimatedMinutes: 15,
            orderIndex: 2,
            exercises: {
              create: [
                {
                  type: 'PRONUNCIATION',
                  promptSentence: "Throughout my career, I have consistently exceeded performance benchmarks and driven cross-functional collaboration.",
                  targetIpa: "/θruːˈaʊt maɪ kəˈrɪər, aɪ hæv kənˈsɪstəntli ɪkˈsiːdɪd pərˈfɔːrməns ˈbɛntʃmɑːrks/",
                  translation: "Trong suốt sự nghiệp, tôi luôn vượt qua các tiêu chuẩn hiệu suất và thúc đẩy hợp tác liên phòng ban.",
                  tips: "Pronounce the voiceless 'th' /θ/ in 'Throughout' with tongue lightly between teeth.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // Seed sample vocabulary items
  const vocabularies = [
    {
      word: 'articulate',
      ipa: '/ɑːrˈtɪkjələt/',
      partOfSpeech: 'adjective / verb',
      definition: 'Having or showing the ability to speak fluently and coherently.',
      translation: 'Có khả năng ăn nói lưu loát, diễn đạt rõ ràng',
      cefrLevel: 'B2',
      exampleSentence: 'She was praised for her articulate presentation to the board.',
      collocations: ['highly articulate', 'articulate an argument', 'articulate clearly'],
    },
    {
      word: 'flabbergasted',
      ipa: '/ˈflæbərɡæstɪd/',
      partOfSpeech: 'adjective',
      definition: 'Greatly surprised or astonished.',
      translation: 'Kinh ngạc, sửng sốt',
      cefrLevel: 'C1',
      exampleSentence: 'I was completely flabbergasted when they announced the winner.',
      collocations: ['utterly flabbergasted', 'leave someone flabbergasted'],
    },
    {
      word: 'nuance',
      ipa: '/ˈnuːɑːns/',
      partOfSpeech: 'noun',
      definition: 'A subtle distinction or variation in expression, meaning, or response.',
      translation: 'Sắc thái tinh tế',
      cefrLevel: 'B2',
      exampleSentence: 'He understood the delicate nuances of diplomatic negotiations.',
      collocations: ['subtle nuance', 'cultural nuances', 'linguistic nuance'],
    },
    {
      word: 'perseverance',
      ipa: '/ˌpɜːrsəˈvɪrəns/',
      partOfSpeech: 'noun',
      definition: 'Persistence in doing something despite difficulty or delay in achieving success.',
      translation: 'Sự kiên trì, bền bỉ',
      cefrLevel: 'B2',
      exampleSentence: 'Her perseverance through rigorous training paid off with an Olympic medal.',
      collocations: ['sheer perseverance', 'reward for perseverance'],
    },
  ];

  for (const v of vocabularies) {
    await prisma.vocabularyItem.upsert({
      where: { word: v.word },
      update: {},
      create: v,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
