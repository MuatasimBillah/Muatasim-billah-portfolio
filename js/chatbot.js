// Enhanced Chatbot.js with multiple languages, voice input, text-to-speech, and dynamic FAQs

// Page Links Database - All service and blog page links
const pageLinks = {
  // Main sections links
  home: "../index.html",
  about: "../index.html#about",
  skills: "../index.html#skills",
  projects: "../index.html#projects",
  services: "../index.html#services",
  testimonials: "../index.html#testimonials",
  contact: "../index.html#contact",
  
  // Specific services sections links
  webDevelopment: "../index.html#services",
  shopify: "../index.html#services",
  audioEngineering: "../index.html#services",
  aiVoiceover: "../index.html#services",
  aiAvatar: "../index.html#services",
  graphicDesign: "../index.html#services",
  
  // Blog pages links
  blog: "../blog/index.html",
  webDevelopmentBlog: "../blog/web-development.html",
  shopifyBlog: "../blog/ecommerce-redesign.html",
  audioEngineeringBlog: "../blog/audio-engineering.html",
  aiVoiceBlog: "../blog/ai-voice.html",
  aiAvatarBlog: "../blog/ai-avatar.html",
  aiAvatarsArticle: "../blog/ai-avatars.html",
  aiVoiceoversArticle: "../blog/ai-voiceovers.html",
  graphicDesignBlog: "../blog/graphic-design.html",
  ecommerceTrendsBlog: "../blog/ecommerce-trends.html",
  improveShopifyBlog: "../blog/improve-shopify-store.html",
  ecommerceAnalyticsBlog: "../blog/ecommerce-analytics.html",
  productPhotographyBlog: "../blog/product-photography.html",
  manageStoreBlog: "../blog/Mange-Store.html"
};

// Supported languages configuration
const supportedLanguages = {
  english: {
    code: 'en-US',
    name: 'English',
    flag: '🇺🇸'
  },
  urdu: {
    code: 'ur',
    name: 'Urdu',
    flag: '🇵🇰'
  },
  hindi: {
    code: 'hi',
    name: 'Hindi', 
    flag: '🇮🇳'
  },
  arabic: {
    code: 'ar',
    name: 'Arabic',
    flag: '🇦🇪'
  },
  spanish: {
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸'
  }
};

// Knowledge Base for the chatbot
const knowledgeBase = {
  services: [
    "Motasim offers several professional services including:",
    "• Frontend Web Development with HTML, CSS, and JavaScript",
    "• Custom Shopify Store Design",
    "• Professional Audio Engineering",
    "• AI Voiceover Creation",
    "• AI Avatar Creation",
    "• Canva Design and Graphics"
  ],
  skills: [
    "Motasim core skills include:",
    "• Web Development (HTML, CSS, JavaScript)",
    "• E-commerce (Shopify)",
    "• Audio Engineering & Production",
    "• AI Voice Technology",
    "• AI Avatar Creation",
    "• Graphic Design & Canva"
  ],
  projects: [
    "Some notable projects include:",
    "• Frontend Web Development (responsive websites with animations)",
    "• E-commerce Redesign (custom Shopify stores)",
    "• Audio Engineering (music, podcasts, sound design)",
    "• AI Voice Creation (commercials, explainers)",
    "• AI Avatar Creation (talking avatars for videos)",
    "• Graphic Design (social media, branding)"
  ],
  contact: [
    "You can contact Mehar through:",
    "• Email: Meharmahalcoll@gmail.com",
    "• Phone number: 03088754565",
    "• Also in social links that include in website)"
  ],
  webDevelopment: [
    "Motasim specializes in frontend web development using HTML, CSS, and JavaScript, creating responsive websites with modern designs and smooth animations.",
    "His projects feature:",
    "• Responsive web design that adapts to all screen sizes",
    "• Interactive UI/UX with GSAP animations",
    "• Performance optimization for fast loading",
    "• Modern CSS techniques including Grid and Flexbox"
  ],
  shopify: [
    "Motasim billah is an expert in custom Shopify store design, providing high-converting e-commerce solutions with:",
    "• Distinctive branding and visual aesthetics",
    "• Intuitive navigation and user experience",
    "• Optimized conversion funnels",
    "• Custom product pages and collections",
    "• Mobile-first responsive design"
  ],
  audioEngineering: [
    "Motasim billah provides professional audio engineering services including:",
    "• Music production and mixing",
    "• Podcast editing and enhancement",
    "• Sound design for videos",
    "• Audio post-production",
    "• Voice processing and cleanup"
  ],
  aiVoiceover: [
    "Motasim billah offers AI voiceover services using cutting-edge neural voice technology to create ultra-realistic voiceovers for:",
    "• Commercial advertisements",
    "• Explainer videos",
    "• E-learning content",
    "• IVR systems",
    "• Audiobooks and narration",
    "These sound virtually indistinguishable from human recordings."
  ],
  aiAvatar: [
    "Motasim billah creates lifelike AI talking avatars for:",
    "• Business presentations",
    "• Marketing videos",
    "• Educational content",
    "• Virtual spokespeople",
    "• Social media content",
    "These AI avatars provide engaging visual representation with synchronized lip movements and natural expressions."
  ],
  graphicDesign: [
    "Motasim billah offers professional Canva design services for:",
    "• Social media posts and stories",
    "• Brand identity packages",
    "• Marketing materials",
    "• Presentations and pitch decks",
    "• Print materials and digital products",
    "His designs help businesses establish a consistent and professional visual identity that resonates with their target audience."
  ],
  
  // Conversational responses
  greetings: [
    "Hello! How can I help you with Motasim billah portfolio today?",
    "Hi there! I'm Motasim portfolio assistant. What would you like to know?",
    "Welcome! How can I assist you with information about Motasim billah services?",
    "Greetings! I'd be happy to tell you about Motasim billah work. What are you interested in?"
  ],
  howAreYou: [
    "I'm doing great, thanks for asking! How can I help you learn about Motasim billah services today?",
    "I'm excellent! Ready to assist you with information about Motasim billah portfolio. What would you like to know?",
    "I'm functioning perfectly! What information about Motasim billah work are you looking for?"
  ],
  thanks: [
    "You're welcome! Is there anything else you'd like to know about Motasim billah services?",
    "My pleasure! Let me know if you need any other information about Motasim billah work.",
    "Happy to help! Feel free to ask if you have more questions about Motasim billah portfolio."
  ],
  goodbye: [
    "Goodbye! Feel free to return if you have more questions about Motasim billah services.",
    "Take care! If you need more information about Motasim billah work in the future, I'll be here.",
    "Farewell! Don't hesitate to reach out again if you need details about Motasim billah portfolio."
  ],
  about: [
    "Mehar is a skilled professional specializing in web development, e-commerce design, audio engineering, AI voice technology, and graphic design.",
    "With years of experience, Mehar has helped numerous clients achieve their digital goals through creative solutions and technical expertise.",
    "His portfolio showcases a diverse range of projects that highlight his versatility and commitment to quality."
  ]
};

// Multilingual responses 
const languageResponses = {
  // Urdu responses
  urdu: {
    services: [
      "Motasim in services provide karte hain:",
      "• Web Development aur responsive websites",
      "• Custom Shopify Store Design",
      "• Professional Audio Engineering",
      "• AI Voice aur Voiceover creation",
      "• AI Avatar banane ki service",
      "• Graphic Design aur Canva design services"
    ],
    webDevelopment: [
      "Motasim modern web development ke expert hain aur responsive websites banate hain jo har device par perfect nazar aati hain.",
      "• Mobile friendly websites",
      "• Interactive animations aur smooth transitions",
      "• Fast loading pages",
      "• Modern design elements"
    ],
    shopify: [
      "Motasim custom Shopify stores banate hain jo sales badhaane mein madad karte hain:",
      "• Professional aur unique design",
      "• Easy navigation aur user experience",
      "• Mobile-friendly shopping",
      "• Custom product pages jo conversion improve karte hain"
    ],
    audioEngineering: [
      "Audio engineering mein Motasim ye services provide karte hain:",
      "• Professional mixing aur mastering",
      "• Podcast editing aur enhancement",
      "• Voice processing aur cleanup",
      "• Background music aur sound effects"
    ],
    aiVoiceover: [
      "AI voiceover services mein ye shamil hain:",
      "• Natural sounding AI voices",
      "• Multiple languages mein voiceovers",
      "• Commercial aur explainer videos ke liye perfect voices",
      "• Quick turnaround time with professional quality"
    ],
    aiAvatar: [
      "AI avatars jo bilkul real humans ki tarah dikhte aur bolte hain:",
      "• Virtual presenters for business videos",
      "• Multiple languages support",
      "• Professional appearance aur expressions",
      "• Custom avatars according to requirements"
    ],
    graphicDesign: [
      "Graphic design services mein ye shamil hain:",
      "• Social media posts aur stories",
      "• Brand identity packages",
      "• Marketing materials jo conversions badhate hain",
      "• Professional presentations aur business materials"
    ],
    greetings: [
      "Assalam-o-Alaikum! Motasim Billah ki portfolio ke baray mein kya janna chahtay hain?",
      "Hello! Mein Motasim ka virtual assistant hoon. Aap ko kya information chahiye?",
      "Kya haal hain? Motasim ki services ke baray mein kya poochna chahte hain?"
    ],
    howAreYou: [
      "Mein bilkul theek hoon, shukriya poochnay ka! Motasim ki services ke baray mein kya janna chahte hain?",
      "Alhamdulillah, bohot acha! Aap ko kaunsi service ke baare mein bataun?"
    ],
    thanks: [
      "Khushi hui madad kar ke! Kya aap kuch aur janna chahte hain?",
      "Koi baat nahi! Agar koi aur sawal ho to zaroor poochein."
    ],
    goodbye: [
      "Allah Hafiz! Dubara tashreef layen agar koi sawal ho.",
      "Khuda Hafiz! Baad mein kabhi bhi contact kar sakte hain."
    ],
    about: [
      "Motasim Billah ek professional web developer, audio engineer, aur AI voice/avatar creator hain. Unke paas in services mein kaafi experience hai aur unhone kai clients ko high-quality solutions provide kiye hain."
    ],
    pricing: [
      "Pricing project ki complexity aur requirements par depend karti hai. Exact quote ke liye Motasim se directly contact karen.",
      "Contact information: Email: Meharmahalcoll@gmail.com, Phone: 03088754565"
    ],
    process: [
      "Motasim ka kaam karne ka process simple hai:",
      "1. Requirements gathering aur consultation",
      "2. Strategy aur planning",
      "3. Design mockups aur approval",
      "4. Development aur implementation",
      "5. Testing aur refinement",
      "6. Delivery aur support"
    ],
    contact: [
      "Aap Motasim se is tarah contact kar sakte hain:",
      "• Email: Meharmahalcoll@gmail.com",
      "• Phone number: 03088754565",
      "• Website ke social links bhi use kar sakte hain"
    ],
    skills: [
      "Motasim Billah ki main skills hain:",
      "• Web Development (HTML, CSS, JavaScript)",
      "• E-commerce (Shopify)",
      "• Audio Engineering",
      "• AI Voice Technology",
      "• AI Avatar Creation",
      "• Graphic Design"
    ],
    projects: [
      "Motasim Billah ne ye projects kiye hain:",
      "• Web Development (responsive websites)",
      "• E-commerce aur Shopify stores",
      "• Audio Engineering (music, podcasts)",
      "• AI Voice Creation",
      "• AI Avatar Creation",
      "• Graphic Design"
    ]
  },
  
  // Hindi responses
  hindi: {
    services: [
      "Motasim ye services provide karte hain:",
      "• Web Development aur responsive websites",
      "• Custom Shopify Store Design",
      "• Professional Audio Engineering",
      "• AI Voice aur Voiceover creation",
      "• AI Avatar banane ki service",
      "• Graphic Design aur Canva design services"
    ],
    greetings: [
      "Namaste! Motasim Billah ke portfolio ke baare mein kya jaanna chahte hain?",
      "Namaskaar! Main Motasim ka virtual assistant hoon. Aapko kya jaankari chahiye?"
    ],
    howAreYou: [
      "Main bilkul theek hoon, dhanyavaad poochne ke liye! Motasim ki services ke baare mein kya jaanna chahte hain?",
      "Bahut badhiya! Aapko kaunsi service ke baare mein bataun?"
    ],
    thanks: [
      "Khushi hui madad karke! Kya aap kuch aur jaanna chahte hain?",
      "Koi baat nahi! Agar koi aur sawal ho to zaroor poochein."
    ],
    goodbye: [
      "Namaste! Dobara aayein agar koi sawal ho.",
      "Alvida! Baad mein kabhi bhi contact kar sakte hain."
    ],
    contact: [
      "Aap Motasim se is prakar contact kar sakte hain:",
      "• Email: Meharmahalcoll@gmail.com",
      "• Phone number: 03088754565",
      "• Website ke social links bhi use kar sakte hain"
    ]
  },
  
  // Arabic responses
  arabic: {
    greetings: [
      "مرحبًا! كيف يمكنني مساعدتك بخصوص معلومات معتصم بالله اليوم؟",
      "أهلاً! أنا مساعد معتصم الافتراضي. ما الذي ترغب في معرفته؟"
    ],
    howAreYou: [
      "أنا بخير، شكرًا للسؤال! كيف يمكنني مساعدتك بخصوص خدمات معتصم؟",
      "ممتاز! أي خدمة ترغب في معرفة المزيد عنها؟"
    ],
    thanks: [
      "على الرحب والسعة! هل هناك شيء آخر ترغب في معرفته؟",
      "سعدت بمساعدتك! لا تتردد في طرح أي أسئلة أخرى."
    ],
    goodbye: [
      "مع السلامة! لا تتردد في العودة إذا كان لديك المزيد من الأسئلة.",
      "إلى اللقاء! يمكنك التواصل في أي وقت إذا احتجت مساعدة."
    ],
    contact: [
      "يمكنك التواصل مع معتصم من خلال:",
      "• البريد الإلكتروني: Meharmahalcoll@gmail.com",
      "• رقم الهاتف: 03088754565",
      "• يمكنك أيضًا استخدام روابط التواصل الاجتماعي في الموقع"
    ],
    services: [
      "يقدم معتصم العديد من الخدمات المهنية بما في ذلك:",
      "• تطوير الواجهة الأمامية باستخدام HTML و CSS و JavaScript",
      "• تصميم متاجر Shopify المخصصة",
      "• هندسة الصوت الاحترافية",
      "• إنشاء الأصوات الاصطناعية بالذكاء الاصطناعي",
      "• إنشاء الشخصيات الافتراضية بالذكاء الاصطناعي",
      "• تصميم الجرافيك باستخدام Canva"
    ]
  },
  
  // Spanish responses
  spanish: {
    greetings: [
      "¡Hola! ¿Cómo puedo ayudarte con la información de Motasim hoy?",
      "¡Saludos! Soy el asistente virtual de Motasim. ¿Qué te gustaría saber?"
    ],
    howAreYou: [
      "¡Estoy muy bien, gracias por preguntar! ¿Cómo puedo ayudarte con los servicios de Motasim?",
      "¡Excelente! ¿Sobre qué servicio te gustaría saber más?"
    ],
    thanks: [
      "¡De nada! ¿Hay algo más que te gustaría saber?",
      "¡Un placer ayudarte! No dudes en preguntar si tienes más dudas."
    ],
    goodbye: [
      "¡Adiós! No dudes en volver si tienes más preguntas.",
      "¡Hasta luego! Puedes contactar en cualquier momento si necesitas ayuda."
    ],
    contact: [
      "Puedes contactar a Motasim a través de:",
      "• Email: Meharmahalcoll@gmail.com",
      "• Número de teléfono: 03088754565",
      "• También puedes usar los enlaces de redes sociales en el sitio web"
    ],
    services: [
      "Motasim ofrece varios servicios profesionales que incluyen:",
      "• Desarrollo web frontend con HTML, CSS y JavaScript",
      "• Diseño personalizado de tiendas Shopify",
      "• Ingeniería de audio profesional",
      "• Creación de voces con IA",
      "• Creación de avatares con IA",
      "• Diseño gráfico con Canva"
    ]
  }
};

// Dynamically generated FAQs based on popular topics and queries
const dynamicFAQs = {
  // Web Development FAQs
  webDevelopment: [
    {
      question: "What technologies do you use for web development?",
      answer: "I specialize in frontend development using HTML5, CSS3 (including Flexbox and Grid), and JavaScript. I also work with libraries like GSAP for animations and responsive frameworks to ensure cross-device compatibility."
    },
    {
      question: "Do you create responsive websites?",
      answer: "Yes, all websites I develop are fully responsive and optimized for desktop, tablet, and mobile devices. I use a mobile-first approach to ensure excellent user experience across all screen sizes."
    },
    {
      question: "How long does it take to build a website?",
      answer: "The timeline depends on the project complexity. A simple portfolio site might take 1-2 weeks, while more complex projects with custom functionality can take 4-8 weeks. I'll provide a detailed timeline after understanding your specific requirements."
    },
    {
      question: "Do you handle website hosting and domain registration?",
      answer: "Yes, I can assist with hosting setup and domain registration. I'll recommend reliable hosting providers that match your project's needs and help set up everything for a smooth launch."
    }
  ],
  
  // Shopify FAQs
  shopify: [
    {
      question: "Can you customize existing Shopify themes?",
      answer: "Absolutely! I specialize in customizing Shopify themes to match your brand identity and business needs. From minor tweaks to major overhauls, I can transform any theme into a unique storefront."
    },
    {
      question: "How can you improve my Shopify store's conversion rate?",
      answer: "I implement conversion-focused design principles including optimized product pages, streamlined checkout processes, trust elements, mobile optimization, and strategic call-to-action placement. I also ensure fast loading times which significantly impacts conversion rates."
    },
    {
      question: "Do you set up Shopify apps and integrations?",
      answer: "Yes, I can recommend and install essential Shopify apps for your specific business needs, such as email marketing, SEO, inventory management, and analytics tools. I ensure all integrations work seamlessly together."
    },
    {
      question: "Can you migrate my existing e-commerce store to Shopify?",
      answer: "Yes, I offer migration services from other platforms (like WooCommerce, Magento, or BigCommerce) to Shopify. I handle product data, customer information, and order history transfers to ensure a smooth transition without losing valuable data."
    }
  ],
  
  // Audio Engineering FAQs
  audioEngineering: [
    {
      question: "What audio engineering services do you offer?",
      answer: "I provide comprehensive audio services including mixing, mastering, podcast editing, voice cleanup, sound design, background music creation, and audio restoration. Each service is tailored to your specific project requirements."
    },
    {
      question: "What's your process for podcast editing?",
      answer: "My podcast editing process includes cleaning up background noise, removing filler words and long pauses, balancing levels between speakers, enhancing vocal clarity, adding intro/outro music, and delivering in the appropriate format for distribution platforms."
    },
    {
      question: "Can you improve poor quality audio recordings?",
      answer: "Yes, I specialize in audio restoration and enhancement. I can reduce background noise, fix clipping issues, improve clarity, enhance frequency balance, and generally make poor recordings more professional and listenable."
    },
    {
      question: "What file formats do you work with and deliver?",
      answer: "I work with all standard audio formats including WAV, MP3, FLAC, AIFF, and OGG. Final deliverables can be provided in any required format, with specifications tailored to your intended platform or use case."
    }
  ],
  
  // AI Voiceover FAQs
  aiVoiceover: [
    {
      question: "How realistic are your AI voiceovers?",
      answer: "The AI voiceovers I create are extremely realistic, with natural intonation, appropriate pacing, and emotional resonance. Many listeners can't distinguish them from human recordings, especially in professional contexts like commercials and explainer videos."
    },
    {
      question: "What languages are available for AI voiceovers?",
      answer: "I can create AI voiceovers in over 30 languages including English, Spanish, French, German, Italian, Japanese, Mandarin, Arabic, Hindi, and many more. Each language has multiple voice options with different accents and tones."
    },
    {
      question: "How quickly can you deliver AI voiceovers?",
      answer: "For standard projects, I can deliver AI voiceovers within 24-48 hours. The timeline depends on the script length, complexity, and required refinements. Rush delivery is available for time-sensitive projects."
    },
    {
      question: "Can AI voices express different emotions and tones?",
      answer: "Yes, modern AI voice technology can produce different emotional tones including excited, professional, friendly, serious, or empathetic. I can adjust the voice characteristics to match your project's specific needs and target audience."
    }
  ],
  
  // AI Avatar FAQs
  aiAvatar: [
    {
      question: "What can I use AI avatars for?",
      answer: "AI avatars are perfect for corporate presentations, marketing videos, educational content, virtual spokespeople, product demonstrations, multilingual content, social media videos, and any situation where you need a professional spokesperson without filming a real person."
    },
    {
      question: "How customizable are your AI avatars?",
      answer: "AI avatars can be highly customized. You can select from different age ranges, ethnicities, clothing styles, and backgrounds. For premium projects, I can create avatars that match specific demographic requirements or brand personalities."
    },
    {
      question: "Can AI avatars speak in multiple languages?",
      answer: "Yes! One of the major advantages of AI avatars is their ability to speak in multiple languages while maintaining the same visual identity. This is perfect for global businesses needing consistent messaging across different markets."
    },
    {
      question: "What's the process for creating an AI avatar video?",
      answer: "The process involves selecting an avatar design, creating or refining the script, generating the voice audio, mapping the speech to the avatar's facial movements, adding any required backgrounds or graphics, and delivering the final video in your preferred format."
    }
  ],
  
  // Graphic Design FAQs
  graphicDesign: [
    {
      question: "What types of graphic design services do you provide?",
      answer: "I specialize in creating social media graphics, brand identity packages, marketing materials, presentation decks, print materials, and digital products. All designs are created with Canva to ensure easy modification and consistency."
    },
    {
      question: "Why do you use Canva for design work?",
      answer: "I use Canva because it combines professional quality with exceptional usability. This means clients can easily make minor updates themselves after delivery, and it allows for quick iterations during the design process. Despite being user-friendly, I leverage Canva's advanced features to create truly professional designs."
    },
    {
      question: "How do you ensure brand consistency across different designs?",
      answer: "I create brand kits within Canva that include your brand colors, typography, logos, and design elements. This ensures every piece maintains visual consistency. I also develop clear style guidelines for ongoing brand cohesion."
    },
    {
      question: "Can you create a complete social media content package?",
      answer: "Absolutely! I can design comprehensive social media packages including profile images, cover photos, post templates for different platforms, story templates, highlight covers, and content calendars—all with a consistent brand look that increases recognition."
    }
  ],
  
  // General FAQs
  general: [
    {
      question: "How do I get started working with you?",
      answer: "The process begins with a consultation to discuss your project requirements. After understanding your needs, I'll provide a proposal with pricing, timeline, and deliverables. Once approved, I'll begin work with regular updates and feedback opportunities throughout the project."
    },
    {
      question: "What are your payment terms?",
      answer: "For most projects, I require a 50% deposit to begin work, with the remaining balance due upon completion. For larger projects, I offer milestone-based payment schedules. I accept payments via bank transfer, PayPal, and major credit cards."
    },
    {
      question: "Do you offer ongoing support after project completion?",
      answer: "Yes, I provide a support period after project completion to address any issues or questions. For websites and e-commerce stores, I also offer monthly maintenance packages to keep everything updated and running smoothly."
    },
    {
      question: "Can you work with clients internationally?",
      answer: "Absolutely! I work with clients worldwide. Communication is handled via email, video calls, and project management tools to ensure smooth collaboration regardless of time zone differences."
    }
  ]
};

// Extended knowledge base for smart topic detection
const extendedKnowledge = {
  webDevKeywords: [
    "responsive", "mobile", "website", "css", "html", "javascript", "animation", "design", 
    "interactive", "frontend", "web development", "loading speed", "optimize", "browser", 
    "cross-browser", "layout", "grid", "flexbox", "navigation", "menu", "ui", "ux", "user interface",
    "web design", "website design", "front-end", "front end", "coding", "web page", "landing page",
    "responsive design", "webpage", "site", "web app", "website development", "web developer",
    "frontend development", "frontend developer", "front end developer", "website builder",
    "static site", "dynamic site", "spa", "single page application", "pwa", "progressive web app"
  ],
  shopifyKeywords: [
    "ecommerce", "e-commerce", "online store", "shopify", "products", "shopping cart", "checkout", 
    "shop", "inventory", "merchant", "sell online", "digital store", "conversion rate", "sales", 
    "payment gateway", "product page", "collection", "store design", "theme", "template", "commerce",
    "online shop", "online business", "e commerce", "dropshipping", "online retail", "etsy", "woocommerce",
    "shopify store", "shopify theme", "shopify design", "ecommerce platform", "e-commerce website",
    "online shop", "online marketplace", "digital marketplace", "sell products", "online selling",
    "e-store", "web store", "internet store", "virtual shop", "e-tail", "online shop design",
    "e-commerce solution", "shopping website", "online business", "retail website", "webshop"
  ],
  audioKeywords: [
    "sound", "audio", "podcast", "mixing", "mastering", "voice", "recording", "music", "song", 
    "production", "soundtrack", "voiceover", "narration", "editing", "audio engineer", "track", 
    "sound design", "background music", "studio", "microphone", "audio quality", "sound effects",
    "audio production", "voice recording", "audio editing", "sound mixing", "audio engineering",
    "audio post-production", "sound processing", "noise reduction", "audio restoration", "vocal processing",
    "audio mastering", "sound cleanup", "audio mixing", "podcast editing", "audio equipment",
    "equalization", "compression", "reverb", "delay", "audio effects", "multitrack", "voice enhancement",
    "audio filtering", "audio cleanup", "sound quality", "audio leveling", "dynamic range", "audio clarity"
  ],
  aiVoiceKeywords: [
    "ai voice", "voice synthesis", "voiceover", "narration", "artificial voice", "text to speech", 
    "tts", "digital voice", "voice ai", "voice talent", "voice actor", "synthetic voice", "neural voice", 
    "speech synthesis", "generated voice", "voice clone", "audio generation", "speaking voice",
    "ai narrator", "ai voiceover", "computer voice", "artificial intelligence voice", "tts voice",
    "synthetic speech", "voice generator", "ai narrator", "generated narration", "virtual voice", 
    "digital narrator", "ai voice acting", "robot voice", "machine voice", "artificial speech",
    "synthetic narrator", "voice synthesis", "computer-generated voice", "ai speech", "neural tts",
    "deep learning voice", "synthetic audio", "machine narration", "computer narration", "voice synthesis"
  ],
  aiAvatarKeywords: [
    "digital human", "virtual character", "talking head", "ai avatar", "digital avatar", "virtual presenter", 
    "avatar", "animated character", "3d character", "virtual spokesperson", "digital presenter", 
    "animated face", "talking avatar", "synthetic video", "ai video", "avatar animation", "character animation",
    "virtual human", "digital person", "ai character", "talking robot", "digital clone", "virtual model",
    "artificial human", "synthetic presenter", "digital actor", "virtual anchor", "ai presenter",
    "cgi human", "deepfake", "digital double", "virtual host", "synthetic character", "ai personality",
    "digital identity", "ai spokesperson", "virtual being", "digital being", "artificial personality",
    "synthetic identity", "virtual assistant", "animated spokesperson", "digital representation"
  ],
  designKeywords: [
    "graphic design", "canva", "social media design", "branding", "logo", "visual identity", "brand identity", 
    "design", "graphics", "illustration", "poster", "flyer", "banner", "presentation", "social post", 
    "instagram", "facebook", "marketing design", "visual", "color scheme", "typography", "layout design",
    "brand design", "social media", "design tools", "infographic", "promotional material", "design services",
    "visual design", "digital design", "print design", "advertising design", "marketing materials",
    "creative design", "graphic art", "digital art", "visual communication", "design assets", "brand assets",
    "design elements", "design composition", "instagram post", "facebook cover", "twitter banner",
    "youtube thumbnail", "media kit", "brand guidelines", "design templates", "canva templates"
  ],
  urduKeywords: [
    "urdu", "hindi", "pakistani", "pakistan", "india", "indian", "desi", "salam", "assalam", "salaam",
    "namaste", "hindi", "punjabi", "kya", "aap", "mein", "main", "hum", "tum", "kaise", "kaisay", "kesa",
    "thik", "theek", "acha", "accha", "achi", "achhi", "acha hai", "baat", "bolo", "karo", "karein", "karen",
    "batao", "bataye", "bataiye", "samajh", "samaj", "samjha", "samjhao", "madad", "help", "madat", "madd"
  ],
  hindiKeywords: [
    "hindi", "indian", "india", "namaste", "namaskar", "dhanyavaad", "kaise", "kya", "hai", "hain",
    "aap", "tum", "main", "hum", "karna", "baat", "batao", "suniye", "sunte", "boliye", "bolo"
  ],
  arabicKeywords: [
    "arabic", "arab", "marhaba", "salam", "shukran", "arabic", "عربي", "مرحبا", "شكرا", "سلام",
    "kaifa", "kayf", "ana", "anta", "anti"
  ],
  spanishKeywords: [
    "spanish", "español", "hola", "gracias", "adios", "como", "estas", "habla", "espanol", "que",
    "bien", "por favor", "de nada", "bueno", "yo", "tu", "el", "ella", "nosotros"
  ],
  blogKeywords: [
    "blog", "article", "post", "content", "read", "guide", "tutorial", "tips", "advice", "resource",
    "information", "insight", "reading", "learn", "knowledge", "written", "writer", "author", "publication",
    "column", "editorial", "feature", "writing", "contents", "blog post", "magazine", "journal", "essay",
    "topic", "subject", "theme", "update", "newsletter", "piece", "composition", "report", "document"
  ],
  faqKeywords: [
    "faq", "frequently asked questions", "common questions", "question", "ask", "answer", "how to",
    "how do i", "can you", "when", "where", "what is", "why", "help", "guide", "tutorial", "support",
    "explanation", "explain", "tell me", "information", "info", "detail", "example", "learn"
  ],
  languageKeywords: [
    "language", "translate", "translation", "speak", "talk", "say", "multi language", "multilanguage",
    "multi-language", "different language", "other language", "change language", "switch language",
    "español", "spanish", "arabic", "hindi", "urdu", "english", "اردو", "हिंदी", "عربي", "espanol", 
    "lenguaje", "idioma", "لغة", "भाषा", "زبان"
  ]
};

// Common questions and patterns with variations for better matching
const questionPatterns = {
  pricing: [
    /how much/i, /pricing/i, /price/i, /cost/i, /rates/i, /fee/i, /charge/i, /pay/i, /package/i, 
    /quote/i, /estimate/i, /budget/i, /afford/i, /expensive/i, /cheap/i, /investment/i, /worth/i,
    /payment/i, /affordable/i, /discount/i, /offer/i, /deal/i, /trial/i, /free/i, /subscription/i,
    /monthly/i, /yearly/i, /annual/i, /premium/i, /basic/i, /standard/i, /pricing tier/i, /cost effective/i,
    /rate/i, /kitna/i, /kitne/i, /paisa/i, /rupees/i, /charges/i
  ],
  process: [
    /process/i, /how does it work/i, /steps/i, /procedure/i, /how do you/i, /workflow/i, /method/i, 
    /approach/i, /start/i, /begin/i, /first step/i, /methodology/i, /system/i, /way/i, /strategy/i,
    /protocol/i, /formula/i, /routine/i, /sequence/i, /roadmap/i, /plan/i, /path/i, /journey/i,
    /operation/i, /technique/i, /pipeline/i, /practice/i, /implementation/i, /execution/i, /action plan/i,
    /kaise/i, /kese/i, /kaisay/i, /karna/i, /karein/i, /kiya/i, /karte/i, /tarika/i, /tariqay/i
  ],
  portfolio: [
    /portfolio/i, /work/i, /projects/i, /example/i, /past work/i, /showcase/i, /samples/i, 
    /previous/i, /clients/i, /done before/i, /made/i, /created/i, /designed/i, /developed/i,
    /built/i, /completed/i, /delivered/i, /case study/i, /work history/i, /work examples/i,
    /success story/i, /track record/i, /credentials/i, /achievement/i, /accomplishment/i, /client work/i,
    /kaam/i, /kya kiya/i, /projects/i, /banaya/i, /banayi/i, /design ki/i, /clients/i
  ],
  timeline: [
    /how long/i, /timeline/i, /deadline/i, /turnaround/i, /deliver/i, /when/i, /time frame/i, 
    /duration/i, /finish/i, /complete/i, /ready by/i, /days/i, /weeks/i, /months/i, /hours/i,
    /schedule/i, /eta/i, /estimated/i, /timespan/i, /project length/i, /time required/i,
    /delivery time/i, /completion date/i, /project duration/i, /project timeline/i, /timing/i,
    /kitna time/i, /kitne din/i, /kab tak/i, /jaldi/i, /time lagega/i, /complete hoga/i
  ],
  experience: [
    /experience/i, /background/i, /qualification/i, /expert/i, /years/i, /how many/i, 
    /skilled/i, /proficient/i, /professional/i, /history/i, /past/i, /worked in/i,
    /specialist/i, /expertise/i, /knowledge/i, /trained/i, /certified/i, /education/i,
    /degree/i, /graduated/i, /studied/i, /learning/i, /familiar with/i, /mastery/i, /veteran/i,
    /kitne saal/i, /experience/i, /expert/i, /skills/i, /kitne saalon ka/i, /professional/i
  ],
  contact: [
    /contact/i, /reach/i, /email/i, /phone/i, /call/i, /message/i, /get in touch/i, 
    /connect/i, /talk/i, /discuss/i, /consultation/i, /meeting/i, /appointment/i,
    /inquiry/i, /question/i, /request/i, /information/i, /details/i, /chat/i, /communicate/i,
    /support/i, /help/i, /assistance/i, /schedule/i, /book/i, /reserve/i, /availability/i,
    /rabta/i, /contact/i, /email/i, /phone/i, /number/i, /mobile/i, /baat/i, /sampark/i
  ],
  benefits: [
    /benefit/i, /advantage/i, /value/i, /worth/i, /good/i, /better/i, /best/i, /help/i, /assist/i,
    /improve/i, /enhance/i, /boost/i, /increase/i, /upgrade/i, /elevate/i, /lift/i, /optimize/i,
    /perfect/i, /superior/i, /exceptional/i, /excellent/i, /gain/i, /profit/i, /reward/i, /return/i,
    /outcome/i, /result/i, /effect/i, /impact/i, /difference/i, /change/i, /transformation/i,
    /fayda/i, /faida/i, /benefit/i, /acha/i, /achha/i, /behtar/i, /behtareen/i, /improve/i
  ],
  language: [
    /language/i, /translate/i, /translation/i, /speak/i, /talk/i, /say/i, /multi language/i,
    /español/i, /spanish/i, /arabic/i, /hindi/i, /urdu/i, /english/i, /اردو/i, /हिंदी/i, /عربي/i, 
    /change language/i, /switch language/i, /other language/i, /different language/i, /idioma/i
  ],
  faq: [
    /faq/i, /frequently asked/i, /common question/i, /question/i, /ask/i, /answer/i, /how to/i,
    /what is/i, /why/i, /help/i, /guide/i, /tutorial/i, /support/i, /explain/i, /tell me/i
  ],
  textToSpeech: [
    /speak/i, /talk/i, /say/i, /voice/i, /audio/i, /sound/i, /out loud/i, /read/i, /speech/i, /text to speech/i,
    /tts/i, /pronounce/i, /verbalize/i, /vocalize/i, /articulate/i, /utter/i, /verbally/i, /orally/i,
    /read aloud/i, /read to me/i, /tell me/i, /announce/i, /narrate/i, /recite/i, /speak up/i, /speak out/i
  ]
};

// Contextual information responses
const contextualInfo = {
  benefit: {
    webDevelopment: [
      "A responsive website designed by Motasim will help your business:",
      "• Increase online visibility and attract more visitors",
      "• Create a professional first impression that builds trust",
      "• Provide a seamless experience across all devices",
      "• Load quickly, reducing bounce rates and improving SEO",
      "• Convert more visitors into leads or customers with intuitive navigation"
    ],
    shopify: [
      "Motasim billah custom Shopify store design services will help your business:",
      "• Increase conversion rates with optimized checkout flows",
      "• Build customer trust with professional, branded design",
      "• Stand out from competitors with unique, custom features",
      "• Improve mobile shopping experience for the growing mobile audience",
      "• Integrate seamlessly with marketing tools to drive more sales"
    ],
    audioEngineering: [
      "Professional audio engineering by Mehar benefits your projects by:",
      "• Enhancing overall sound quality and clarity",
      "• Creating a polished, professional impression that builds credibility",
      "• Improving listener engagement and retention with clean, balanced audio",
      "• Eliminating distracting background noise and audio issues",
      "• Ensuring consistent volume levels across all content"
    ],
    aiVoiceover: [
      "Motasim billah AI voiceover services provide advantages like:",
      "• Cost-effective alternative to hiring voice actors for multiple projects",
      "• Quick turnaround times for urgent deadlines",
      "• Consistency in voice across all your marketing materials",
      "• Multiple language options without hiring additional voice talent",
      "• Easy revisions without scheduling re-recording sessions"
    ],
    aiAvatar: [
      "Using Motasim billah AI avatars for your business provides benefits such as:",
      "• Creating engaging video content without filming equipment or studio",
      "• Maintaining consistent brand representation across all videos",
      "• Easily updating content without re-shoots when information changes",
      "• Multi-language capabilities for global audience reach",
      "• Professional video presence without the anxiety of being on camera"
    ],
    graphicDesign: [
      "Motasim billah Canva design services help your business by:",
      "• Creating consistent visual branding that increases recognition",
      "• Designing eye-catching social media graphics that improve engagement",
      "• Producing professional marketing materials that convert prospects",
      "• Developing presentations that effectively communicate your message",
      "• Quick turnaround on visual assets for time-sensitive campaigns"
    ]
  },
  process: {
    webDevelopment: [
      "Motasim billah web development process includes:",
      "1. Discovery - Understanding your business goals and target audience",
      "2. Planning - Creating sitemaps and wireframes for optimal user flow",
      "3. Design - Developing visual mockups for your approval",
      "4. Development - Building the responsive frontend with HTML, CSS, and JavaScript",
      "5. Testing - Ensuring compatibility across browsers and devices",
      "6. Launch - Deploying the website and providing training"
    ],
    shopify: [
      "For Shopify store design, Mehar follows this process:",
      "1. Strategy - Analyzing your products, audience, and competition",
      "2. Structure - Planning the store architecture and user flows",
      "3. Design - Creating custom mockups of key pages",
      "4. Development - Building and customizing your Shopify store",
      "5. Testing - Ensuring functionality across devices and browsers",
      "6. Launch - Deploying your store and providing training"
    ],
    audioEngineering: [
      "Motasim's audio engineering workflow typically follows these steps:",
      "1. Consultation - Understanding your project goals and requirements",
      "2. Recording/Source Assessment - Evaluating existing audio or recording new content",
      "3. Editing - Cleaning up recordings and arranging audio elements",
      "4. Mixing - Balancing levels, EQ, compression, and effects",
      "5. Mastering - Finalizing the audio for optimal playback across devices",
      "6. Delivery - Providing files in your required formats"
    ],
    aiVoiceover: [
      "Motasim's AI voiceover creation process includes:",
      "1. Script Analysis - Reviewing your script for optimal voice delivery",
      "2. Voice Selection - Choosing the perfect AI voice for your brand and content",
      "3. Generation - Creating the initial AI voiceover",
      "4. Refinement - Adjusting pronunciation, emphasis, and pacing",
      "5. Processing - Enhancing audio quality and naturalness",
      "6. Delivery - Providing the final voiceover in your preferred format"
    ],
    aiAvatar: [
      "When creating AI avatars, Motasim follows these steps:",
      "1. Character Design - Selecting or customizing the perfect digital human",
      "2. Script Development - Creating natural-sounding dialogue",
      "3. Voice Generation - Creating the avatar's voice",
      "4. Animation - Generating synchronized lip movements and expressions",
      "5. Post-Processing - Enhancing visual quality and adding backgrounds",
      "6. Delivery - Providing the final video in your required format"
    ],
    graphicDesign: [
      "Motasim's graphic design process with Canva includes:",
      "1. Brief - Understanding your brand, goals, and target audience",
      "2. Research - Analyzing trends and competition for inspiration",
      "3. Concept - Developing initial design concepts",
      "4. Creation - Building the designs in Canva",
      "5. Refinement - Making revisions based on your feedback",
      "6. Delivery - Providing files in your required formats and sizes"
    ]
  },
  examples: {
    webDevelopment: [
      "Motasim has created several impressive websites, including:",
      "• A responsive portfolio site for a creative agency with smooth GSAP animations",
      "• A business landing page that increased lead generation by 45%",
      "• An interactive product showcase with advanced JavaScript functionality",
      "• A mobile-first web application with intuitive navigation",
      "Visit the projects section to see more examples."
    ],
    shopify: [
      "Some of Motasim's notable Shopify store designs include:",
      "• A fashion boutique that saw a 65% increase in mobile conversions",
      "• A home goods store with custom collection pages that boosted average order value",
      "• A specialty food shop with optimized product pages that improved conversion rates",
      "• A subscription-based service with a streamlined checkout process",
      "Check out the e-commerce portfolio for more examples."
    ],
    audioEngineering: [
      "Motasim's audio engineering portfolio includes:",
      "• Professional podcast editing for business and interview shows",
      "• Music production and mixing for independent artists",
      "• Sound design for promotional videos and commercials",
      "• Voice processing and cleanup for audiobooks and educational content",
      "• Background music composition for corporate presentations"
    ],
    aiVoiceover: [
      "Examples of Motasim's AI voiceover work include:",
      "• Explainer videos for tech companies with natural-sounding narration",
      "• IVR system prompts for customer service lines",
      "• E-learning course narration in multiple languages",
      "• Audiobook narration with nuanced emotional delivery",
      "• Commercial advertisements with compelling voice delivery"
    ],
    aiAvatar: [
      "Motasim has created AI avatars for various purposes, including:",
      "• Virtual spokespersons for company websites",
      "• Presenters for product demonstrations",
      "• Trainers for corporate e-learning programs",
      "• Multi-lingual customer service representatives",
      "• Social media content creators for brands"
    ],
    graphicDesign: [
      "Motasim's graphic design portfolio showcases:",
      "• Social media content series that increased engagement by 78%",
      "• Brand identity packages for startups and established businesses",
      "• Marketing materials for product launches and events",
      "• Professional presentation decks for investor pitches",
      "• Digital and print advertising materials with consistent branding"
    ]
  }
};

// CSS for link highlighting and UI enhancements
const chatbotStyles = `
.chat-link {
  color: #a855f7;
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.2s ease;
  padding: 0 2px;
  border-radius: 3px;
  background-color: rgba(168, 85, 247, 0.1);
}

.chat-link:hover {
  color: #6d28d9;
  background-color: rgba(168, 85, 247, 0.2);
  text-decoration: underline;
}

.voice-input-btn {
  position: absolute;
  right: 50px;
  bottom: 12px;
  background-color: transparent;
  border: none;
  color: #a855f7;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s ease;
  z-index: 10;
}

.voice-input-btn:hover {
  transform: scale(1.1);
}

.voice-input-btn.recording {
  color: #ef4444;
  animation: pulse 1.5s infinite;
}

.text-to-speech-btn {
  position: absolute;
  right: 80px;
  bottom: 12px;
  background-color: transparent;
  border: none;
  color: #a855f7;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s ease;
  z-index: 10;
}

.text-to-speech-btn:hover {
  transform: scale(1.1);
}

.text-to-speech-btn.speaking {
  color: #3b82f6;
  animation: pulse 1.5s infinite;
}

.language-selector-dropdown {
  position: absolute;
  right: 110px;
  bottom: 12px;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid #a855f7;
  border-radius: 4px;
  color: #a855f7;
  font-size: 14px;
  padding: 2px 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.language-selector-dropdown:focus {
  outline: none;
  border-color: #6d28d9;
}

.language-selector-dropdown option {
  background-color: #1e1e1e;
  color: #ffffff;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.chat-message .message-text a {
  color: #a855f7;
  text-decoration: underline;
  font-weight: 500;
  background-color: rgba(168, 85, 247, 0.1);
  padding: 0 2px;
  border-radius: 3px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.chat-message .message-text a:hover {
  color: #6d28d9;
  background-color: rgba(168, 85, 247, 0.2);
}

.faq-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.faq-question {
  background-color: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 13px;
  color: #6d28d9;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.faq-question:hover {
  background-color: rgba(168, 85, 247, 0.2);
  transform: translateY(-2px);
}
`;

// Initialize the chatbot when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add our custom CSS for styling
  const styleEl = document.createElement('style');
  styleEl.textContent = chatbotStyles;
  document.head.appendChild(styleEl);
  
  initChatbot();
  console.log('Chatbot initialization attempted');
});

// Create language selector dropdown function
function createLanguageSelector() {
  const langSelector = document.createElement('select');
  langSelector.className = 'language-selector-dropdown';
  
  // Short language names only
  const shortNames = {
    english: 'Eng',
    urdu: 'Urdu',
    hindi: 'Hindi',
    arabic: 'Arabic',
    spanish: 'Esp'
  };
  
  // Add language options
  for (const [langKey, langInfo] of Object.entries(supportedLanguages)) {
    const option = document.createElement('option');
    option.value = langKey;
    // Use just the short name without flag
    option.text = shortNames[langKey] || langInfo.name;
    langSelector.appendChild(option);
  }
  
  // Set default selected language
  langSelector.value = 'english';
  
  // Add change event listener
  langSelector.addEventListener('change', function() {
    changeLanguage(this.value);
  });
  
  return langSelector;
}

// Main chatbot initialization function
function initChatbot() {
  // Get DOM elements using your HTML structure's class names
  const chatToggleBtn = document.querySelector('.chat-toggle-btn');
  const chatInterface = document.querySelector('.chat-interface');
  const chatCloseBtn = document.querySelector('.chat-close-btn');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.querySelector('.chat-messages');
  const suggestedQuestions = document.querySelector('.suggested-questions');
  const suggestedQuestionBtns = document.querySelectorAll('.suggested-question');
  
  // Add voice input button and other controls
  const chatInputArea = document.querySelector('.chat-input-area');
  if (chatInputArea) {
    // Voice input button
    const voiceBtn = document.createElement('button');
    voiceBtn.type = 'button';
    voiceBtn.className = 'voice-input-btn';
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceBtn.setAttribute('title', 'Voice Input (Click to speak)');
    chatInputArea.appendChild(voiceBtn);
    
    // Text-to-speech button
    const ttsBtn = document.createElement('button');
    ttsBtn.type = 'button';
    ttsBtn.className = 'text-to-speech-btn';
    ttsBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    ttsBtn.setAttribute('title', 'Text to Speech (Read aloud)');
    chatInputArea.appendChild(ttsBtn);
    
    // Language selector dropdown
    const langSelector = createLanguageSelector();
    chatInputArea.appendChild(langSelector);
  }

  // Variables for chatbot state
  let chatHistory = [];
  let isChatOpen = false;
  let isRecording = false;
  let isSpeaking = false;
  let currentUtterance = null;
  let currentFAQs = [];
  
  // Chat context
  let chatContext = {
    lastTopic: null,
    mentionedTopics: [],
    questionType: null,
    userPreferences: {
      language: 'english', // Default language
      voicePreferences: {
        rate: 1.0,         // Default speech rate
        pitch: 1.0,        // Default pitch
        volume: 1.0        // Default volume
      }
    },
    conversationStage: 'greeting', // greeting, exploring, specific, closing
    queryCounts: {}, // Keep track of frequently asked questions for dynamic FAQ generation
    dynamicFAQs: []  // Store generated FAQs based on conversation
  };

  console.log('Chat elements found:', { 
    chatToggleBtn, 
    chatInterface, 
    chatCloseBtn, 
    chatForm, 
    chatInput, 
    chatMessages 
  });

  // Event listeners
  if (chatToggleBtn) {
    chatToggleBtn.addEventListener('click', toggleChat);
    console.log('Toggle button listener added');
  }

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', closeChat);
    console.log('Close button listener added');
  }

  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage();
      console.log('Form submitted');
    });
  }
  
  // Add voice input functionality
  const voiceBtn = document.querySelector('.voice-input-btn');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', toggleVoiceInput);
    console.log('Voice button listener added');
  }
  
  // Add text-to-speech functionality
  const ttsBtn = document.querySelector('.text-to-speech-btn');
  if (ttsBtn) {
    ttsBtn.addEventListener('click', () => {
      const lastBotMessage = chatHistory.filter(msg => msg.sender === 'bot').pop();
      if (lastBotMessage) {
        speakText(stripHtml(lastBotMessage.message));
      }
    });
    console.log('Text-to-speech button listener added');
  }
  
  // Add language selector functionality
  const langSelector = document.querySelector('.language-selector-dropdown');
  if (langSelector) {
    langSelector.addEventListener('change', function() {
      changeLanguage(this.value);
    });
    console.log('Language selector listener added');
  }

  // Add event listeners for suggested questions
  suggestedQuestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const questionText = btn.textContent;
      addUserMessage(questionText);
      
      // Process the question and get response
      const botResponse = generateResponse(questionText);
      
      // Delay for typing effect
      setTimeout(() => {
        addBotMessage(botResponse);
      }, 1000);
      
      // Hide suggested questions after clicking one
      suggestedQuestions.style.display = 'none';
    });
  });
  
  // Language change function
  function changeLanguage(lang) {
    if (supportedLanguages[lang]) {
      chatContext.userPreferences.language = lang;
      
      // Send a confirmation message
      let confirmationMsg = '';
      
      switch (lang) {
        case 'english':
          confirmationMsg = "Language switched to English. How can I help you?";
          break;
        case 'urdu':
          confirmationMsg = "زبان اردو میں تبدیل کر دی گئی ہے۔ میں آپ کی کیسے مدد کر سکتا ہوں؟";
          break;
        case 'hindi':
          confirmationMsg = "भाषा हिंदी में बदल दी गई है। मैं आपकी कैसे सहायता कर सकता हूँ?";
          break;
        case 'arabic':
          confirmationMsg = "تم تغيير اللغة إلى العربية. كيف يمكنني مساعدتك؟";
          break;
        case 'spanish':
          confirmationMsg = "Idioma cambiado a español. ¿Cómo puedo ayudarte?";
          break;
        default:
          confirmationMsg = "Language changed. How can I help you?";
      }
      
      addBotMessage(confirmationMsg);
      console.log(`Language changed to ${lang}`);
    }
  }
  
  // Voice input functionality
  function toggleVoiceInput() {
    if (!isRecording) {
      // Start recording
      startVoiceRecognition();
    } else {
      // Stop recording
      stopVoiceRecognition();
    }
  }
  
  // Text-to-speech functionality
  function speakText(text) {
    // Stop any current speech
    if (isSpeaking) {
      stopSpeaking();
    }
    
    // Check if speech synthesis is available
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set language based on user preference
      const langCode = supportedLanguages[chatContext.userPreferences.language]?.code || 'en-US';
      utterance.lang = langCode;
      
      // Set voice preferences
      utterance.rate = chatContext.userPreferences.voicePreferences.rate;
      utterance.pitch = chatContext.userPreferences.voicePreferences.pitch;
      utterance.volume = chatContext.userPreferences.voicePreferences.volume;
      
      // Add event listeners
      utterance.onstart = () => {
        isSpeaking = true;
        const ttsBtn = document.querySelector('.text-to-speech-btn');
        if (ttsBtn) {
          ttsBtn.classList.add('speaking');
          ttsBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        console.log('Started speaking');
      };
      
      utterance.onend = () => {
        isSpeaking = false;
        const ttsBtn = document.querySelector('.text-to-speech-btn');
        if (ttsBtn) {
          ttsBtn.classList.remove('speaking');
          ttsBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        currentUtterance = null;
        console.log('Finished speaking');
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        isSpeaking = false;
        const ttsBtn = document.querySelector('.text-to-speech-btn');
        if (ttsBtn) {
          ttsBtn.classList.remove('speaking');
          ttsBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
        currentUtterance = null;
      };
      
      // Store current utterance and start speaking
      currentUtterance = utterance;
      speechSynthesis.speak(utterance);
      
    } else {
      console.log('Text-to-speech not supported in this browser');
      alert('Sorry, your browser does not support text-to-speech functionality.');
    }
  }
  
  // Stop speaking function
  function stopSpeaking() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      isSpeaking = false;
      
      const ttsBtn = document.querySelector('.text-to-speech-btn');
      if (ttsBtn) {
        ttsBtn.classList.remove('speaking');
        ttsBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      }
      
      currentUtterance = null;
      console.log('Speech stopped');
    }
  }
  
  // Strip HTML tags from text
  function stripHtml(html) {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  
  // Voice recognition setup
  let recognition;
  
  function startVoiceRecognition() {
    try {
      // Check if browser supports speech recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        // Set language based on user preference
        const langCode = supportedLanguages[chatContext.userPreferences.language]?.code || 'en-US';
        recognition.lang = langCode;
        
        recognition.continuous = false;
        recognition.interimResults = false;
        
        // Update UI to show recording state
        const voiceBtn = document.querySelector('.voice-input-btn');
        if (voiceBtn) {
          voiceBtn.classList.add('recording');
          voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        }
        isRecording = true;
        
        // Add event listeners for recognition results
        recognition.onresult = function(event) {
          const transcript = event.results[0][0].transcript;
          if (chatInput) {
            chatInput.value = transcript;
            console.log('Voice input captured:', transcript);
          }
        };
        
        recognition.onend = function() {
          stopVoiceRecognition();
          // Auto-submit the form if we got some text
          if (chatInput && chatInput.value.trim()) {
            setTimeout(() => {
              sendMessage();
            }, 500);
          }
        };
        
        recognition.onerror = function(event) {
          console.error('Speech recognition error:', event.error);
          stopVoiceRecognition();
          // Show error message to user
          if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please enable microphone permissions to use voice input.');
          }
        };
        
        recognition.start();
        console.log('Voice recognition started');
      } else {
        alert('Sorry, your browser does not support voice recognition.');
        console.log('Speech recognition not supported');
      }
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      stopVoiceRecognition();
    }
  }
  
  function stopVoiceRecognition() {
    if (recognition) {
      recognition.stop();
    }
    
    // Update UI to show normal state
    const voiceBtn = document.querySelector('.voice-input-btn');
    if (voiceBtn) {
      voiceBtn.classList.remove('recording');
      voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
    isRecording = false;
    console.log('Voice recognition stopped');
  }

  // Function to toggle chat visibility
  function toggleChat() {
    if (chatInterface) {
      isChatOpen = !isChatOpen;
      chatInterface.classList.toggle('active', isChatOpen);
      
      if (isChatOpen && chatHistory.length === 0) {
        // First time opening chat - send welcome message
        setTimeout(() => {
          let welcomeMessage;
          
          switch (chatContext.userPreferences.language) {
            case 'urdu':
              welcomeMessage = getRandomResponse(languageResponses.urdu.greetings || knowledgeBase.greetings);
              break;
            case 'hindi':
              welcomeMessage = getRandomResponse(languageResponses.hindi.greetings || knowledgeBase.greetings);
              break;
            case 'arabic':
              welcomeMessage = getRandomResponse(languageResponses.arabic.greetings || knowledgeBase.greetings);
              break;
            case 'spanish':
              welcomeMessage = getRandomResponse(languageResponses.spanish.greetings || knowledgeBase.greetings);
              break;
            default:
              welcomeMessage = getRandomResponse(knowledgeBase.greetings);
          }
          
          addBotMessage(welcomeMessage);
          
          // Show suggested questions after first bot message
          if (suggestedQuestions) {
            suggestedQuestions.style.display = 'flex';
          }
        }, 500);
      }
      
      console.log('Chat toggled, open state:', isChatOpen);
    }
  }

  // Function to close chat
  function closeChat() {
    if (chatInterface) {
      isChatOpen = false;
      chatInterface.classList.remove('active');
      
      // Stop any ongoing speech when closing chat
      if (isSpeaking) {
        stopSpeaking();
      }
      
      console.log('Chat closed');
    }
  }

  // Function to send user message
  function sendMessage() {
    if (!chatInput || !chatInput.value.trim()) return;
    
    const userMessage = chatInput.value.trim();
    addUserMessage(userMessage);
    chatInput.value = '';
    
    // Hide suggested questions when user sends a message
    if (suggestedQuestions) {
      suggestedQuestions.style.display = 'none';
    }
    
    // Process user input and generate response
    const botResponse = generateResponse(userMessage);
    
    // Update query counts for dynamic FAQ generation
    updateQueryCount(userMessage);
    
    // Simulate typing delay based on response length
    const typingDelay = Math.min(1500, botResponse.length * 10);
    
    // Add typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-message bot-message typing-indicator';
    typingIndicator.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-bubble">
        <div class="message-text">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    setTimeout(() => {
      // Remove typing indicator
      chatMessages.removeChild(typingIndicator);
      
      // Add actual bot response
      addBotMessage(botResponse);
      
      // Auto-speak the response if text-to-speech is enabled (optional)
      if (questionPatterns.textToSpeech.some(pattern => pattern.test(userMessage.toLowerCase()))) {
        setTimeout(() => {
          speakText(stripHtml(botResponse));
        }, 500);
      }
      
      // Generate dynamic FAQs based on the current topic
      if (chatContext.lastTopic) {
        generateRelatedFAQs(chatContext.lastTopic);
      }
    }, typingDelay);
  }

  // Add user message to chat
  function addUserMessage(message) {
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message user-message';
    messageElement.innerHTML = `
      <div class="message-bubble">
        <div class="message-text">
          ${message}
        </div>
      </div>
      <div class="message-avatar">
        <i class="fas fa-user"></i>
      </div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to history
    chatHistory.push({ sender: 'user', message });
  }

  // Add bot message to chat with properly styled links
  function addBotMessage(message) {
    if (!chatMessages) return;
    
    // Create the message element
    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message bot-message';
    
    // Format links in the message
    const formattedMessage = formatLinks(message);
    
    messageElement.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-bubble">
        <div class="message-text">
          ${formattedMessage}
        </div>
      </div>
    `;
    
    // Add to DOM
    chatMessages.appendChild(messageElement);
    
    // Add FAQs if available
    if (currentFAQs && currentFAQs.length > 0) {
      const faqContainer = document.createElement('div');
      faqContainer.className = 'faq-container';
      
      currentFAQs.forEach(faq => {
        const faqBtn = document.createElement('button');
        faqBtn.className = 'faq-question';
        faqBtn.textContent = faq.question;
        faqBtn.addEventListener('click', () => {
          addUserMessage(faq.question);
          
          const botResponse = faq.answer;
          
          // Add typing effect
          setTimeout(() => {
            addBotMessage(botResponse);
          }, 800);
        });
        
        faqContainer.appendChild(faqBtn);
      });
      
      const faqWrapper = document.createElement('div');
      faqWrapper.className = 'chat-message bot-message';
      faqWrapper.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-bubble">
          <div class="message-text">
            <strong>You might also want to know:</strong>
          </div>
        </div>
      `;
      
      // Insert the FAQ buttons into the message
      const messageBubble = faqWrapper.querySelector('.message-bubble');
      messageBubble.appendChild(faqContainer);
      
      chatMessages.appendChild(faqWrapper);
      
      // Reset FAQs after adding them
      currentFAQs = [];
    }
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to history
    chatHistory.push({ sender: 'bot', message });
  }
  
  // Format links with special styling
  function formatLinks(message) {
    // Links are already in <a> tags, but we'll add the class to make them stand out
    return message.replace(/<a\s+href="([^"]+)"([^>]*)>(.*?)<\/a>/gi, 
      '<a href="$1" $2 class="chat-link" target="_blank">$3</a>');
  }

  // Update query count for FAQ generation
  function updateQueryCount(query) {
    const lowerQuery = query.toLowerCase();
    
    // Get the key topics from the query
    const tokens = lowerQuery.split(/\s+/);
    const keyTerms = tokens.filter(token => 
      token.length > 3 && 
      !['what', 'how', 'why', 'when', 'where', 'who', 'which', 'that', 'this', 'these', 'those', 'with', 'about', 'from', 'your', 'have', 'does', 'will'].includes(token)
    );
    
    // Update counts for these key terms
    keyTerms.forEach(term => {
      chatContext.queryCounts[term] = (chatContext.queryCounts[term] || 0) + 1;
    });
    
    console.log('Updated query counts:', chatContext.queryCounts);
  }
  
  // Generate related FAQs based on topic
  function generateRelatedFAQs(topic) {
    let faqs = [];
    
    // Get FAQs for the specific topic if available
    if (dynamicFAQs[topic]) {
      // Get a random selection of FAQs (maximum 3)
      faqs = [...dynamicFAQs[topic]];
      shuffleArray(faqs);
      faqs = faqs.slice(0, 3);
    } else {
      // Fallback to general FAQs
      faqs = [...dynamicFAQs.general];
      shuffleArray(faqs);
      faqs = faqs.slice(0, 3);
    }
    
    // Store the FAQs for display
    currentFAQs = faqs;
  }
  
  // Shuffle array helper function
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Function to generate response based on user input
  function generateResponse(userInput) {
    const input = userInput.toLowerCase();
    let response = '';
    
    // Check for language change request
    if (containsAny(input, ['english', 'switch to english', 'speak english'])) {
      changeLanguage('english');
      return "Language switched to English. How can I help you?";
    } else if (containsAny(input, ['urdu', 'switch to urdu', 'speak urdu'])) {
      changeLanguage('urdu');
      return "زبان اردو میں تبدیل کر دی گئی ہے۔ میں آپ کی کیسے مدد کر سکتا ہوں؟";
    } else if (containsAny(input, ['hindi', 'switch to hindi', 'speak hindi'])) {
      changeLanguage('hindi');
      return "भाषा हिंदी में बदल दी गई है। मैं आपकी कैसे सहायता कर सकता हूँ?";
    } else if (containsAny(input, ['arabic', 'switch to arabic', 'speak arabic'])) {
      changeLanguage('arabic');
      return "تم تغيير اللغة إلى العربية. كيف يمكنني مساعدتك؟";
    } else if (containsAny(input, ['spanish', 'switch to spanish', 'speak spanish', 'español'])) {
      changeLanguage('spanish');
      return "Idioma cambiado a español. ¿Cómo puedo ayudarte?";
    }
    
    // Update context with detected topics
    updateChatContext(input);
    
    // Check for specific triggers based on current language
    const lang = chatContext.userPreferences.language;
    
    // Check for greetings
    if (containsAny(input, ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy', 'hola', 'bonjour', 'namaste', 'salam', 'assalam', 'asalam', 'assalamu', 'aoa'])) {
      if (lang === 'urdu' && languageResponses.urdu.greetings) {
        response = getRandomResponse(languageResponses.urdu.greetings);
      } else if (lang === 'hindi' && languageResponses.hindi.greetings) {
        response = getRandomResponse(languageResponses.hindi.greetings);
      } else if (lang === 'arabic' && languageResponses.arabic.greetings) {
        response = getRandomResponse(languageResponses.arabic.greetings);
      } else if (lang === 'spanish' && languageResponses.spanish.greetings) {
        response = getRandomResponse(languageResponses.spanish.greetings);
      } else {
        response = getRandomResponse(knowledgeBase.greetings);
      }
      chatContext.conversationStage = 'greeting';
    }
    // Check for how are you
    else if (containsAny(input, ['how are you', 'how is it going', 'how are things', 'how do you do', 'how\'s it going', 'what\'s up', 'how\'s life', 'how have you been', 'kaise ho', 'kya haal hai', 'kese ho', 'kaisay ho', 'kaisa hai'])) {
      if (lang === 'urdu' && languageResponses.urdu.howAreYou) {
        response = getRandomResponse(languageResponses.urdu.howAreYou);
      } else if (lang === 'hindi' && languageResponses.hindi.howAreYou) {
        response = getRandomResponse(languageResponses.hindi.howAreYou);
      } else if (lang === 'arabic' && languageResponses.arabic.howAreYou) {
        response = getRandomResponse(languageResponses.arabic.howAreYou);
      } else if (lang === 'spanish' && languageResponses.spanish.howAreYou) {
        response = getRandomResponse(languageResponses.spanish.howAreYou);
      } else {
        response = getRandomResponse(knowledgeBase.howAreYou);
      }
    }
    // Check for thanks
    else if (containsAny(input, ['thanks', 'thank you', 'appreciate', 'grateful', 'helpful', 'thank', 'appreciated', 'gratitude', 'thx', 'shukriya', 'shukria', 'mehrbani', 'dhanyavad'])) {
      if (lang === 'urdu' && languageResponses.urdu.thanks) {
        response = getRandomResponse(languageResponses.urdu.thanks);
      } else if (lang === 'hindi' && languageResponses.hindi.thanks) {
        response = getRandomResponse(languageResponses.hindi.thanks);
      } else if (lang === 'arabic' && languageResponses.arabic.thanks) {
        response = getRandomResponse(languageResponses.arabic.thanks);
      } else if (lang === 'spanish' && languageResponses.spanish.thanks) {
        response = getRandomResponse(languageResponses.spanish.thanks);
      } else {
        response = getRandomResponse(knowledgeBase.thanks);
      }
      chatContext.conversationStage = 'closing';
    }
    // Check for goodbye
    else if (containsAny(input, ['bye', 'goodbye', 'see you', 'later', 'farewell', 'good night', 'take care', 'signing off', 'until next time', 'ciao', 'adios', 'khuda hafiz', 'allah hafiz', 'phir milenge', 'alvida'])) {
      if (lang === 'urdu' && languageResponses.urdu.goodbye) {
        response = getRandomResponse(languageResponses.urdu.goodbye);
      } else if (lang === 'hindi' && languageResponses.hindi.goodbye) {
        response = getRandomResponse(languageResponses.hindi.goodbye);
      } else if (lang === 'arabic' && languageResponses.arabic.goodbye) {
        response = getRandomResponse(languageResponses.arabic.goodbye);
      } else if (lang === 'spanish' && languageResponses.spanish.goodbye) {
        response = getRandomResponse(languageResponses.spanish.goodbye);
      } else {
        response = getRandomResponse(knowledgeBase.goodbye);
      }
      chatContext.conversationStage = 'closing';
    }
    // Check for text-to-speech request
    else if (containsAny(input, ['speak to me', 'read aloud', 'read it', 'say it', 'talk to me', 'voice', 'audio', 'speak this', 'read this', 'speak out loud'])) {
      if (lang === 'urdu') {
        response = "Mein ab apko jawab bolkar bhi bata sakta hun. Kya aap mujh se kuch poochna chahte hain?";
      } else if (lang === 'hindi') {
        response = "मैं अब आपको उत्तर बोलकर भी बता सकता हूं। क्या आप मुझसे कुछ पूछना चाहते हैं?";
      } else if (lang === 'arabic') {
        response = "يمكنني الآن قراءة الإجابات بصوت عالٍ. هل لديك سؤال لي؟";
      } else if (lang === 'spanish') {
        response = "Ahora puedo leer las respuestas en voz alta. ¿Tienes alguna pregunta para mí?";
      } else {
        response = "I can now read answers aloud to you. What would you like to know about Motasim's services?";
      }
      setTimeout(() => {
        speakText(response);
      }, 500);
    }
    // Check for about
    else if ((containsAny(input, ['who is', 'about', 'tell me about', 'who\'s', 'background', 'describe', 'introduce', 'information on', 'kaun hai', 'kaun hain', 'kon hai', 'kon hain', 'kya karte hain']) && 
             containsAny(input, ['Motasim', 'mehar', 'you', 'your', 'creator', 'owner', 'portfolio', 'developer', 'himself', 'designer', 'company', 'business', 'aap', 'apka', 'tumhara']))) {
      if (lang === 'urdu' && languageResponses.urdu.about) {
        response = languageResponses.urdu.about[0];
      } else if (lang === 'hindi' && languageResponses.hindi.about) {
        response = languageResponses.hindi.about[0];
      } else if (lang === 'arabic' && languageResponses.arabic.about) {
        response = languageResponses.arabic.about[0];
      } else if (lang === 'spanish' && languageResponses.spanish.about) {
        response = languageResponses.spanish.about[0];
      } else {
        response = getRandomResponse(knowledgeBase.about);
      }
      response += `\n\nYou can learn more about Motasim here: <a href="${pageLinks.about}" target="_blank">About Motasim</a>`;
      chatContext.conversationStage = 'exploring';
    }
    // Check for skills
    else if (containsAny(input, ['skills', 'abilities', 'expertise', 'talented', 'good at', 'specialties', 'capabilities', 'competencies', 'proficient', 'experienced in', 'skilled in', 'qualifications', 'skills kya hain', 'kya aata hai', 'kya karte hain', 'expertise kya hai'])) {
      if (lang === 'urdu' && languageResponses.urdu.skills) {
        response = languageResponses.urdu.skills.join('\n');
      } else if (lang === 'hindi' && languageResponses.hindi.skills) {
        response = languageResponses.hindi.skills.join('\n');
      } else if (lang === 'arabic' && languageResponses.arabic.skills) {
        response = languageResponses.arabic.skills.join('\n');
      } else if (lang === 'spanish' && languageResponses.spanish.skills) {
        response = languageResponses.spanish.skills.join('\n');
      } else {
        response = knowledgeBase.skills.join('\n');
      }
      response += `\n\nYou can see more details about Motasim's skills here: <a href="${pageLinks.skills}" target="_blank">Skills & Expertise</a>`;
      chatContext.conversationStage = 'exploring';
    }
    // Check for services
    else if (containsAny(input, ['services', 'offer', 'offerings', 'provide', 'what do you do', 'help with', 'assistance', 'support', 'solutions', 'work', 'consulting', 'available services', 'kya service', 'kya provide', 'kya kaam', 'konsi services', 'services kya hain'])) {
      if (lang === 'urdu' && languageResponses.urdu.services) {
        response = languageResponses.urdu.services.join('\n');
      } else if (lang === 'hindi' && languageResponses.hindi.services) {
        response = languageResponses.hindi.services.join('\n');
      } else if (lang === 'arabic' && languageResponses.arabic.services) {
        response = languageResponses.arabic.services.join('\n');
      } else if (lang === 'spanish' && languageResponses.spanish.services) {
        response = languageResponses.spanish.services.join('\n');
      } else {
        response = knowledgeBase.services.join('\n');
      }
      response += `\n\nExplore all services in detail here: <a href="${pageLinks.services}" target="_blank">Services</a>`;
      chatContext.conversationStage = 'exploring';
    }
    // Check for projects/portfolio
    else if (containsAny(input, ['projects', 'portfolio', 'work', 'past projects', 'work samples', 'examples', 'case studies', 'past work', 'showcases', 'recent work', 'completed projects', 'clients', 'projects kya hain', 'portfolio dikhao', 'kaam dikhao', 'kya kaam kiya', 'clients kon', 'examples'])) {
      if (lang === 'urdu' && languageResponses.urdu.projects) {
        response = languageResponses.urdu.projects.join('\n');
      } else if (lang === 'hindi' && languageResponses.hindi.projects) {
        response = languageResponses.hindi.projects.join('\n');
      } else if (lang === 'arabic' && languageResponses.arabic.projects) {
        response = languageResponses.arabic.projects.join('\n');
      } else if (lang === 'spanish' && languageResponses.spanish.projects) {
        response = languageResponses.spanish.projects.join('\n');
      } else {
        response = knowledgeBase.projects.join('\n');
      }
      response += `\n\nSee Motasim's project portfolio here: <a href="${pageLinks.projects}" target="_blank">Projects</a>`;
      chatContext.conversationStage = 'exploring';
    }
    // Check for contact information
    else if (containsAny(input, ['contact', 'reach', 'email', 'phone', 'message', 'connect', 'get in touch', 'hire', 'call', 'text', 'phone number', 'location', 'address', 'consultation', 'contact kaise', 'contact details', 'sampark', 'rabta', 'number', 'email'])) {
      if (lang === 'urdu' && languageResponses.urdu.contact) {
        response = languageResponses.urdu.contact.join('\n');
      } else if (lang === 'hindi' && languageResponses.hindi.contact) {
        response = languageResponses.hindi.contact.join('\n');
      } else if (lang === 'arabic' && languageResponses.arabic.contact) {
        response = languageResponses.arabic.contact.join('\n');
      } else if (lang === 'spanish' && languageResponses.spanish.contact) {
        response = languageResponses.spanish.contact.join('\n');
      } else {
        response = knowledgeBase.contact.join('\n');
      }
      response += `\n\nYou can contact Motasim directly here: <a href="${pageLinks.contact}" target="_blank">Contact</a>`;
      chatContext.conversationStage = 'specific';
    }
    // Check for dynamic FAQ request
    else if (questionPatterns.faq.some(pattern => pattern.test(input))) {
      // Generate FAQs based on current context
      if (chatContext.lastTopic && dynamicFAQs[chatContext.lastTopic]) {
        generateRelatedFAQs(chatContext.lastTopic);
        if (lang === 'urdu') {
          response = "Yahan kuch aam sawalat hain jo log poochte hain:";
        } else if (lang === 'hindi') {
          response = "यहां कुछ सामान्य प्रश्न हैं जो लोग पूछते हैं:";
        } else if (lang === 'arabic') {
          response = "إليك بعض الأسئلة الشائعة التي يطرحها الناس:";
        } else if (lang === 'spanish') {
          response = "Aquí hay algunas preguntas frecuentes que la gente hace:";
        } else {
          response = "Here are some common questions people ask about this topic:";
        }
      } else {
        if (lang === 'urdu') {
          response = "Kisi specific service ke bare mein janna chahte hain? Web development, shopify, audio engineering, AI voice, AI avatar, ya graphic design ke bare mein pooch sakte hain.";
        } else if (lang === 'hindi') {
          response = "किसी विशिष्ट सेवा के बारे में जानना चाहते हैं? वेब डेवलपमेंट, शॉपिफाई, ऑडियो इंजीनियरिंग, एआई वॉइस, एआई अवतार, या ग्राफिक डिज़ाइन के बारे में पूछ सकते हैं।";
        } else if (lang === 'arabic') {
          response = "هل ترغب في معرفة المزيد عن خدمة معينة؟ يمكنك السؤال عن تطوير الويب، شوبيفاي، هندسة الصوت، الصوت الاصطناعي، الشخصيات الافتراضية أو التصميم الجرافيكي.";
        } else if (lang === 'spanish') {
          response = "¿Quieres saber más sobre un servicio específico? Puedes preguntar sobre desarrollo web, Shopify, ingeniería de audio, voz IA, avatar IA o diseño gráfico.";
        } else {
          response = "What specific service would you like to know more about? You can ask about web development, Shopify, audio engineering, AI voice, AI avatars, or graphic design.";
        }
      }
      chatContext.conversationStage = 'exploring';
    }
    // Handle pricing questions
    else if (questionPatterns.pricing.some(pattern => pattern.test(input))) {
      if (lang === 'urdu' && languageResponses.urdu.pricing) {
        response = languageResponses.urdu.pricing.join('\n');
      } else if (lang === 'hindi' && languageResponses.hindi.pricing) {
        response = languageResponses.hindi.pricing.join('\n');
      } else if (lang === 'arabic' && languageResponses.arabic.pricing) {
        response = languageResponses.arabic.pricing.join('\n');
      } else if (lang === 'spanish' && languageResponses.spanish.pricing) {
        response = languageResponses.spanish.pricing.join('\n');
      } else {
        response = "Pricing for services varies based on project scope, complexity, and timeline. For a personalized quote, please contact Motasim directly to discuss your specific requirements.";
      }
      response += `\n\nGet a quote here: <a href="${pageLinks.contact}" target="_blank">Contact for Pricing</a>`;
      chatContext.conversationStage = 'specific';
    }
    // Handle process questions
    else if (questionPatterns.process.some(pattern => pattern.test(input))) {
      const topic = detectTopicInMessage(input);
      if (lang === 'urdu' && languageResponses.urdu.process) {
        response = languageResponses.urdu.process.join('\n');
      } else if (lang === 'hindi' && languageResponses.hindi.process) {
        response = languageResponses.hindi.process.join('\n');
      } else if (lang === 'arabic' && languageResponses.arabic.process) {
        response = languageResponses.arabic.process.join('\n');
      } else if (lang === 'spanish' && languageResponses.spanish.process) {
        response = languageResponses.spanish.process.join('\n');
      } else if (topic && contextualInfo.process[topic]) {
        response = contextualInfo.process[topic].join('\n');
      } else {
        response = "Motasim follows a structured process for all projects, beginning with understanding your requirements, developing a strategy, implementation, and thorough testing before delivery.";
      }
      chatContext.conversationStage = 'specific';
    }
    // Handle service-specific questions based on keywords
    else {
      const detectedTopic = detectTopicInMessage(input);
      
      if (detectedTopic !== null) {
        chatContext.lastTopic = detectedTopic;
        if (lang === 'urdu' && languageResponses.urdu[detectedTopic]) {
          response = languageResponses.urdu[detectedTopic].join('\n');
        } else if (lang === 'hindi' && languageResponses.hindi[detectedTopic]) {
          response = languageResponses.hindi[detectedTopic].join('\n');
        } else if (lang === 'arabic' && languageResponses.arabic[detectedTopic]) {
          response = languageResponses.arabic[detectedTopic].join('\n');
        } else if (lang === 'spanish' && languageResponses.spanish[detectedTopic]) {
          response = languageResponses.spanish[detectedTopic].join('\n');
        } else {
          response = createTopicResponse(detectedTopic, input);
        }
        chatContext.conversationStage = 'specific';
        
        // Generate relevant FAQs
        generateRelatedFAQs(detectedTopic);
      } else if (chatContext.lastTopic && chatContext.conversationStage === 'specific') {
        // Continue discussion about the last topic if we're in a specific conversation
        response = createFollowUpResponse(chatContext.lastTopic, input);
      } else {
        // Generic response for unrecognized queries
        if (lang === 'urdu') {
          response = "Mein aapki madad kar sakta hoon Motasim Billah ki services ke baare mein. Aap web development, Shopify store design, audio engineering, AI voice technology, AI avatars, ya graphic design ke baare mein pooch sakte hain. Kya jaanna chahte hain?";
        } else if (lang === 'hindi') {
          response = "मैं आपकी मदद कर सकता हूं Motasim Billah की सेवाओं के बारे में। आप वेब डेवलपमेंट, शॉपिफाई स्टोर डिज़ाइन, ऑडियो इंजीनियरिंग, AI वॉयस टेक्नोलॉजी, AI अवतार, या ग्राफिक डिज़ाइन के बारे में पूछ सकते हैं। क्या जानना चाहते हैं?";
        } else if (lang === 'arabic') {
          response = "يمكنني مساعدتك بخصوص خدمات معتصم بالله. يمكنك السؤال عن تطوير الويب، تصميم متجر شوبيفاي، هندسة الصوت، تقنية الصوت الاصطناعي، الشخصيات الافتراضية، أو التصميم الجرافيكي. ما الذي ترغب في معرفته؟";
        } else if (lang === 'spanish') {
          response = "Puedo ayudarte con información sobre los servicios de Motasim Billah. Puedes preguntar sobre desarrollo web, diseño de tiendas Shopify, ingeniería de audio, tecnología de voz IA, avatares IA o diseño gráfico. ¿Qué te gustaría saber?";
        } else {
          response = "I'd be happy to help you learn more about Motasim's services. You can ask about web development, Shopify stores, audio engineering, AI voice technology, AI avatars, or graphic design. What interests you?";
        }
        chatContext.conversationStage = 'exploring';
      }
    }
    
    // Always add relevant links based on the content of the message
    response = addRelevantLinks(input, response, detectedTopics(input));
    
    return response;
  }
  
  // Update chat context based on user input
  function updateChatContext(message) {
    const lowerMessage = message.toLowerCase();
    
    // Track mentioned topics
    const topics = detectedTopics(lowerMessage);
    if (topics.length > 0) {
      topics.forEach(topic => {
        if (!chatContext.mentionedTopics.includes(topic)) {
          chatContext.mentionedTopics.push(topic);
        }
      });
    }
    
    // Detect question type
    for (const [type, patterns] of Object.entries(questionPatterns)) {
      if (patterns.some(pattern => pattern.test(lowerMessage))) {
        chatContext.questionType = type;
        break;
      }
    }
  }
  
  // Create a follow-up response based on previous context
  function createFollowUpResponse(topic, message) {
    const lowerMessage = message.toLowerCase();
    let response = '';
    
    // If user prefers Urdu, give Urdu response when available
    if (chatContext.userPreferences.language === 'urdu' && languageResponses.urdu[topic]) {
      response = "Motasim Billah is service mein expert hain. Aap unse specific details aur pricing ke liye directly contact kar sakte hain.";
      return response;
    }
    
    // Similar for other languages
    if (chatContext.userPreferences.language === 'hindi' && languageResponses.hindi[topic]) {
      response = "Motasim Billah इस सेवा में विशेषज्ञ हैं। आप विशिष्ट विवरण और मूल्य निर्धारण के लिए सीधे उनसे संपर्क कर सकते हैं।";
      return response;
    }
    
    if (chatContext.userPreferences.language === 'arabic' && languageResponses.arabic[topic]) {
      response = "معتصم بالله خبير في هذه الخدمة. يمكنك التواصل معه مباشرة للحصول على تفاصيل محددة والأسعار.";
      return response;
    }
    
    if (chatContext.userPreferences.language === 'spanish' && languageResponses.spanish[topic]) {
      response = "Motasim Billah es experto en este servicio. Puedes contactarlo directamente para detalles específicos y precios.";
      return response;
    }
    
    // Check if the message contains any specific subtopic keywords
    if (topic === 'webDevelopment') {
      if (containsAny(lowerMessage, ['code', 'coding', 'html', 'css', 'javascript', 'development'])) {
        response = "Motasim specializes in clean, efficient frontend code using HTML5, CSS3, and JavaScript. He creates responsive websites that work perfectly across all devices and browsers, with attention to performance optimization.";
      } else if (containsAny(lowerMessage, ['responsive', 'mobile', 'tablet', 'device', 'screen size'])) {
        response = "Responsive design is at the core of Motasim's development approach. He creates websites that adapt beautifully to any screen size, ensuring optimal user experience whether on desktop, tablet, or mobile devices.";
      } else if (containsAny(lowerMessage, ['animation', 'animate', 'movement', 'transition', 'gsap'])) {
        response = "Motasim creates engaging animations using GSAP (GreenSock Animation Platform) that enhance user experience while maintaining performance. These animations guide user attention and create memorable interactions.";
      } else if (containsAny(lowerMessage, ['speed', 'performance', 'fast', 'loading', 'optimize'])) {
        response = "Website speed is crucial for both user experience and SEO. Motasim optimizes all websites for maximum performance through efficient code, image optimization, lazy loading, and minimizing HTTP requests.";
      }
    } else if (topic === 'shopify') {
      if (containsAny(lowerMessage, ['conversion', 'convert', 'sales', 'revenue', 'customers'])) {
        response = "Motasim designs Shopify stores with conversion optimization as the primary goal. He implements strategic product page layouts, persuasive call-to-action elements, streamlined checkout processes, and trust indicators that transform visitors into customers.";
      } else if (containsAny(lowerMessage, ['custom', 'customize', 'unique', 'modification', 'tailor'])) {
        response = "Motasim specializes in customizing Shopify themes to perfectly reflect your brand identity. From custom sections and features to specialized functionality, he ensures your store stands out from template-based competitors.";
      } else if (containsAny(lowerMessage, ['mobile', 'phone', 'tablet', 'responsive', 'device'])) {
        response = "With over 70% of e-commerce traffic coming from mobile devices, Motasim creates Shopify stores with a mobile-first approach, ensuring seamless shopping experiences across all devices with touch-friendly navigation and optimized layouts.";
      }
    } else if (topic === 'audioEngineering') {
      if (containsAny(lowerMessage, ['mix', 'mixing', 'balance', 'levels', 'eq'])) {
        response = "Motasim's mixing expertise balances all elements of your audio with precision, creating clarity and definition. Using advanced equalization, compression, and spatial processing, he ensures vocals sit perfectly in the mix while maintaining the integrity of all sounds.";
      } else if (containsAny(lowerMessage, ['master', 'mastering', 'finalize', 'polish', 'commercial'])) {
        response = "Professional mastering is the final polish that makes your audio sound commercial-quality. Motasim applies subtle but effective processing to enhance loudness, depth, and consistency across all playback systems.";
      } else if (containsAny(lowerMessage, ['restore', 'fix', 'repair', 'clean', 'noise'])) {
        response = "Motasim specializes in audio restoration to recover and enhance recordings with issues. Using specialized tools, he can remove background noise, fix clipping, eliminate hum and buzz, and restore clarity to problematic audio.";
      }
    } else if (topic === 'aiVoiceover') {
      if (containsAny(lowerMessage, ['natural', 'human', 'realistic', 'life-like', 'real'])) {
        response = "Motasim creates AI voiceovers that sound remarkably human, with natural intonation, appropriate pacing, and emotional resonance. Using cutting-edge neural voice technology, these voiceovers avoid the robotic qualities associated with older text-to-speech systems.";
      } else if (containsAny(lowerMessage, ['language', 'languages', 'multilingual', 'translate', 'accent'])) {
        response = "Motasim offers AI voiceovers in numerous languages and accents without the need to hire separate voice talents, ensuring consistent brand representation across global markets with authentic-sounding localization.";
      } else if (containsAny(lowerMessage, ['commercial', 'advertisement', 'ad', 'marketing', 'promotion'])) {
        response = "For commercial advertisements, Motasim creates compelling AI voiceovers that capture attention and convey your message with the perfect tone and emphasis, helping your products and services stand out in a crowded marketplace.";
      }
    } else if (topic === 'aiAvatar') {
      if (containsAny(lowerMessage, ['realistic', 'real', 'human-like', 'lifelike', 'natural'])) {
        response = "Motasim creates hyper-realistic AI avatars with natural facial expressions, fluid movements, and lifelike appearances. These digital humans bridge the uncanny valley with subtle details like micro-expressions, natural eye movement, and realistic skin textures.";
      } else if (containsAny(lowerMessage, ['business', 'corporate', 'professional', 'company', 'brand'])) {
        response = "AI avatars transform how businesses present information. Motasim designs custom avatars that deliver your message with professional presence, consistent branding, and engaging visual communication that captures and maintains viewer attention.";
      } else if (containsAny(lowerMessage, ['customize', 'custom', 'personalize', 'tailored', 'specific'])) {
        response = "Beyond stock avatars, Motasim can create customized AI presenters that align with your brand identity, matching specific demographic characteristics, clothing styles, backgrounds, and presentation mannerisms to your exact requirements.";
      }
    } else if (topic === 'graphicDesign') {
      if (containsAny(lowerMessage, ['social', 'instagram', 'facebook', 'media', 'posts'])) {
        response = "Motasim designs eye-catching social media graphics that stop the scroll and drive engagement. His designs are optimized for each platform's unique requirements and audience expectations, helping your brand stand out in crowded feeds.";
      } else if (containsAny(lowerMessage, ['brand', 'branding', 'identity', 'logo', 'consistent'])) {
        response = "Consistent visual branding builds recognition and trust. Motasim creates cohesive design systems in Canva that establish your visual identity across all platforms, from social media to marketing materials, ensuring instant brand recognition.";
      } else if (containsAny(lowerMessage, ['marketing', 'promotion', 'advertise', 'campaign', 'sales'])) {
        response = "Effective marketing materials convert prospects into customers. Motasim creates persuasive visual designs that communicate your value proposition clearly and compellingly, with strategic use of color, typography, and imagery to guide viewer action.";
      }
    }
    
    // If no specific subtopic is detected, provide a general response about the topic
    if (!response) {
      response = `Motasim has extensive expertise in ${topic.replace(/([A-Z])/g, ' $1').toLowerCase()}. Is there a specific aspect you'd like to know more about?`;
    }
    
    return response;
  }
  
  // Function to detect the main topic in a message
  function detectTopicInMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Check each topic area
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.webDevKeywords)) {
      return 'webDevelopment';
    }
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.shopifyKeywords)) {
      return 'shopify';
    }
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.audioKeywords)) {
      return 'audioEngineering';
    }
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.aiVoiceKeywords)) {
      return 'aiVoiceover';
    }
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.aiAvatarKeywords)) {
      return 'aiAvatar';
    }
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.designKeywords)) {
      return 'graphicDesign';
    }
    
    return null;
  }
  
  // Helper function for more accurate topic detection
  function detectedTopics(message) {
    const lowerMessage = message.toLowerCase();
    const topics = [];
    
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.webDevKeywords)) {
      topics.push('webDevelopment');
    }
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.shopifyKeywords)) {
      topics.push('shopify');
    }
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.audioKeywords)) {
      topics.push('audioEngineering');
    }
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.aiVoiceKeywords)) {
      topics.push('aiVoiceover');
    }
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.aiAvatarKeywords)) {
      topics.push('aiAvatar');
    }
    if (containsAnyFromArray(lowerMessage, extendedKnowledge.designKeywords)) {
      topics.push('graphicDesign');
    }
    
    return topics;
  }
  
  // Create a topic-specific response
  function createTopicResponse(topic, message) {
    let response = '';
    
    // Get basic information about the topic
    switch(topic) {
      case 'webDevelopment':
        response = knowledgeBase.webDevelopment.join('\n');
        break;
      case 'shopify':
        response = knowledgeBase.shopify.join('\n');
        break;
      case 'audioEngineering':
        response = knowledgeBase.audioEngineering.join('\n');
        break;
      case 'aiVoiceover':
        response = knowledgeBase.aiVoiceover.join('\n');
        break;
      case 'aiAvatar':
        response = knowledgeBase.aiAvatar.join('\n');
        break;
      case 'graphicDesign':
        response = knowledgeBase.graphicDesign.join('\n');
        break;
      default:
        response = "I'd be happy to tell you about Motasim's services. What specific area are you interested in?";
    }
    
    return response;
  }
  
  // Add relevant links based on the content of the message
  function addRelevantLinks(message, response, detectedTopics) {
    // If no topics were detected or links are already in the response, return as is
    if (detectedTopics.length === 0 || response.includes('href=')) {
      return response;
    }
    
    // Add service links section
    response += "\n\n====================\n";
    if (chatContext.userPreferences.language === 'urdu') {
      response += "Motasim ki services ke baare mein mazeed jaanein:";
    } else if (chatContext.userPreferences.language === 'hindi') {
      response += "Motasim की सेवाओं के बारे में अधिक जानें:";
    } else if (chatContext.userPreferences.language === 'arabic') {
      response += "تعرف على المزيد حول خدمات معتصم:";
    } else if (chatContext.userPreferences.language === 'spanish') {
      response += "Aprende más sobre los servicios de Motasim:";
    } else {
      response += "Learn more about Mutasim's services:";
    }
    
    // Add links based on detected topics
    if (detectedTopics.includes('webDevelopment')) {
      response += `\n• <a href="${pageLinks.webDevelopment}" target="_blank">Web Development Services</a>`;
      response += `\n• <a href="${pageLinks.webDevelopmentBlog}" target="_blank">Read about UI/UX Design</a>`;
    }
    
    if (detectedTopics.includes('shopify')) {
      response += `\n• <a href="${pageLinks.shopify}" target="_blank">Shopify Store Design</a>`;
      response += `\n• <a href="${pageLinks.shopifyBlog}" target="_blank">E-commerce Design Tips</a>`;
      response += `\n• <a href="${pageLinks.improveShopifyBlog}" target="_blank">Improve Your Shopify Store</a>`;
    }
    
    if (detectedTopics.includes('audioEngineering')) {
      response += `\n• <a href="${pageLinks.audioEngineering}" target="_blank">Audio Engineering Services</a>`;
      response += `\n• <a href="${pageLinks.audioEngineeringBlog}" target="_blank">Audio Engineering Techniques</a>`;
    }
    
    if (detectedTopics.includes('aiVoiceover')) {
      response += `\n• <a href="${pageLinks.aiVoiceover}" target="_blank">AI Voiceover Services</a>`;
      response += `\n• <a href="${pageLinks.aiVoiceBlog}" target="_blank">AI Voice Technology</a>`;
      response += `\n• <a href="${pageLinks.aiVoiceoversArticle}" target="_blank">AI Voiceovers in 2025</a>`;
    }
    
    if (detectedTopics.includes('aiAvatar')) {
      response += `\n• <a href="${pageLinks.aiAvatar}" target="_blank">AI Avatar Creation</a>`;
      response += `\n• <a href="${pageLinks.aiAvatarBlog}" target="_blank">AI Avatars for Business</a>`;
      response += `\n• <a href="${pageLinks.aiAvatarsArticle}" target="_blank">Hyper-Realistic Digital Humans</a>`;
    }
    
    if (detectedTopics.includes('graphicDesign')) {
      response += `\n• <a href="${pageLinks.graphicDesign}" target="_blank">Graphic Design Services</a>`;
      response += `\n• <a href="${pageLinks.graphicDesignBlog}" target="_blank">Professional Designs with Canva</a>`;
    }
    
    // Add contact link based on language
    if (chatContext.userPreferences.language === 'urdu') {
      response += `\n\nMutasim se contact karein: <a href="${pageLinks.contact}" target="_blank">Contact</a>`;
    } else if (chatContext.userPreferences.language === 'hindi') {
      response += `\n\nMutasim से संपर्क करें: <a href="${pageLinks.contact}" target="_blank">संपर्क करें</a>`;
    } else if (chatContext.userPreferences.language === 'arabic') {
      response += `\n\nتواصل مع معتصم: <a href="${pageLinks.contact}" target="_blank">اتصال</a>`;
    } else if (chatContext.userPreferences.language === 'spanish') {
      response += `\n\nContacta con Mutasim: <a href="${pageLinks.contact}" target="_blank">Contacto</a>`;
    } else {
      response += `\n\nContact Mutasim: <a href="${pageLinks.contact}" target="_blank">Get in Touch</a>`;
    }
    
    return response;
  }

  // Helper function to check if a string contains any of the given terms
  function containsAny(str, terms) {
    return terms.some(term => str.includes(term));
  }
  
  // Helper function to check if a string contains any terms from an array
  function containsAnyFromArray(str, terms) {
    return terms.some(term => str.includes(term));
  }
  
  // Get a random response from an array
  function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  console.log('Chatbot fully initialized');
}

// Manual console debugging helper
console.log('Chatbot script loaded');