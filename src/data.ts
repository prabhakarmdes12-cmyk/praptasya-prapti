export const COMPLETE_BOOK_ID = "praptasya-prapti-complete";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  readTime: string;
  category: string;
  body: string[];
};

export type PdfCategory = "all" | "book" | "manuscript" | "essay" | "story" | "biography" | "culture";

export type ManuscriptPage = {
  id: string;
  pageNumber: number;
  titleHi: string;
  titleEn: string;
  themeHi: string;
  themeEn: string;
  imagePath: string;
  extractedTextHi: string[];
  summaryHi: string;
  summaryEn: string;
  scriptureReferences?: {
    nameHi: string;
    nameEn: string;
    verse?: string;
  }[];
};

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
  "वसुधैव कुटुम्बकम् कोई आदर्श नहीं, यह मनुष्य होने की न्यूनतम शर्त है। (महोपनिषद् ६.७१)",
  "सत्यमेव जयते नानृतम् — सत्य की ही विजय होती है। (मुण्डकोपनिषद् ३.१.६)",
  "धर्म वह नहीं जो बाँटे; धर्म वह है जो जोड़े।",
  "मुक्त मनुष्य वही है जो भय और लोभ दोनों से परे खड़ा हो सके।",
];

export const philosophyPillars = [
  {
    id: "praptasya",
    sanskrit: "प्राप्तस्य प्राप्ति",
    title: "जो प्राप्त है, उसकी प्राप्ति",
    sourceHi: "ईशावास्योपनिषद् / आदिशंकर वेदान्त भाष्य",
    sourceEn: "Ishopanishad / Adi Shankaracharya Bhashya",
    shlokRef: "ईशावास्योपनिषद् · वेदान्त महावाक्य",
    fullSanskrit: "ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥",
    text: "मनुष्य जीवन-भर मोक्ष, शांति और बुद्धत्व को बाहर खोजता है, जबकि वह मूलतः उसके भीतर पहले से ही प्राप्त है। केवल अज्ञान की मुट्ठी खोलने की आवश्यकता है।",
    color: "saffron",
  },
  {
    id: "vasudhaiva",
    sanskrit: "वसुधैव कुटुम्बकम्",
    title: "सम्पूर्ण पृथ्वी एक परिवार",
    sourceHi: "महोपनिषद् (अध्याय ६, श्लोक ७१)",
    sourceEn: "Maha Upanishad (Chapter 6, Verse 71)",
    shlokRef: "महोपनिषद् ६.७१ · हितोपदेश १.३.७१",
    fullSanskrit: "अयं निजः परो वेति गणना लघुचेतसाम् । उदारचरितानां तु वसुधैव कुटुम्बकम् ॥",
    text: "यह मेरा है, वह पराया है—ऐसी संकीर्ण गणना छोटे मन वालों की होती है। निष्काम कर्म करने वाले उदार चेतना के लिए सम्पूर्ण पृथ्वी ही एक परिवार है।",
    color: "maroon",
  },
  {
    id: "satyameva",
    sanskrit: "सत्यमेव जयते",
    title: "सत्य ही विजयी होता है",
    sourceHi: "मुण्डकोपनिषद् (तृतीय मुण्डक, १.६)",
    sourceEn: "Mundaka Upanishad (3.1.6)",
    shlokRef: "मुण्डकोपनिषद् ३.१.६",
    fullSanskrit: "सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः । येनाक्रमन्त्यृषयो ह्याप्तकामा यत्र तत् सत्यस्य परमं निधानम् ॥",
    text: "सत्य की ही सदा जय होती है, मिथ्या की नहीं। सत्य के ही द्वारा वह मार्ग प्रशस्त होता है जिस पर चलकर निष्काम मानव परम कल्याण को प्राप्त करते हैं।",
    color: "gold",
  },
  {
    id: "mukt",
    sanskrit: "मुक्त मानवों का संसार",
    title: "भय-मुक्त, स्वाभाविक निष्काम जीवन",
    sourceHi: "गोंडी जीवन दर्शन · श्रीमद्भगवद्गीता निष्काम कर्म",
    sourceEn: "Indigenous Gondi Harmony & Gita Nishkam Karma",
    shlokRef: "सहज जीवन शैली · भारत की सनातन मूल धारा",
    fullSanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    text: "एक ऐसा संसार जहाँ मनुष्य भय, लोभ और अंधविश्वास से मुक्त होकर अपने स्वभाव के अनुकूल सहज व निष्काम जीवन जी सके।",
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

export const manuscriptPages: ManuscriptPage[] = [
  {
    id: "manuscript-page-1",
    pageNumber: 1,
    titleHi: "प्राप्तस्य प्राप्ति — महावाक्य एवं वेदान्त का रहस्य",
    titleEn: "Praptasya Prapti — The Mahavakya & Vedantic Mystery",
    themeHi: "ईशावास्योपनिषद्, मुट्ठी में बंद सिक्का एवं निष्काम कर्म",
    themeEn: "Ishopanishad, The Coin in the Fist, and Nishkam Karma",
    imagePath: "/manuscript/manuscript-page-1.jpg",
    extractedTextHi: [
      "प्राप्तस्य प्राप्ति — यह ईशावास्योपनिषद् से लिया गया महावाक्य है। इसकी व्याख्या करते हुए आदिशंकराचार्य ने कहा है कि जिस प्रकार तुम्हारी मुट्ठी में एक सिक्का है और तुम चारों तरफ ढिंढोरा पीट रहे हो कि मेरा सिक्का भूल गया है, तो तुम्हें ढिंढोरा पीटने की आवश्यकता नहीं है, तुम केवल अपनी मुट्ठी खोलो, सिक्का तुम्हारे हाथ में ही है।",
      "ठीक इसी प्रकार जिस मोक्ष, जन्नत, बुद्धत्व, कैवल्य की प्राप्ति हेतु हम ईश्वरों, धर्मों, शास्त्रों, देवताओं का सहारा लेते हैं, उसकी कोई आवश्यकता नहीं है क्योंकि यह पहले से ही प्राप्त था। अब अगर ऐसा प्रतीत होता है कि यह मोक्ष, जन्नत या परम सत्य से हम दूर हो चुके हैं, तो इसकी प्राप्ति के लिये किसी के सहयोग की आवश्यकता नहीं है। गीता, स्मृति तथा उपनिषद् के सहज रास्ते यानी स्वाभाविक कर्म करने मात्र से हम इसे बिना प्रयास के ही प्राप्त कर सकते हैं।",
      "अपने स्वभाव के अनुकूल किया गया कर्म ही निष्काम कर्म कहलाता है, इसके संस्कार नहीं बनते जो बंधन के कारण होते हैं। निष्काम कर्म करने वालों की दुनियाँ से ही 'वसुधैव कुटुम्बकम्' का विचार निकलता है, जिसमें ईश्वर, धर्म, देवता या सद्गुरु पैदा हो ही नहीं सकते। वस्तुतः देवताओं, ईश्वरों, धर्मों की उत्पत्ति सकाम कर्म करने वालों की दुनियाँ में होती है जो वस्तुतः अंधकार की दुनियाँ है, अज्ञान की दुनियाँ है, जिसका सच्चाई से कोई संबंध नहीं रहता है। भ्रान्तियों की दुनियाँ यानी मिथ्या ज्ञान की जमीन पर ही इन मिथ्या ईश्वरों, मिथ्या धर्मों, मिथ्या देवताओं, मिथ्या ज्ञानों की उत्पत्ति होती है। यह भी ध्यान देने की बात है कि निष्काम कर्म करने वालों की दुनियाँ में ये सब मिथ्या प्रपंच पैदा हो ही नहीं सकते।",
      "इस संबंध में रामचरित मानस, श्रीमद्भगवद् गीता, श्रीमद्भागवत पुराण के मार्गदर्शित मेरी कतिपय जीवन राजयात्रा यही कह सकती है।"
    ],
    summaryHi: "मोक्ष व आत्म-स्वरूप पहले से प्राप्त है; केवल अज्ञान की मुट्ठी खोलनी है। निष्काम कर्म ही बंधनरहित जीवन और वसुधैव कुटुम्बकम् का मूल स्रोत है।",
    summaryEn: "Enlightenment is already attained; one only needs to open the fist of ignorance. Pure spontaneous action (Nishkam Karma) dissolves bondage.",
    scriptureReferences: [
      { nameHi: "ईशावास्योपनिषद्", nameEn: "Isha Upanishad", verse: "वेदान्त महावाक्य" },
      { nameHi: "महोपनिषद्", nameEn: "Maha Upanishad", verse: "६.७१ (वसुधैव कुटुम्बकम्)" },
      { nameHi: "श्रीमद्भगवद्गीता", nameEn: "Bhagavad Gita", verse: "अध्याय २ (निष्काम कर्मयोग)" }
    ]
  },
  {
    id: "manuscript-page-2",
    pageNumber: 2,
    titleHi: "सहज जीवन यात्रा एवं गोंडी व सनातन दर्शन",
    titleEn: "Sahaj Jeevan Yatra & Gondi / Sanatan Heritage",
    themeHi: "भारत के मूल निवासियों की जीवन शैली, वसुधैव कुटुम्बकम् एवं विश्वगुरु",
    themeEn: "Indigenous Gondi Way of Life, Universal Harmony & World Teacher India",
    imagePath: "/manuscript/manuscript-page-2.jpg",
    extractedTextHi: [
      "इस सहज जीवन यात्रा को ही, भारत के मूल निवासियों की जीवन शैली, गोंडी जीवन शैली, या ऊँचा आदर्श उच्च विचार की जीवन शैली या सनातन धर्म की आदर्श जीवन शैली भी कहा जाता है।",
      "इस शैली की जीवन यात्रा में सभी कर्म निष्काम होते हैं तथा ईश्वरों, धर्मों, सद्गुरुओं, ब्रह्म विचारों, बुद्धत्व आदि की उत्पत्ति नहीं होती है क्योंकि यह संसार 'वसुधैव कुटुम्बकम्' की आदर्श विचारधारा की उत्पत्ति करता है। इसी विचारधारा या जीवन शैली के बल पर भारत को विश्वगुरु भी कहा जाता है, क्योंकि इस विचारधारा या जीवन धारा की उत्पत्ति भारत में ही हुई है।",
      "यह जीवन शैली मानव जाति को समस्याओं से स्वाभाविक रूप से मुक्त कर देती है, समस्त सुख प्रदान करती है, मृत्यु तथा जन्म से अलग करती है, अपने अविनाशी स्वरूप में स्थिर कर देती है, दिक्-कालातीत अवस्था में ला देती है, ईश्वरों, देवताओं, धर्मों, सद्गुरुओं की औकात बता देती है एवं प्रारब्ध की धार में मिलकर, प्रारब्ध बनकर, शरीर की गति को सम्पूर्ण चेतना की गति में समवेत करते हुए जीवन यात्रा की शुरुआत कर देती है।"
    ],
    summaryHi: "गोंडी व सनातन सहज जीवन शैली में प्रत्येक कर्म निष्काम है। यही विचारधारा भारत को विश्वगुरु बनाती है और मनुष्य को जन्म-मरण से परे अविनाशी स्वरूप में स्थित करती है।",
    summaryEn: "The indigenous Gondi and ancient Sanatan ethos lives naturally in harmony without artificial dogmas, unifying the individual with cosmic consciousness.",
    scriptureReferences: [
      { nameHi: "गोंडी लोक दर्शन", nameEn: "Gondi Philosophy", verse: "प्रकृति सह-अस्तित्व व सहज धारा" },
      { nameHi: "सनातन तत्व विचार", nameEn: "Sanatan Vedantic Stream", verse: "दिक्-कालातीत आत्म-स्वरूप" }
    ]
  },
  {
    id: "manuscript-page-3",
    pageNumber: 3,
    titleHi: "मानव जाति की समस्त समस्याओं का निदान",
    titleEn: "Universal Resolution for Human Society",
    themeHi: "आस्तिकों, नास्तिकों, ब्राह्मणवादियों, अम्बेडकरवादियों एवं सभी विचारकों का समागम",
    themeEn: "Harmonizing Theists, Atheists, Thinkers and Ideologies through Natural Living",
    imagePath: "/manuscript/manuscript-page-3.jpg",
    extractedTextHi: [
      "इस प्रकार इस पुस्तक में, दुनियाँ के समस्त नास्तिकों, समस्त आस्तिकों, ब्राह्मणवादियों, अम्बेडकरवादियों, सभी धर्मावलम्बियों, सभी विचारकों, जो अबतक सफलता हासिल नहीं कर सके हैं, और न भविष्य में दूसरे के जीवन पथ पर चलकर सफलता भी हासिल कर सकते हैं—",
      "उनकी समस्याओं पर गंभीर रूप से विचार करके उनकी या मानव जाति की सभी समस्याओं का निदान सहज जीवन शैली से प्राप्त होने की बात बतायी गयी है।"
    ],
    summaryHi: "ग्रंथ का उद्देश्य किसी वाद या पंथ का खंडन करना नहीं, बल्कि हर विचार के व्यक्ति को उसकी आंतरिक सहज जीवन शैली द्वारा वास्तविक समाधान तक पहुँचाना है।",
    summaryEn: "Addressing the existential queries of all seekers, theists, atheists, and social thinkers through the direct realization of natural, effortless living.",
    scriptureReferences: [
      { nameHi: "मुण्डकोपनिषद्", nameEn: "Mundaka Upanishad", verse: "३.१.६ (सत्यमेव जयते)" }
    ]
  }
];

export const pdfDocuments: PdfDocument[] = [
  {
    id: "praptasya-prapti-complete",
    titleHi: "प्राप्तस्य प्राप्ति: मानव जीवन का मूल संविधान",
    titleEn: "Praptasya Prapti: The Fundamental Constitution of Human Life",
    category: "book",
    categoryHi: "सम्पूर्ण ग्रंथ",
    categoryEn: "Core Book",
    descriptionHi: "मानव जीवन, स्वतंत्रता, विवेक, ज्ञान, कर्म और आत्मा पर अनन्तानन्द मानव (श्री हरनारायण साह) की संपूर्ण ग्रंथ रचना।",
    descriptionEn: "The complete definitive philosophical text exploring human life, freedom, intellect, knowledge, and inner truth.",
    pages: "सम्पूर्ण ग्रंथ",
    fileSize: "7.1 MB",
    filePath: "/pdfs/praptasya-prapti-complete-book.pdf",
    featured: true,
    tagHi: "मूल ग्रंथ",
    tagEn: "Core Book",
  },
  {
    id: "original-manuscripts",
    titleHi: "मूल हस्तलिखित पांडुलिपि (लेखक के मूल हस्तलिखित पृष्ठ)",
    titleEn: "Original Handwritten Manuscript Pages",
    category: "manuscript",
    categoryHi: "मूल पांडुलिपि",
    categoryEn: "Handwritten Scans",
    descriptionHi: "लेखक श्री हरनारायण साह द्वारा स्वयं हस्तलिखित 3 मुख्य पृष्ठ — 'प्राप्तस्य प्राप्ति' का उद्भव, गोंडी-सनातन सहज जीवन शैली और सार्वभौमिक समाधान।",
    descriptionEn: "Original handwritten manuscript leaves penned by Shri Harnarayan Sah detailing the core thesis and philosophy.",
    pages: 3,
    fileSize: "325 KB",
    filePath: "/manuscript/manuscript-page-1.jpg",
    featured: true,
    tagHi: "हस्तलिखित पांडुलिपि",
    tagEn: "Manuscript",
  },
  {
    id: "harnarayan-sah",
    titleHi: "श्री हरनारायण साह: व्यक्तित्व, साधना एवं कृतित्व",
    titleEn: "Shri Harnarayan Sah: Life, Sadhana & Legacy",
    category: "biography",
    categoryHi: "जीवन-दर्शन",
    categoryEn: "Biography & Sadhana",
    descriptionHi: "लेखक एवं साधक श्री हरनारायण साह की 15 पृष्ठीय विस्तृत जीवन-गाथा, साधना, वैचारिक विकास और लोक-कल्याणकारी दृष्टि।",
    descriptionEn: "A 15-page comprehensive biographical record of author and thinker Shri Harnarayan Sah.",
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
    speakerHi: "अनन्तानन्द मानव (श्री हरनारायण साह)",
    speakerEn: "Anantanand Manav (Shri Harnarayan Sah)",
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
    speakerHi: "अनन्तानन्द मानव (श्री हरनारायण साह)",
    speakerEn: "Anantanand Manav (Shri Harnarayan Sah)",
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
