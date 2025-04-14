// Enhanced Chatbot.js with AI-like smart features

// Knowledge Base for the chatbot
const knowledgeBase = {
  services: [
    "Muatasim offers several professional services including:",
    "• Frontend Web Development with HTML, CSS, and JavaScript",
    "• Custom Shopify Store Design",
    "• Professional Audio Engineering",
    "• AI Voiceover Creation",
    "• AI Avatar Creation",
    "• Canva Design and Graphics"
  ],
  skills: [
    "Muatasim's core skills include:",
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
    "You can contact Muatasim through:",
    "• Email: Meharmahalcoll@gmail.com",
    "• Phone number: 03088754565",
    "• Also in social links that include in website)"
  ],
  webDevelopment: [
    "Muatasim specializes in frontend web development using HTML, CSS, and JavaScript, creating responsive websites with modern designs and smooth animations.",
    "His projects feature:",
    "• Responsive web design that adapts to all screen sizes",
    "• Interactive UI/UX with GSAP animations",
    "• Performance optimization for fast loading",
    "• Modern CSS techniques including Grid and Flexbox"
  ],
  shopify: [
    "Muatasim is an expert in custom Shopify store design, providing high-converting e-commerce solutions with:",
    "• Distinctive branding and visual aesthetics",
    "• Intuitive navigation and user experience",
    "• Optimized conversion funnels",
    "• Custom product pages and collections",
    "• Mobile-first responsive design"
  ],
  audioEngineering: [
    "Muatasim provides professional audio engineering services including:",
    "• Music production and mixing",
    "• Podcast editing and enhancement",
    "• Sound design for videos",
    "• Audio post-production",
    "• Voice processing and cleanup"
  ],
  aiVoiceover: [
    "Muatasim offers AI voiceover services using cutting-edge neural voice technology to create ultra-realistic voiceovers for:",
    "• Commercial advertisements",
    "• Explainer videos",
    "• E-learning content",
    "• IVR systems",
    "• Audiobooks and narration",
    "These sound virtually indistinguishable from human recordings."
  ],
  aiAvatar: [
    "Muatasim creates lifelike AI talking avatars for:",
    "• Business presentations",
    "• Marketing videos",
    "• Educational content",
    "• Virtual spokespeople",
    "• Social media content",
    "These AI avatars provide engaging visual representation with synchronized lip movements and natural expressions."
  ],
  graphicDesign: [
    "Muatasim offers professional Canva design services for:",
    "• Social media posts and stories",
    "• Brand identity packages",
    "• Marketing materials",
    "• Presentations and pitch decks",
    "• Print materials and digital products",
    "His designs help businesses establish a consistent and professional visual identity that resonates with their target audience."
  ],
  
  // Conversational responses
  greetings: [
    "Hello! How can I help you with Muatasim's portfolio today?",
    "Hi there! I'm Muatasim's portfolio assistant. What would you like to know?",
    "Welcome! How can I assist you with information about Muatasim's services?",
    "Greetings! I'd be happy to tell you about Muatasim's work. What are you interested in?"
  ],
  howAreYou: [
    "I'm doing great, thanks for asking! How can I help you learn about Muatasim's services today?",
    "I'm excellent! Ready to assist you with information about Muatasim's portfolio. What would you like to know?",
    "I'm functioning perfectly! What information about Muatasim's work are you looking for?"
  ],
  thanks: [
    "You're welcome! Is there anything else you'd like to know about Muatasim's services?",
    "My pleasure! Let me know if you need any other information about Muatasim's work.",
    "Happy to help! Feel free to ask if you have more questions about Muatasim's portfolio."
  ],
  goodbye: [
    "Goodbye! Feel free to return if you have more questions about Muatasim's services.",
    "Take care! If you need more information about Muatasim's work in the future, I'll be here.",
    "Farewell! Don't hesitate to reach out again if you need details about Muatasim's portfolio."
  ],
  about: [
    "Muatasim Billah is a skilled professional specializing in web development, e-commerce design, audio engineering, AI voice technology, and graphic design.",
    "With years of experience, Muatasim has helped numerous clients achieve their digital goals through creative solutions and technical expertise.",
    "His portfolio showcases a diverse range of projects that highlight his versatility and commitment to quality."
  ]
};

// Extended knowledge base for smart topic detection
const extendedKnowledge = {
  webDevKeywords: [
    "responsive", "mobile", "website", "css", "html", "javascript", "animation", "design", 
    "interactive", "frontend", "web development", "loading speed", "optimize", "browser", 
    "cross-browser", "layout", "grid", "flexbox", "navigation", "menu", "ui", "ux", "user interface"
  ],
  shopifyKeywords: [
    "ecommerce", "e-commerce", "online store", "shopify", "products", "shopping cart", "checkout", 
    "shop", "inventory", "merchant", "sell online", "digital store", "conversion rate", "sales", 
    "payment gateway", "product page", "collection", "store design", "theme", "template", "commerce"
  ],
  audioKeywords: [
    "sound", "audio", "podcast", "mixing", "mastering", "voice", "recording", "music", "song", 
    "production", "soundtrack", "voiceover", "narration", "editing", "audio engineer", "track", 
    "sound design", "background music", "studio", "microphone", "audio quality", "sound effects"
  ],
  aiVoiceKeywords: [
    "ai voice", "voice synthesis", "voiceover", "narration", "artificial voice", "text to speech", 
    "tts", "digital voice", "voice ai", "voice talent", "voice actor", "synthetic voice", "neural voice", 
    "speech synthesis", "generated voice", "voice clone", "audio generation", "speaking voice"
  ],
  aiAvatarKeywords: [
    "digital human", "virtual character", "talking head", "ai avatar", "digital avatar", "virtual presenter", 
    "avatar", "animated character", "3d character", "virtual spokesperson", "digital presenter", 
    "animated face", "talking avatar", "synthetic video", "ai video", "avatar animation", "character animation"
  ],
  designKeywords: [
    "graphic design", "canva", "social media design", "branding", "logo", "visual identity", "brand identity", 
    "design", "graphics", "illustration", "poster", "flyer", "banner", "presentation", "social post", 
    "instagram", "facebook", "marketing design", "visual", "color scheme", "typography", "layout design"
  ]
};

// Common questions and patterns with variations for better matching
const questionPatterns = {
  pricing: [
    /how much/i, /pricing/i, /price/i, /cost/i, /rates/i, /fee/i, /charge/i, /pay/i, /package/i, 
    /quote/i, /estimate/i, /budget/i, /afford/i, /expensive/i, /cheap/i
  ],
  process: [
    /process/i, /how does it work/i, /steps/i, /procedure/i, /how do you/i, /workflow/i, /method/i, 
    /approach/i, /start/i, /begin/i, /first step/i
  ],
  portfolio: [
    /portfolio/i, /work/i, /projects/i, /example/i, /past work/i, /showcase/i, /samples/i, 
    /previous/i, /clients/i, /done before/i, /made/i, /created/i
  ],
  timeline: [
    /how long/i, /timeline/i, /deadline/i, /turnaround/i, /deliver/i, /when/i, /time frame/i, 
    /duration/i, /finish/i, /complete/i, /ready by/i, /days/i, /weeks/i, /months/i
  ],
  experience: [
    /experience/i, /background/i, /qualification/i, /expert/i, /years/i, /how many/i, 
    /skilled/i, /proficient/i, /professional/i, /history/i, /past/i, /worked in/i
  ],
  contact: [
    /contact/i, /reach/i, /email/i, /phone/i, /call/i, /message/i, /get in touch/i, 
    /connect/i, /talk/i, /discuss/i, /consultation/i, /meeting/i, /appointment/i
  ]
};

// Contextual information responses
const contextualInfo = {
  benefit: {
    webDevelopment: [
      "A responsive website designed by Muatasim will help your business:",
      "• Increase online visibility and attract more visitors",
      "• Create a professional first impression that builds trust",
      "• Provide a seamless experience across all devices",
      "• Load quickly, reducing bounce rates and improving SEO",
      "• Convert more visitors into leads or customers with intuitive navigation"
    ],
    shopify: [
      "Muatasim's custom Shopify store design services will help your business:",
      "• Increase conversion rates with optimized checkout flows",
      "• Build customer trust with professional, branded design",
      "• Stand out from competitors with unique, custom features",
      "• Improve mobile shopping experience for the growing mobile audience",
      "• Integrate seamlessly with marketing tools to drive more sales"
    ],
    audioEngineering: [
      "Professional audio engineering by Muatasim benefits your projects by:",
      "• Enhancing overall sound quality and clarity",
      "• Creating a polished, professional impression that builds credibility",
      "• Improving listener engagement and retention with clean, balanced audio",
      "• Eliminating distracting background noise and audio issues",
      "• Ensuring consistent volume levels across all content"
    ],
    aiVoiceover: [
      "Muatasim's AI voiceover services provide advantages like:",
      "• Cost-effective alternative to hiring voice actors for multiple projects",
      "• Quick turnaround times for urgent deadlines",
      "• Consistency in voice across all your marketing materials",
      "• Multiple language options without hiring additional voice talent",
      "• Easy revisions without scheduling re-recording sessions"
    ],
    aiAvatar: [
      "Using Muatasim's AI avatars for your business provides benefits such as:",
      "• Creating engaging video content without filming equipment or studio",
      "• Maintaining consistent brand representation across all videos",
      "• Easily updating content without re-shoots when information changes",
      "• Multi-language capabilities for global audience reach",
      "• Professional video presence without the anxiety of being on camera"
    ],
    graphicDesign: [
      "Muatasim's Canva design services help your business by:",
      "• Creating consistent visual branding that increases recognition",
      "• Designing eye-catching social media graphics that improve engagement",
      "• Producing professional marketing materials that convert prospects",
      "• Developing presentations that effectively communicate your message",
      "• Quick turnaround on visual assets for time-sensitive campaigns"
    ]
  },
  process: {
    webDevelopment: [
      "Muatasim's web development process includes:",
      "1. Discovery - Understanding your business goals and target audience",
      "2. Planning - Creating sitemaps and wireframes for optimal user flow",
      "3. Design - Developing visual mockups for your approval",
      "4. Development - Building the responsive frontend with HTML, CSS, and JavaScript",
      "5. Testing - Ensuring compatibility across browsers and devices",
      "6. Launch - Deploying the website and providing training"
    ],
    shopify: [
      "For Shopify store design, Muatasim follows this process:",
      "1. Strategy - Analyzing your products, audience, and competition",
      "2. Structure - Planning the store architecture and user flows",
      "3. Design - Creating custom mockups of key pages",
      "4. Development - Building and customizing your Shopify store",
      "5. Testing - Ensuring all features work properly and checking checkout process",
      "6. Launch - Setting up analytics and providing store management training"
    ],
    audioEngineering: [
      "Muatasim's audio engineering process includes:",
      "1. Consultation - Understanding your audio needs and desired outcome",
      "2. Assessment - Evaluating your raw audio files",
      "3. Editing - Removing mistakes, gaps, and unwanted noise",
      "4. Mixing - Balancing levels and applying appropriate effects",
      "5. Mastering - Finalizing for optimal playback across devices",
      "6. Delivery - Providing files in your required format"
    ],
    aiVoiceover: [
      "For AI voiceover creation, Muatasim's process involves:",
      "1. Script Review - Ensuring your script is optimized for voice generation",
      "2. Voice Selection - Choosing the perfect AI voice for your project",
      "3. Initial Generation - Creating the first version of your voiceover",
      "4. Refinement - Adjusting pronunciation, pacing, and emphasis",
      "5. Post-Processing - Enhancing the audio quality and naturalness",
      "6. Delivery - Providing the final audio in your preferred format"
    ],
    aiAvatar: [
      "Muatasim creates AI avatars through this process:",
      "1. Concept - Discussing your avatar needs and selecting a base character",
      "2. Script Preparation - Creating or refining your script for optimal delivery",
      "3. Voice Generation - Creating the audio component",
      "4. Avatar Animation - Generating the synchronized visual avatar",
      "5. Post-Production - Adding backgrounds, music, and graphics as needed",
      "6. Delivery - Providing the final video in your required format"
    ],
    graphicDesign: [
      "For Canva design projects, Muatasim follows these steps:",
      "1. Brief - Understanding your brand, target audience, and design needs",
      "2. Concept - Creating initial design concepts for your feedback",
      "3. Development - Refining the approved concept with detailed execution",
      "4. Revisions - Making adjustments based on your feedback",
      "5. Finalization - Polishing the designs and preparing final files",
      "6. Delivery - Providing files in the formats you need"
    ]
  }
};

// Suggested questions for the user (dynamic based on conversation)
const suggestedQuestionSets = {
  initial: [
    "What services do you offer?",
    "Tell me about your web development",
    "What are your skills?",
    "How can I contact you?",
    "Show me your projects"
  ],
  webDevelopment: [
    "What types of websites do you create?",
    "How long does a website project take?",
    "What's your process for web development?",
    "Can you show examples of your websites?",
    "What are the benefits of a custom website?"
  ],
  shopify: [
    "How can you improve my Shopify store?",
    "What's included in your Shopify services?",
    "How long does a Shopify project take?",
    "Can you show examples of your Shopify work?",
    "What makes your Shopify designs convert better?"
  ],
  audioEngineering: [
    "What audio services do you provide?",
    "Can you help with podcast editing?",
    "What's your process for audio projects?",
    "How do you improve sound quality?",
    "What audio equipment do you use?"
  ],
  aiVoiceover: [
    "How realistic are your AI voiceovers?",
    "What languages do your AI voices support?",
    "How quickly can you create AI voiceovers?",
    "Can I hear samples of your AI voices?",
    "What's the process for creating AI voiceovers?"
  ],
  aiAvatar: [
    "How realistic are your AI avatars?",
    "What can I use AI avatars for?",
    "How long does it take to create an AI avatar?",
    "Can I see examples of your AI avatars?",
    "Can the avatars speak in multiple languages?"
  ],
  graphicDesign: [
    "What design services do you offer?",
    "Can you create designs for social media?",
    "What's your design process like?",
    "Can you show examples of your design work?",
    "Do you create logos and branding?"
  ],
  afterResponse: [
    "Tell me more about your services",
    "How can we work together?",
    "What's your pricing structure?",
    "How soon can you start?",
    "Can I see more examples of your work?"
  ]
};

// Initial greeting message from the bot
const initialMessage = "👋 Hi there! I'm Muatasim's portfolio assistant. How can I help you today?";

// Main enhanced chatbot class
class EnhancedChatBot {
  constructor() {
    this.chatToggleBtn = document.querySelector('.chat-toggle-btn');
    this.chatInterface = document.querySelector('.chat-interface');
    this.chatForm = document.getElementById('chat-form');
    this.chatInput = document.getElementById('chat-input');
    this.chatMessages = document.querySelector('.chat-messages');
    this.suggestedQuestionsContainer = document.querySelector('.suggested-questions');
    this.chatCloseBtn = document.querySelector('.chat-close-btn');
    
    this.isChatOpen = false;
    this.isTyping = false;
    this.messages = [];
    
    // State tracking for smarter responses
    this.currentTopic = null;
    this.consecutiveTopics = [];
    this.userInterests = new Set();
    this.detectedIntents = new Set();
    this.conversationStage = 'greeting';
    this.questionCount = 0;
    this.sentimentScore = 0;
    this.userConfusion = 0;
    
    this.initEventListeners();
    this.sendBotMessage(initialMessage);
    this.displaySuggestedQuestions(suggestedQuestionSets.initial);
  }
  
  initEventListeners() {
    // Toggle chat open/close
    this.chatToggleBtn.addEventListener('click', () => this.toggleChat());
    
    // Close chat with minimize button
    this.chatCloseBtn.addEventListener('click', () => this.toggleChat());
    
    // Handle form submission
    this.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = this.chatInput.value.trim();
      if (message) {
        this.sendUserMessage(message);
        this.chatInput.value = '';
      }
    });
    
    // Live typing suggestions (shows relevant info as user types)
    this.chatInput.addEventListener('input', () => {
      this.provideLiveTypingHelp();
    });
    
    // Handle suggested question clicks
    this.suggestedQuestionsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggested-question')) {
        this.sendUserMessage(e.target.textContent);
      }
    });
    
    // Close chat when pressing ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isChatOpen) {
        this.toggleChat();
      }
    });
    
    // Focus input when chat is opened
    document.addEventListener('chatOpened', () => {
      setTimeout(() => this.chatInput.focus(), 300);
    });
  }
  
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    
    if (this.isChatOpen) {
      this.chatInterface.classList.add('active');
      this.chatToggleBtn.classList.add('active');
      document.dispatchEvent(new Event('chatOpened'));
      
      // If first time opening, show welcome animation
      if (this.messages.length <= 1) {
        this.chatInterface.classList.add('first-open');
        setTimeout(() => {
          this.chatInterface.classList.remove('first-open');
        }, 1000);
      }
    } else {
      this.chatInterface.classList.remove('active');
      this.chatToggleBtn.classList.remove('active');
    }
  }
  
  sendUserMessage(text) {
    // Add user message to UI
    this.addMessageToUI(text, true);
    
    // Save to messages array
    this.messages.push({ text, isUser: true });
    
    // Analyze user's message for topic and sentiment
    this.analyzeUserMessage(text);
    
    // Increment question count
    this.questionCount++;
    
    // Update conversation stage
    if (this.questionCount > 3) {
      this.conversationStage = 'engaged';
    }
    
    // Show typing indicator with variable timing based on message complexity
    this.showTypingIndicator();
    
    // Response time varies based on complexity of the question
    const responseTime = this.calculateResponseTime(text);
    
    // Generate response after a delay
    setTimeout(() => {
      const response = this.generateSmartResponse(text);
      this.sendBotMessage(response);
      
      // Update suggested questions based on the new context
      this.updateSuggestedQuestions(text, response);
    }, responseTime);
  }
  
  calculateResponseTime(text) {
    // Base response time
    let baseTime = 1000;
    
    // Add time based on message length (longer messages take longer to "read")
    const lengthFactor = Math.min(text.length * 10, 1000);
    
    // Add random variation to seem more natural
    const randomVariation = Math.random() * 500;
    
    return baseTime + lengthFactor + randomVariation;
  }
  
  analyzeUserMessage(text) {
    const message = text.toLowerCase();
    
    // Topic detection
    this.detectTopic(message);
    
    // Intent detection
    this.detectIntent(message);
    
    // Sentiment analysis (very simple)
    this.analyzeSentiment(message);
    
    // Check for confusion
    this.detectConfusion(message);
    
    // Track user interests for personalization
    this.trackUserInterests(message);
  }
  
  detectTopic(message) {
    // Check each topic area for keyword matches
    let topicScores = {
      webDevelopment: 0,
      shopify: 0,
      audioEngineering: 0,
      aiVoiceover: 0,
      aiAvatar: 0,
      graphicDesign: 0
    };
    
    // Add score for each matching keyword
    extendedKnowledge.webDevKeywords.forEach(keyword => {
      if (message.includes(keyword.toLowerCase())) topicScores.webDevelopment++;
    });
    
    extendedKnowledge.shopifyKeywords.forEach(keyword => {
      if (message.includes(keyword.toLowerCase())) topicScores.shopify++;
    });
    
    extendedKnowledge.audioKeywords.forEach(keyword => {
      if (message.includes(keyword.toLowerCase())) topicScores.audioEngineering++;
    });
    
    extendedKnowledge.aiVoiceKeywords.forEach(keyword => {
      if (message.includes(keyword.toLowerCase())) topicScores.aiVoiceover++;
    });
    
    extendedKnowledge.aiAvatarKeywords.forEach(keyword => {
      if (message.includes(keyword.toLowerCase())) topicScores.aiAvatar++;
    });
    
    extendedKnowledge.designKeywords.forEach(keyword => {
      if (message.includes(keyword.toLowerCase())) topicScores.graphicDesign++;
    });
    
    // Find the topic with the highest score
    let maxScore = 0;
    let detectedTopic = null;
    
    for (const [topic, score] of Object.entries(topicScores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedTopic = topic;
      }
    }
    
    // Only update topic if score is above threshold
    if (maxScore > 0) {
      // Track consecutive mentions of the same topic
      if (this.currentTopic === detectedTopic) {
        this.consecutiveTopics.push(detectedTopic);
      } else {
        this.consecutiveTopics = [detectedTopic];
      }
      
      this.currentTopic = detectedTopic;
    }
  }
  
  detectIntent(message) {
    // Check for common question patterns
    for (const [intent, patterns] of Object.entries(questionPatterns)) {
      for (const pattern of patterns) {
        if (message.match(pattern)) {
          this.detectedIntents.add(intent);
          break;
        }
      }
    }
  }
  
  analyzeSentiment(message) {
    // Very simple sentiment analysis
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'like', 'helpful', 'thanks', 'thank', 'awesome', 'wonderful', 'best'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'hate', 'dislike', 'useless', 'waste', 'worst', 'expensive', 'complicated', 'confusing'];
    
    let score = 0;
    
    positiveWords.forEach(word => {
      if (message.includes(word)) score += 1;
    });
    
    negativeWords.forEach(word => {
      if (message.includes(word)) score -= 1;
    });
    
    // Update overall sentiment score (with dampening)
    this.sentimentScore = this.sentimentScore * 0.8 + score * 0.2;
  }
  
  detectConfusion(message) {
    // Check for signs of confusion
    const confusionIndicators = [
      'confused', 'confusing', 'unclear', 'don\'t understand', 'not sure', 'what do you mean', 
      'huh', 'what?', 'don\'t get it', 'explain', 'repeat', 'again'
    ];
    
    for (const indicator of confusionIndicators) {
      if (message.includes(indicator)) {
        this.userConfusion++;
        break;
      }
    }
  }
  
  trackUserInterests(message) {
    // Track specific interests mentioned
    const interestKeywords = {
      pricing: ['price', 'cost', 'rate', 'package', 'quote', 'affordable'],
      timeline: ['deadline', 'time', 'complete', 'finish', 'deliver', 'fast', 'quick'],
      quality: ['quality', 'professional', 'best', 'top', 'excellent'],
      examples: ['example', 'sample', 'portfolio', 'previous', 'work', 'showcase'],
      process: ['process', 'how does it work', 'steps', 'procedure', 'approach']
    };
    
    for (const [interest, keywords] of Object.entries(interestKeywords)) {
      for (const keyword of keywords) {
        if (message.includes(keyword)) {
          this.userInterests.add(interest);
          break;
        }
      }
    }
  }
  
  provideLiveTypingHelp() {
    // TODO: Implement live help suggestions as user types
    // This would show hints or autocomplete options
  }
  
  sendBotMessage(text) {
    // Remove typing indicator if present
    this.hideTypingIndicator();
    
    // Add bot message to UI
    this.addMessageToUI(text, false);
    
    // Save to messages array
    this.messages.push({ text, isUser: false });
    
    // Scroll to bottom
    this.scrollToBottom();
  }
  
  addMessageToUI(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    let messageHTML = '';
    
    if (!isUser) {
      messageHTML += `
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
      `;
    }
    
    messageHTML += `
      <div class="message-bubble">
        <div class="message-text">${text}</div>
      </div>
    `;
    
    if (isUser) {
      messageHTML += `
        <div class="message-avatar">
          <i class="fas fa-user"></i>
        </div>
      `;
    }
    
    messageDiv.innerHTML = messageHTML;
    this.chatMessages.appendChild(messageDiv);
    
    // Add animation classes based on message type
    if (isUser) {
      messageDiv.classList.add('user-message-animation');
    } else {
      messageDiv.classList.add('bot-message-animation');
    }
    
    this.scrollToBottom();
  }
  
  showTypingIndicator() {
    this.isTyping = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('chat-message', 'bot-message', 'typing-message');
    
    typingDiv.innerHTML = `
      <div class="message-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="message-bubble">
        <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
    
    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }
  
  hideTypingIndicator() {
    this.isTyping = false;
    
    const typingIndicator = this.chatMessages.querySelector('.typing-message');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }
  
  displaySuggestedQuestions(questionSet) {
    this.suggestedQuestionsContainer.innerHTML = '';
    
    // Only show first 5 questions max
    const questionsToShow = questionSet.slice(0, 5);
    
    questionsToShow.forEach((question, index) => {
      const button = document.createElement('button');
      button.classList.add('suggested-question');
      button.textContent = question;
      
      // Add animation delay for staggered appearance
      button.style.animationDelay = `${index * 0.1}s`;
      
      this.suggestedQuestionsContainer.appendChild(button);
    });
    
    // Show the container
    this.suggestedQuestionsContainer.style.display = 'flex';
  }
  
  updateSuggestedQuestions(userMessage, botResponse) {
    // Define which question set to use based on detected topic
    let questionSet;
    
    if (this.userConfusion > 2) {
      // Show simpler questions if user seems confused
      questionSet = suggestedQuestionSets.initial;
    } else if (this.currentTopic) {
      // Use topic-specific questions
      questionSet = suggestedQuestionSets[this.currentTopic] || suggestedQuestionSets.afterResponse;
    } else {
      // Default to general follow-up questions
      questionSet = suggestedQuestionSets.afterResponse;
    }
    
    // Display the selected question set
    this.displaySuggestedQuestions(questionSet);
  }
  
  generateSmartResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Handle high confusion with a clarification message
    if (this.userConfusion >= 3) {
      this.userConfusion = 0; // Reset confusion counter
      return "I apologize if my responses haven't been clear. To better assist you, could you let me know specifically what you're looking for? For example, are you interested in web development, e-commerce, audio services, AI voices, AI avatars, or graphic design?";
    }
    
    // CEO or creator questions
    if (message.includes('ceo') || message.includes('who is your boss') || message.includes('who created you') || 
        message.includes('who made you') || message.includes('who owns')) {
      return "Muatasim Billah is my CEO and creator. 🎩";
    }
    
    // Check for greeting patterns
    if (message.match(/^(hi|hello|hey|greetings|howdy|hola)/i)) {
      // Different greetings based on conversation stage
      if (this.conversationStage === 'engaged') {
        return "Hello again! I'm still here to help. What other aspects of Muatasim's services would you like to explore?";
      }
      return this.getRandomResponse(knowledgeBase.greetings);
    }
    
    // Check for "how are you" type questions
    if (message.match(/(how are you|how('s| is) it going|what's up|how do you do)/i)) {
      return this.getRandomResponse(knowledgeBase.howAreYou);
    }
    
    // Check for thanks/thank you
    if (message.match(/(thank|thanks|thx|thank you|thankyou)/i)) {
      return this.getRandomResponse(knowledgeBase.thanks);
    }
    
    // Check for goodbye
    if (message.match(/(bye|goodbye|see you|farewell|cya)/i)) {
      return this.getRandomResponse(knowledgeBase.goodbye);
    }
    
    // Check for "about you" or "who are you"
    if (message.match(/(who are you|about you|tell me about you|what are you)/i)) {
      return "I'm a virtual assistant for Muatasim Billah's portfolio website. I can tell you about his services, skills, projects, and how to contact him. How can I help you today?";
    }
    
    // Check for "about Muatasim"
    if (message.match(/(about muatasim|who is muatasim|tell me about muatasim)/i)) {
      return this.getRandomResponse(knowledgeBase.about);
    }
    
    // Check for pricing questions (with more detailed responses)
    if (this.detectedIntents.has('pricing')) {
      // If topic is detected, give specific pricing info
      if (this.currentTopic) {
        return `For ${this.currentTopic} services, Muatasim offers customized pricing based on project scope and requirements. Each project is unique, so pricing is tailored to your specific needs. For a detailed quote, please contact Muatasim directly through the contact form or email at Meharmahalcoll@gmail.com.`;
      }
      return "For information about pricing and packages, please contact Muatasim directly through the contact form or email at Meharmahalcoll@gmail.com. Pricing varies based on project requirements and scope.";
    }
    
    // Deep topic-specific questions with context awareness
    if (this.currentTopic && this.consecutiveTopics.length >= 2) {
      // User has asked multiple questions about the same topic, provide more detailed info
      
      // Check if they're asking about benefits
      if (message.includes('benefit') || message.includes('advantage') || message.includes('why') || 
          message.includes('help me') || message.includes('value')) {
        return contextualInfo.benefit[this.currentTopic].join('<br>');
      }
      
      // Check if they're asking about process
      if (message.includes('process') || message.includes('how do you') || message.includes('steps') || 
          message.includes('method') || message.includes('approach')) {
        return contextualInfo.process[this.currentTopic].join('<br>');
      }
    }
    
    // Services related questions
    if (message.includes('services') || message.includes('what do you offer') || message.includes('what can you do')) {
      return knowledgeBase.services.join('<br>');
    }
    
    // Skills related questions
    if (message.includes('skills') || message.includes('expertise') || message.includes('what can muatasim do')) {
      return knowledgeBase.skills.join('<br>');
    }
    
    // Project related questions
    if (message.includes('projects') || message.includes('portfolio') || message.includes('work') || 
        message.includes('view portfolio')) {
      return knowledgeBase.projects.join('<br>');
    }
    
    // Contact related questions
    if (message.includes('contact') || message.includes('reach') || message.includes('email') || 
        message.includes('phone') || message.includes('contact info')) {
      return knowledgeBase.contact.join('<br>');
    }
    
    // Web development specific question
    if (message.includes('web') || message.includes('website') || message.includes('development') || 
        message.includes('html') || message.includes('css') || message.includes('javascript')) {
      return knowledgeBase.webDevelopment.join('<br>');
    }
    
    // Shopify specific question
    if (message.includes('shopify') || message.includes('e-commerce') || message.includes('ecommerce') || 
        message.includes('online store')) {
      return knowledgeBase.shopify.join('<br>');
    }
    
    // Audio engineering specific question
    if (message.includes('audio') || message.includes('sound') || message.includes('mixing') || 
        message.includes('mastering') || message.includes('podcast')) {
      return knowledgeBase.audioEngineering.join('<br>');
    }
    
    // AI voiceover specific question
    if (message.includes('voice') || message.includes('voiceover') || message.includes('ai voice')) {
      return knowledgeBase.aiVoiceover.join('<br>');
    }
    
    // AI avatar specific question
    if (message.includes('avatar') || message.includes('ai avatar') || message.includes('talking avatar')) {
      return knowledgeBase.aiAvatar.join('<br>');
    }
    
    // Design specific question
    if (message.includes('design') || message.includes('canva') || message.includes('graphic') || 
        message.includes('brand') || message.includes('logo')) {
      return knowledgeBase.graphicDesign.join('<br>');
    }
    
    // Handle timeline/duration questions
    if (message.match(/(how long|timeline|duration|turnaround|deliver|timeframe)/i)) {
      if (this.currentTopic) {
        // Give more specific timeline info based on topic
        const timelineInfo = {
          webDevelopment: "Web development projects typically take 2-4 weeks depending on complexity and requirements.",
          shopify: "Shopify store design usually takes 1-3 weeks from concept to launch.",
          audioEngineering: "Audio engineering turnaround is typically 2-5 business days based on length and complexity.",
          aiVoiceover: "AI voiceovers can be delivered within 24-48 hours for most projects.",
          aiAvatar: "AI avatar videos typically take 2-4 business days from script to final delivery.",
          graphicDesign: "Graphic design projects are usually completed within 2-7 days depending on complexity."
        };
        return timelineInfo[this.currentTopic];
      }
      return "Project timelines vary depending on the scope and complexity. Muatasim works efficiently to deliver quality results within agreed timeframes. For a specific estimate on your project, please reach out through the contact form.";
    }
    
    // Handle language support
    if (message.match(/(language|languages|speak|translate)/i)) {
      return "Muatasim can work with clients in English and Urdu. His AI voice and avatar services can also be created in multiple languages based on your requirements.";
    }
    
    // Smart fallback that considers context
    if (this.currentTopic) {
      return `I notice you're interested in ${this.currentTopic.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}. Muatasim offers excellent services in this area. Would you like specific information about his approach, pricing, timeline, or examples of previous work?`;
    }
    
    // Default fallback response
    return "I'd be happy to tell you about Muatasim's services, skills, or projects. You can ask me about specific offerings like web development, Shopify design, audio engineering, AI voiceovers, AI avatars, or graphic design. How can I help you today?";
  }
  
  getRandomResponse(responseArray) {
    const randomIndex = Math.floor(Math.random() * responseArray.length);
    return responseArray[randomIndex];
  }
}

// Initialize the enhanced chatbot when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const chatbot = new EnhancedChatBot();
  
  // Make chatbot accessible globally (for debugging)
  window.chatbot = chatbot;
});

// Add some custom CSS for new animations and features
(function addCustomChatbotStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Enhanced chatbot animations */
    .user-message-animation {
      animation: slideInRight 0.3s ease-out forwards;
    }
    
    .bot-message-animation {
      animation: slideInLeft 0.3s ease-out forwards;
    }
    
    @keyframes slideInRight {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInLeft {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    /* Enhanced typing indicator */
    .typing-indicator span {
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      margin: 0 2px;
      animation: typingBounce 1.2s infinite ease-in-out;
    }
    
    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }
    
    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }
    
    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }
    
    /* Enhanced suggested questions */
    .suggested-questions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 10px;
      margin-top: 5px;
    }
    
    .suggested-question {
      font-size: 12px;
      padding: 6px 10px;
      background: rgba(112, 0, 255, 0.1);
      border: 1px solid rgba(112, 0, 255, 0.2);
      border-radius: 15px;
      color: #fff;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      animation: fadeIn 0.5s forwards;
      opacity: 0;
    }
    
    .suggested-question:hover {
      background: rgba(112, 0, 255, 0.3);
      transform: translateY(-2px);
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    /* First-time open animation */
    .chat-interface.first-open {
      animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    
    @keyframes bounceIn {
      0% { transform: scale(0.8); opacity: 0; }
      70% { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
})();
