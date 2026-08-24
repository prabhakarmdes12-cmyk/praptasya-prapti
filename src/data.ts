export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  body: string[];
};

export type PdfCategory = "all" | "book" | "essay" | "story" | "biography" | "culture";

export type PdfDocument = {
  id: string;
  titleHi: string;
  titleEn: string;
  category: PdfCategory;
  categoryHi: string;
  categoryEn: string;
  descriptionHi: string;
  descriptionEn: string;
  pages: number | string;
  fileSize: string;
  filePath: string;
  featured?: boolean;
  publishedYear?: string;
  tagHi?: string;
  tagEn?: string;
};

export type VideoItem = {
  id: string;
  titleHi: string;
  titleEn: string;
  speakerHi: string;
  speakerEn: string;
  duration: string;
  videoUrl: string;
  descriptionHi: string;
  descriptionEn: string;
  badgeHi: string;
  badgeEn: string;
  date?: string;
};

export const quotes: string[] = [
  "जो प्राप्त है, वही तो प्राप्तव्य है — बस दृष्टि खोलनी है।",
  "मनुष्य की सबसे बड़ी स्वतंत्रता है — अपने प्रश्नों के साथ जीने का साहस।",
  "वसुधैव कुटुम्बकम् कोई आदर्श नहीं, यह मनुष्य होने की न्यूनतम शर्त है।",
  "धर्म वह नहीं जो बाँटे; धर्म वह है जो जोड़े।",
  "मुक्त मनुष्य वही है जो भय और लोभ दोनों से परे खड़ा हो सके।",
];

export const philosophyPillars = [
  {
    id: "praptasya",
    sanskrit: "प्राप्तस्य प्राप्ति",
    title: "जो प्राप्त है, उसकी प्राप्ति",
    text: "मनुष्य जीवन-भर उसे खोजता है जो पहले से उसके भीतर विद्यमान है। यह ग्रंथ उसी 'प्राप्त' की ओर लौटने की एक विचार-यात्रा है।",
    color: "saffron",
  },
  {
    id: "vasudhaiva",
    sanskrit: "वसुधैव कुटुम्बकम्",
    title: "सम्पूर्ण पृथ्वी एक परिवार",
    text: "सीमाएँ, जातियाँ और मत मनुष्य के बनाए हैं। मूल में हम एक ही चेतना के भागीदार हैं — यही मानवता का आधार है।",
    color: "maroon",
  },
  {
    id: "mukt",
    sanskrit: "मुक्त मानवों का संसार",
    title: "भय-मुक्त, विचार-स्वतंत्र समाज",
    text: "एक ऐसा संसार जहाँ मनुष्य बिना भय, बिना दबाव, अपने विवेक से सोच और जी सके — यही स्वतंत्र चिंतन का स्वप्न है।",
    color: "gold",
  },
  {
    id: "vichar",
    sanskrit: "धर्म · ईश्वर · गुरु · मानवता",
    title: "मूल प्रश्नों पर विचार",
    text: "धर्म क्या है? ईश्वर की खोज कहाँ ले जाती है? गुरु का अर्थ? इन शाश्वत प्रश्नों पर एक निर्भीक, स्वतंत्र दृष्टि।",
    color: "ink",
  },
];

export const chapters = [
  { num: "१", title: "प्रारंभ — प्रश्न का जन्म", desc: "मनुष्य क्यों पूछता है? जिज्ञासा की जड़ें।" },
  { num: "२", title: "प्राप्तस्य प्राप्ति का अर्थ", desc: "'प्राप्त' और 'प्राप्तव्य' के बीच की दूरी।" },
  { num: "३", title: "धर्म की पुनर्व्याख्या", desc: "संगठित मत से परे धर्म का मूल स्वर।" },
  { num: "४", title: "ईश्वर — खोज या अनुभव", desc: "आस्था, तर्क और अनुभूति के तीन मार्ग।" },
  { num: "५", title: "गुरु और स्वविवेक", desc: "मार्गदर्शन कब मुक्त करता है, कब बाँधता है।" },
  { num: "६", title: "वसुधैव कुटुम्बकम्", desc: "मानव एकता का व्यावहारिक दर्शन।" },
  { num: "७", title: "मुक्त मानव का समाज", desc: "स्वतंत्रता, उत्तरदायित्व और करुणा।" },
  { num: "८", title: "उपसंहार — लौटना अपने भीतर", desc: "यात्रा का अंत, जो एक नया आरंभ है।" },
];

export const articles: Article[] = [
  {
    slug: "praptasya-prapti-ka-arth",
    title: "प्राप्तस्य प्राप्ति का अर्थ",
    excerpt: "जो पहले से हमारे पास है, उसे पाने की यात्रा क्या है? इस विचार की जड़ें और इसका मानव जीवन में स्थान।",
    readTime: "६ मिनट",
    category: "मूल दर्शन",
    body: [
      "मनुष्य का जीवन एक निरंतर खोज है। वह धन खोजता है, यश खोजता है, प्रेम खोजता है, और अंततः शांति खोजता है। किंतु इस समस्त खोज के मूल में एक विचित्र विरोधाभास छिपा है — जिसे वह बाहर खोज रहा है, वह प्रायः पहले से ही उसके भीतर विद्यमान है। यही 'प्राप्तस्य प्राप्ति' का मर्म है — जो प्राप्त है, उसी की प्राप्ति।",
      "संस्कृत की यह अभिव्यक्ति कोई नई नहीं है। परंतु इसका अर्थ हर युग में नये सिरे से खोजना पड़ता है। जब हम कहते हैं कि 'प्राप्त की प्राप्ति', तो हम यह नहीं कह रहे कि प्रयास व्यर्थ है। हम यह कह रहे हैं कि प्रयास की दिशा भीतर की ओर मुड़नी चाहिए।",
      "एक व्यक्ति जीवन भर सुख की खोज में भागता है। वह सोचता है कि अगला पड़ाव, अगली उपलब्धि उसे पूर्ण कर देगी। किंतु प्रत्येक पड़ाव पर पहुँचकर वह पाता है कि क्षितिज और आगे खिसक गया है। यह दौड़ तब तक समाप्त नहीं होती जब तक वह रुककर यह न देखे कि जिस पूर्णता को वह खोज रहा था, वह उसके अपने होने में ही निहित थी।",
      "यह विचार निष्क्रियता का उपदेश नहीं है। यह दृष्टि का परिवर्तन है। जब दृष्टि बदलती है, तो वही संसार, वही जीवन एक नये अर्थ में प्रकट होता है। यही इस ग्रंथ की केंद्रीय यात्रा है।",
      "लेखक के विचार में, यह अनुभूति किसी मत या संप्रदाय की मोहताज नहीं। यह प्रत्येक मनुष्य के लिए सुलभ है — बस उसे रुकने, देखने और पूछने का साहस चाहिए।",
    ],
  },
  {
    slug: "dharm-ki-punarvyakhya",
    title: "धर्म की पुनर्व्याख्या",
    excerpt: "धर्म का मूल स्वर क्या है — जो जोड़ता है या जो बाँटता है? संगठित मत और वैयक्तिक धर्म के बीच का अंतर।",
    readTime: "८ मिनट",
    category: "धर्म-चिंतन",
    body: [
      "'धर्म' शब्द जितना प्राचीन है, उतना ही विवादित भी। आज इसे प्रायः किसी संप्रदाय, किसी उपासना-पद्धति या किसी पहचान से जोड़कर देखा जाता है। किंतु क्या धर्म का यही अर्थ है?",
      "मूल संस्कृत में 'धर्म' का अर्थ है — जो धारण करे, जो टिकाए रखे। इस अर्थ में धर्म कोई विश्वास नहीं, बल्कि जीवन को संतुलन में रखने वाला मूल नियम है। यह करुणा है, यह सत्य है, यह उत्तरदायित्व है।",
      "जब धर्म बाँटने लगे, जब वह मनुष्य को मनुष्य से अलग करने का औज़ार बन जाए, तो समझना चाहिए कि हम धर्म से नहीं, उसकी विकृति से जूझ रहे हैं। लेखक के विचार में, सच्चा धर्म वह है जो दीवारें गिराए, न कि खड़ी करे।",
      "यह पुनर्व्याख्या किसी परंपरा का अनादर नहीं है। यह परंपरा की आत्मा तक लौटने का प्रयास है। हर महान परंपरा के मूल में एक ही स्वर गूँजता है — मनुष्य के प्रति करुणा और सत्य के प्रति निष्ठा।",
      "इसलिए यह ग्रंथ किसी धर्म का खंडन नहीं करता, न किसी की स्थापना करता है। यह केवल एक निमंत्रण है — धर्म को उसके मूल अर्थ में पुनः देखने का।",
    ],
  },
  {
    slug: "vasudhaiva-kutumbakam",
    title: "वसुधैव कुटुम्बकम् — एक व्यावहारिक दर्शन",
    excerpt: "सम्पूर्ण पृथ्वी को एक परिवार मानना केवल आदर्श वाक्य नहीं, यह मनुष्य होने की न्यूनतम शर्त कैसे है।",
    readTime: "७ मिनट",
    category: "मानवता",
    body: [
      "'वसुधैव कुटुम्बकम्' — यह सूत्र सदियों से दोहराया जाता रहा है। किंतु प्रायः इसे एक सुंदर आदर्श मानकर छोड़ दिया जाता है, मानो यह व्यवहार में असंभव हो।",
      "लेखक के विचार में, यह सूत्र आदर्श नहीं, आवश्यकता है। आज जब मनुष्य के पास एक-दूसरे को समूल नष्ट करने की शक्ति है, तब एकता कोई विलासिता नहीं, अस्तित्व की शर्त बन गई है।",
      "परिवार का अर्थ है — जहाँ एक का दुख सबका दुख हो, एक का सुख सबका सुख। यदि पृथ्वी को हम सचमुच परिवार मानें, तो भूख, युद्ध और अन्याय हमारे अपने घर की समस्याएँ बन जाती हैं, किसी दूर देश की नहीं।",
      "यह दर्शन भावुकता नहीं, विवेक की माँग है। सीमाएँ, ध्वज और पहचानें अपनी जगह रहें, किंतु उनके ऊपर एक बड़ा सत्य है — हम सब एक ही चेतना के अंश हैं।",
      "इस ग्रंथ में यह विचार बार-बार लौटता है, क्योंकि यही वह धुरी है जिस पर मुक्त मानवों का संसार खड़ा हो सकता है।",
    ],
  },
  {
    slug: "mukt-manav-ka-samaj",
    title: "मुक्त मानवों का संसार",
    excerpt: "भय और लोभ से परे एक ऐसा समाज जहाँ मनुष्य अपने विवेक से सोच और जी सके — इस स्वप्न का स्वरूप।",
    readTime: "९ मिनट",
    category: "समाज-दर्शन",
    body: [
      "स्वतंत्रता का अर्थ प्रायः बाहरी बंधनों से मुक्ति समझा जाता है। किंतु सबसे गहरे बंधन भीतर के होते हैं — भय, लोभ, और दूसरों की स्वीकृति की चाह।",
      "मुक्त मानव वह है जो इन भीतरी बंधनों को पहचानता है और उनसे ऊपर उठने का साहस रखता है। वह भय से निर्णय नहीं लेता, लोभ से नहीं झुकता, और भीड़ के दबाव में अपना विवेक नहीं खोता।",
      "ऐसे मनुष्यों का समाज कैसा होगा? वह प्रतिस्पर्धा पर नहीं, सहयोग पर टिका होगा। वहाँ मतभेद होंगे, किंतु घृणा नहीं। वहाँ विविधता होगी, किंतु विभाजन नहीं।",
      "लेखक के विचार में, ऐसा समाज कोई काल्पनिक स्वर्ग नहीं। यह एक-एक मुक्त मनुष्य से बनता है। जब एक व्यक्ति भीतर से मुक्त होता है, तो उसके चारों ओर का वातावरण बदलने लगता है।",
      "यही इस विचार-यात्रा का अंतिम गंतव्य है — बाहर के संसार को बदलने से पहले, भीतर के मनुष्य को मुक्त करना।",
    ],
  },
];

export const pdfDocuments: PdfDocument[] = [
  {
    id: "praptasya-prapti-complete",
    titleHi: "प्राप्तस्य प्राप्ति: मानव जीवन का मूल संविधान",
    titleEn: "Praptasya Prapti: The Fundamental Constitution of Human Life",
    category: "book",
    categoryHi: "सम्पूर्ण ग्रंथ",
    categoryEn: "Core Book",
    descriptionHi: "मानव जीवन, स्वतंत्रता, विवेक, ज्ञान, कर्म और आत्मा पर अनन्तानन्द मानव (श्री हरनारायण शाह) की संपूर्ण ग्रंथ रचना।",
    descriptionEn: "The complete definitive philosophical text exploring human life, freedom, intellect, knowledge, and inner truth.",
    pages: "सम्पूर्ण ग्रंथ",
    fileSize: "7.1 MB",
    filePath: "/pdfs/praptasya-prapti-complete-book.pdf",
    featured: true,
    tagHi: "मूल ग्रंथ",
    tagEn: "Core Book",
  },
  {
    id: "harnarayan-sah",
    titleHi: "श्री हरनारायण शाह: व्यक्तित्व, साधना एवं कृतित्व",
    titleEn: "Shri Harnarayan Shah: Life, Sadhana & Legacy",
    category: "biography",
    categoryHi: "जीवन-दर्शन",
    categoryEn: "Biography & Sadhana",
    descriptionHi: "लेखक एवं साधक श्री हरनारायण शाह की 15 पृष्ठीय विस्तृत जीवन-गाथा, साधना, वैचारिक विकास और लोक-कल्याणकारी दृष्टि।",
    descriptionEn: "A 15-page comprehensive biographical record of author and thinker Shri Harnarayan Shah.",
    pages: 15,
    fileSize: "470 KB",
    filePath: "/pdfs/harnarayan-sah.pdf",
    featured: true,
    tagHi: "लेखक जीवन-वृत्त",
    tagEn: "Biography",
  },
  {
    id: "sanskriti-ki-awaz",
    titleHi: "संस्कृति की आवाज़ — जड़ें, परंपरा और मानवता",
    titleEn: "Sanskriti Ki Awaz (Voice of Culture)",
    category: "culture",
    categoryHi: "संस्कृति",
    categoryEn: "Culture & Roots",
    descriptionHi: "लोक संस्कृति, सांस्कृतिक चेतना, प्राकृतिक सह-अस्तित्व और पारंपरिक ज्ञान के मूल सूत्रों पर 10 पृष्ठीय गहन चिंतन।",
    descriptionEn: "A 10-page deep reflection on cultural consciousness, ecological harmony, and living folk wisdom.",
    pages: 10,
    fileSize: "1.1 MB",
    filePath: "/pdfs/sanskriti-ki-awaz.pdf",
    featured: true,
    tagHi: "सांस्कृतिक विमर्श",
    tagEn: "Culture",
  },
  {
    id: "pankhe-ki-rassi",
    titleHi: "पंखे की रस्सी — मनोवैज्ञानिक एवं दार्शनिक आख्यान",
    titleEn: "Pankhe Ki Rassi (The Fan's Rope)",
    category: "story",
    categoryHi: "साहित्य व कथा",
    categoryEn: "Literature & Story",
    descriptionHi: "मानवीय द्वंद्व, मानसिक अवसाद, जीवन-मूल्य और आशा की किरण पर 9 पृष्ठीय मर्मस्पर्शी साहित्यिक विमर्श।",
    descriptionEn: "A 9-page touching psychological narrative exploring human struggle, existential questions, and hope.",
    pages: 9,
    fileSize: "568 KB",
    filePath: "/pdfs/pankhe-ki-rassi.pdf",
    tagHi: "कथा साहित्य",
    tagEn: "Story",
  },
  {
    id: "nana-ka-thana",
    titleHi: "नाना का थाना — संस्मरण व लोक-स्मृति",
    titleEn: "Nana Ka Thana — Memoir & Lived Experience",
    category: "story",
    categoryHi: "संस्मरण व कथा",
    categoryEn: "Memoir & Narrative",
    descriptionHi: "जीवन के जीवंत अनुभवों, लोक-स्मृतियों और सामाजिक यथार्थ का 12 पृष्ठीय सजीव संस्मरणात्मक आख्यान।",
    descriptionEn: "A 12-page vivid autobiographical memoir and narrative reflecting lived experiences and folk memory.",
    pages: 12,
    fileSize: "820 KB",
    filePath: "/pdfs/nana-ka-thana.pdf",
    tagHi: "संस्मरण",
    tagEn: "Memoir",
  },
  {
    id: "lekh-sangrah",
    titleHi: "विचार लेख संग्रह — दर्शन एवं मानवीय चेतना",
    titleEn: "Collected Essays on Philosophy & Life",
    category: "essay",
    categoryHi: "विचार-लेख",
    categoryEn: "Essays & Articles",
    descriptionHi: "दैनिक जीवन के प्रश्नों, आंतरिक स्वाधीनता और समाज की वास्तविकताओं पर लिखे गए प्रासंगिक वैचारिक निबंध।",
    descriptionEn: "Essays addressing core life inquiries, inner freedom, and social consciousness.",
    pages: 4,
    fileSize: "910 KB",
    filePath: "/pdfs/lekh-sangrah.pdf",
    tagHi: "निबंध संग्रह",
    tagEn: "Essays",
  },
  {
    id: "sindoor",
    titleHi: "सिन्दूर — सामाजिक-सांस्कृतिक चिंतन",
    titleEn: "Sindoor — Cultural Realities & Perspectives",
    category: "story",
    categoryHi: "साहित्य",
    categoryEn: "Literature",
    descriptionHi: "भारतीय समाज, पारिवारिक मूल्यों, मान्यताओं और मानवीय संवेदनाओं पर 5 पृष्ठीय विचारोत्तेजक साहित्यिक रचना।",
    descriptionEn: "A 5-page literary discourse on societal norms, family values, and human compassion.",
    pages: 5,
    fileSize: "342 KB",
    filePath: "/pdfs/sindoor.pdf",
    tagHi: "साहित्य",
    tagEn: "Literature",
  },
  {
    id: "book-2022",
    titleHi: "प्राप्तस्य प्राप्ति — संक्षिप्त संस्करण (2022)",
    titleEn: "Praptasya Prapti — Concise Edition (2022)",
    category: "book",
    categoryHi: "संक्षिप्त संस्करण",
    categoryEn: "Manuscript Draft",
    descriptionHi: "ग्रंथ का प्रारंभिक वैचारिक प्रारूप एवं मूल सिद्धांतों का 6 पृष्ठीय संक्षिप्त दिग्दर्शन।",
    descriptionEn: "Early manuscript outline and conceptual summary of core principles (6 pages).",
    pages: 6,
    fileSize: "356 KB",
    filePath: "/pdfs/book-2022.pdf",
    publishedYear: "2022",
    tagHi: "संक्षिप्त रूप",
    tagEn: "Draft",
  },
];

export const videoItems: VideoItem[] = [
  {
    id: "pravachan-1",
    titleHi: "प्राप्तस्य प्राप्ति — लेखक का वैचारिक संदेश एवं ग्रंथ परिचय (भाग १)",
    titleEn: "Praptasya Prapti — Author's Message & Introduction (Part 1)",
    speakerHi: "अनन्तानन्द मानव (श्री हरनारायण शाह)",
    speakerEn: "Anantanand Manav (Shri Harnarayan Shah)",
    duration: "2:51",
    videoUrl: "/videos/pravachan-1.mp4",
    descriptionHi: "जीवन के मूल प्रश्नों, 'प्राप्तस्य प्राप्ति' के मर्म और मनुष्य के आत्म-अन्वेषण पर लेखक का विशेष वीडियो संदेश।",
    descriptionEn: "The author's special video message addressing life's fundamental questions and the essence of Praptasya Prapti.",
    badgeHi: "प्रमुख संदेश",
    badgeEn: "Keynote",
  },
  {
    id: "pravachan-2",
    titleHi: "सत्य, स्वविवेक और मुक्त चेतना पर उद्बोधन (भाग २)",
    titleEn: "Reflections on Truth, Inner Discernment and Free Consciousness (Part 2)",
    speakerHi: "अनन्तानन्द मानव (श्री हरनारायण शाह)",
    speakerEn: "Anantanand Manav (Shri Harnarayan Shah)",
    duration: "1:38",
    videoUrl: "/videos/pravachan-2.mp4",
    descriptionHi: "मानव स्वतंत्रता, मानसिक बंधनों से मुक्ति और भीतरी विवेक को जाग्रत करने पर प्रेरक चिंतन।",
    descriptionEn: "Inspiring discourse on inner freedom, transcending mental limitations, and awakening human discernment.",
    badgeHi: "विचार प्रवाह",
    badgeEn: "Discourse",
  },
];

export const events = [
  {
    date: "आगामी",
    title: "ग्रंथ लोकार्पण — 'प्राप्तस्य प्राप्ति'",
    place: "स्थान की घोषणा शीघ्र",
    type: "पुस्तक लोकार्पण",
    desc: "ग्रंथ के विमोचन एवं लेखक के साथ खुली चर्चा का आयोजन।",
  },
  {
    date: "मासिक",
    title: "सत्संग एवं विचार-गोष्ठी",
    place: "ऑनलाइन एवं स्थानीय केंद्र",
    type: "चर्चा",
    desc: "मूल प्रश्नों पर खुली, निर्भीक और सम्मानपूर्ण संवाद-बैठक।",
  },
  {
    date: "प्रस्तावित",
    title: "कला एवं दर्शन प्रदर्शनी",
    place: "कला-दीर्घा (शीघ्र घोषित)",
    type: "प्रदर्शनी",
    desc: "विचारों से प्रेरित चित्र, सुलेख एवं रेखांकनों की प्रदर्शनी।",
  },
];

export const gallery = [
  { src: "/images/art-1.jpg", title: "एकता", caption: "विचार से प्रेरित चित्र · स्याही एवं रंग" },
  { src: "/images/art-2.jpg", title: "अक्षर-साधना", caption: "देवनागरी सुलेख पोस्टर" },
  { src: "/images/art-3.jpg", title: "वसुधैव कुटुम्बकम्", caption: "संकल्पना रेखांकन · सेपिया स्याही" },
];
