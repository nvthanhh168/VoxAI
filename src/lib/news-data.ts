export interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  category: "AI & Software" | "Quantum & Chips" | "Hardware & Neural" | "Green Infrastructure";
  cefrLevel: "B2" | "C1" | "C2";
  readMinutes: number;
  publishedDate: string;
  author: string;
  coverImage: string;
  paragraphs: string[];
}

export interface WordDefinition {
  word: string;
  ipa: string;
  partOfSpeech: string;
  vietnameseMeaning: string;
  englishDefinition: string;
  collocations: string[];
  exampleInNews: string;
}

export const TECH_DICTIONARY: Record<string, WordDefinition> = {
  autonomous: {
    word: "autonomous",
    ipa: "/ɔːˈtɒnəməs/",
    partOfSpeech: "adjective",
    vietnameseMeaning: "Tự chủ, tự vận hành độc lập không cần can thiệp thủ công",
    englishDefinition: "Acting independently or having the freedom to do so without direct human control.",
    collocations: ["autonomous agents", "autonomous navigation", "autonomous decision-making"],
    exampleInNews: "Autonomous AI agents are capable of planning, executing terminal commands, and verifying code changes.",
  },
  paradigm: {
    word: "paradigm",
    ipa: "/ˈpærədaɪm/",
    partOfSpeech: "noun",
    vietnameseMeaning: "Mô hình, khuôn mẫu, hệ chuẩn tư duy",
    englishDefinition: "A typical example, model, or conceptual framework of something.",
    collocations: ["paradigm shift", "dominant paradigm", "architectural paradigm"],
    exampleInNews: "The emergence of reasoning models marks a profound paradigm shift in automated coding.",
  },
  unprecedented: {
    word: "unprecedented",
    ipa: "/ʌnˈprɛsɪdɛntɪd/",
    partOfSpeech: "adjective",
    vietnameseMeaning: "Chưa từng có tiền lệ, vô tiền khoáng hậu",
    englishDefinition: "Never done or known before in historical records.",
    collocations: ["unprecedented scale", "unprecedented acceleration", "unprecedented accuracy"],
    exampleInNews: "Silicon Valley startups are experiencing unprecedented computational demand.",
  },
  infrastructure: {
    word: "infrastructure",
    ipa: "/ˈɪnfrəˌstrʌktʃər/",
    partOfSpeech: "noun",
    vietnameseMeaning: "Cơ sở hạ tầng, nền tảng kỹ thuật",
    englishDefinition: "The basic physical and organizational structures and facilities needed for the operation of an enterprise.",
    collocations: ["cloud infrastructure", "critical infrastructure", "scalable infrastructure"],
    exampleInNews: "Modern hyperscalers are investing billions into next-generation datacenter infrastructure.",
  },
  proliferation: {
    word: "proliferation",
    ipa: "/prəˌlɪfəˈreɪʃən/",
    partOfSpeech: "noun",
    vietnameseMeaning: "Sự bùng nổ, sự gia tăng nhanh chóng số lượng",
    englishDefinition: "Rapid increase in numbers or a large amount of something.",
    collocations: ["rapid proliferation", "proliferation of models", "proliferation of devices"],
    exampleInNews: "The proliferation of open-source language models has democratized machine intelligence.",
  },
  quantum: {
    word: "quantum",
    ipa: "/ˈkwɒntəm/",
    partOfSpeech: "noun / adjective",
    vietnameseMeaning: "Lượng tử (vật lý lượng tử, điện toán lượng tử)",
    englishDefinition: "Relating to quantum mechanics, the smallest discrete unit of physical property.",
    collocations: ["quantum computing", "quantum supremacy", "quantum entanglement"],
    exampleInNews: "Quantum processors leverage superposition to solve combinatorial problems.",
  },
  qubits: {
    word: "qubits",
    ipa: "/ˈkjuːbɪts/",
    partOfSpeech: "noun",
    vietnameseMeaning: "Bit lượng tử (đơn vị cơ bản của thông tin lượng tử)",
    englishDefinition: "The basic unit of quantum information, analogous to binary bits in classical computers.",
    collocations: ["superconducting qubits", "physical qubits", "logical qubits"],
    exampleInNews: "Researchers successfully chained over 1,000 superconducting qubits with low error rates.",
  },
  decoherence: {
    word: "decoherence",
    ipa: "/ˌdiːkoʊˈhɪərəns/",
    partOfSpeech: "noun",
    vietnameseMeaning: "Hiện tượng mất liên kết lượng tử do nhiễu môi trường",
    englishDefinition: "The loss of quantum coherence causing a system to behave classically due to environmental interference.",
    collocations: ["quantum decoherence", "prevent decoherence", "environmental decoherence"],
    exampleInNews: "Cryogenic refrigeration chambers minimize thermal noise that triggers quantum decoherence.",
  },
  semiconductor: {
    word: "semiconductor",
    ipa: "/ˌsɛmikənˈdʌktər/",
    partOfSpeech: "noun",
    vietnameseMeaning: "Chất bán dẫn, vi mạch bán dẫn",
    englishDefinition: "A solid substance that conducts electricity partially, forming the basis of computer chips.",
    collocations: ["semiconductor industry", "semiconductor foundry", "semiconductor fabrication"],
    exampleInNews: "Advanced semiconductor fabrication plants require extreme ultraviolet photolithography.",
  },
  photolithography: {
    word: "photolithography",
    ipa: "/ˌfoʊtoʊlɪˈθɒɡrəfi/",
    partOfSpeech: "noun",
    vietnameseMeaning: "Kỹ thuật quang khắc (in mạch điện siêu nhỏ lên phiến silicon)",
    englishDefinition: "A microfabrication process used to pattern parts on a thin film or the bulk of a substrate.",
    collocations: ["extreme ultraviolet photolithography", "advanced photolithography"],
    exampleInNews: "EUV photolithography allows manufacturers to print billions of transistors onto a single fingernail-sized die.",
  },
  synergy: {
    word: "synergy",
    ipa: "/ˈsɪnərdʒi/",
    partOfSpeech: "noun",
    vietnameseMeaning: "Sự cộng hưởng, hiệp lực tạo hiệu quả vượt trội",
    englishDefinition: "The interaction or cooperation of two or more organizations or substances to produce a combined effect greater than the sum of separate effects.",
    collocations: ["technological synergy", "create synergy", "synergy between hardware and software"],
    exampleInNews: "The synergy between neural networks and custom silicon accelerators drives unprecedented speedups.",
  },
  ubiquitous: {
    word: "ubiquitous",
    ipa: "/juːˈbɪkwɪtəs/",
    partOfSpeech: "adjective",
    vietnameseMeaning: "Hiện diện khắp mọi nơi, phổ quát",
    englishDefinition: "Present, appearing, or found everywhere.",
    collocations: ["ubiquitous computing", "ubiquitous connectivity", "become ubiquitous"],
    exampleInNews: "High-speed edge connectivity makes ambient artificial intelligence ubiquitous in daily urban life.",
  },
  resilient: {
    word: "resilient",
    ipa: "/rɪˈzɪliənt/",
    partOfSpeech: "adjective",
    vietnameseMeaning: "Kiên cường, có khả năng phục hồi nhanh trước sự cố",
    englishDefinition: "Able to withstand or recover quickly from difficult conditions.",
    collocations: ["resilient systems", "resilient supply chain", "fault-resilient architecture"],
    exampleInNews: "Engineers designed a resilient distributed database capable of tolerating multi-region outages.",
  },
  scalability: {
    word: "scalability",
    ipa: "/ˌskeɪləˈbɪlɪti/",
    partOfSpeech: "noun",
    vietnameseMeaning: "Khả năng mở rộng quy mô hệ thống linh hoạt",
    englishDefinition: "The capacity to be changed in size or scale to handle growing volumes of work.",
    collocations: ["horizontal scalability", "system scalability", "cloud scalability"],
    exampleInNews: "Horizontal scalability ensures the API handles millions of concurrent WebSocket connections.",
  },
  latency: {
    word: "latency",
    ipa: "/ˈleɪtənsi/",
    partOfSpeech: "noun",
    vietnameseMeaning: "Độ trễ truyền tải dữ liệu",
    englishDefinition: "The delay before a transfer of data begins following an instruction for its transfer.",
    collocations: ["ultra-low latency", "network latency", "inference latency"],
    exampleInNews: "Optimizing model weights reduced real-time speech token generation latency to under 150 milliseconds.",
  },
  geothermal: {
    word: "geothermal",
    ipa: "/ˌdʒiːoʊˈθɜːrməl/",
    partOfSpeech: "adjective",
    vietnameseMeaning: "Địa nhiệt (năng lượng từ lòng đất)",
    englishDefinition: "Relating to or produced by the internal heat of the earth.",
    collocations: ["geothermal power", "geothermal energy", "geothermal plant"],
    exampleInNews: "Hyperscalers are constructing next-generation geothermal energy plants to sustain massive datacenter workloads cleanly.",
  },
  smr: {
    word: "SMR",
    ipa: "/ˌɛs ɛm ˈɑːr/",
    partOfSpeech: "abbreviation / noun",
    vietnameseMeaning: "Lò phản ứng hạt nhân module nhỏ (Small Modular Reactor)",
    englishDefinition: "Small Modular Reactors: advanced nuclear reactors with a power capacity up to 300 MW(e) per unit.",
    collocations: ["SMR deployment", "nuclear SMR", "clean SMR energy"],
    exampleInNews: "Tech conglomerates are signing purchase agreements for SMR nuclear installations to guarantee 24/7 carbon-free electricity.",
  },
  meticulous: {
    word: "meticulous",
    ipa: "/məˈtɪkjələs/",
    partOfSpeech: "adjective",
    vietnameseMeaning: "Tỉ mỉ, cẩn thận từng chi tiết nhỏ",
    englishDefinition: "Showing great attention to detail; very careful and precise.",
    collocations: ["meticulous benchmarks", "meticulous inspection", "meticulous calibration"],
    exampleInNews: "Teams conducted meticulous benchmarks across thousands of pull requests before deploying the agent.",
  },
};

export const TECH_ARTICLES: NewsArticle[] = [
  {
    id: "art-1",
    title: "The Dawn of Autonomous AI Agents: From Copilots to Self-Correcting Engineering Squads",
    subtitle: "How multi-agent systems and verified reasoning engines are automating end-to-end software development lifecycles.",
    category: "AI & Software",
    cefrLevel: "B2",
    readMinutes: 4,
    publishedDate: "Today (Daily Updated)",
    author: "Elena Rostova • MIT Tech Review",
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    paragraphs: [
      "The global technology landscape is witnessing an unprecedented paradigm shift as autonomous AI agents evolve from passive code completion assistants into autonomous engineering teammates.",
      "Rather than merely predicting the next token, modern multi-agent architectures operate with dedicated planning, tool invocation, and self-reflection loops. When tasked with solving a bug or implementing a full-stack feature, an agent analyzes the abstract codebase, inspects dependencies, writes test suites, and runs terminal commands in an isolated environment.",
      "Industry benchmarks like SWE-bench demonstrate that these autonomous agents can resolve complex GitHub pull requests with remarkable precision. The proliferation of such systems allows development squads to streamline redundant operational bottlenecks and focus their human ingenuity on high-level architecture and strategic user experience design.",
      "However, software architects emphasize that rigorous safety sandboxing and meticulous human-in-the-loop governance remain indispensable as organizations integrate these autonomous models into critical production pipelines.",
    ],
  },
  {
    id: "art-2",
    title: "Quantum Computing Reaches Crucial Milestone: Error Mitigation Tames Qubit Decoherence",
    subtitle: "Physicists demonstrate fault-tolerant logical qubits that sustain coherent computational states far beyond classical limits.",
    category: "Quantum & Chips",
    cefrLevel: "C1",
    readMinutes: 5,
    publishedDate: "Today (Daily Updated)",
    author: "Dr. Marcus Vance • Quantum Horizons",
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
    paragraphs: [
      "In what leading physicists are describing as a watershed moment for quantum information science, researchers have successfully demonstrated real-time error mitigation across hundreds of physical qubits, suppressing thermal decoherence.",
      "Historically, the Achilles' heel of quantum computers has been environmental interference. Subtle temperature fluctuations or electromagnetic radiation inevitably cause qubits to lose their delicate superposition, introducing fatal computational errors.",
      "By clustering multiple noisy physical qubits into highly resilient 'logical qubits', the new architecture detects and corrects errors on the fly without measuring the quantum state directly. This breakthrough unlocks unprecedented algorithmic depth for simulating complex molecular bonds, catalyst designs, and cryptographic protocols.",
      "The long-term technological synergy between quantum co-processors and distributed cloud datacenters promises to dramatically accelerate pharmaceutical drug discovery and clean battery chemistry over the next decade.",
    ],
  },
  {
    id: "art-3",
    title: "The 2-Nanometer Semiconductor Race: EUV Photolithography Redefines Silicon Scaling",
    subtitle: "Global chip foundries break physical boundaries with Gate-All-Around nanosheets and backside power delivery networks.",
    category: "Quantum & Chips",
    cefrLevel: "C1",
    readMinutes: 4,
    publishedDate: "Today (Daily Updated)",
    author: "Kenji Takahashi • Tokyo Silicon Dispatch",
    coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    paragraphs: [
      "The global semiconductor supply chain is embarking on its most capital-intensive transition to date: the commercial deployment of 2-nanometer Gate-All-Around (GAA) silicon transistors.",
      "As classical FinFET structures approach quantum tunneling limits, chip designers rely on extreme ultraviolet photolithography to etch features measured in mere angstroms. Backside power delivery systems route electrical currents beneath the silicon substrate, drastically diminishing power leakage while boosting clock frequencies.",
      "For mobile devices and ubiquitous edge gadgets, this means thirty percent lower power consumption and instantaneous on-device AI inference. Furthermore, server-grade processors built on this node will provide the compute density required to train trillion-parameter models with lower thermal footprints.",
      "As international foundries invest hundreds of billions into resilient domestic gigafabs, the semiconductor arena remains the undisputed foundation of global technological sovereignty.",
    ],
  },
  {
    id: "art-4",
    title: "Powering the Machine: How Hyperscale AI Datacenters Are Turning to Geothermal and SMR Nuclear",
    subtitle: "Navigating the clean energy bottleneck to guarantee 24/7 carbon-free electricity for generative intelligence clusters.",
    category: "Green Infrastructure",
    cefrLevel: "B2",
    readMinutes: 4,
    publishedDate: "Today (Daily Updated)",
    author: "Rachel Sterling • Green Energy Tech",
    coverImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
    paragraphs: [
      "The meteoric rise of generative AI inference has triggered an unprecedented surge in electricity demand across global datacenters, leading tech giants to pioneer radical clean energy partnerships.",
      "Traditional renewable sources like solar and wind power are intermittent, requiring extensive battery backup to sustain non-stop server workloads. To overcome this limitation, hyperscalers are investing in baseload carbon-free sources, notably enhanced geothermal systems and Small Modular Reactors (SMR).",
      "Next-generation geothermal plants tap into superheated subterranean granite reservoirs miles beneath the earth's crust, producing continuous zero-carbon electricity without relying on weather conditions.",
      "Simultaneously, long-term power purchase agreements for nuclear SMR technology offer factory-assembled, fail-safe reactor units that can be installed directly adjacent to gigawatt AI clusters, ensuring that artificial intelligence scaling aligns harmoniously with planetary sustainability goals.",
    ],
  },
];
