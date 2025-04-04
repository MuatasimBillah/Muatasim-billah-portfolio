// chatbot.js

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
  
  // Suggested questions for the user
  const suggestedQuestions = [
    "What services do you offer?",
    "Tell me about your web development",
    "What are your skills?",
    "How can I contact you?",
    "Show me your AI voice projects"
  ];
  
  // Initial greeting message from the bot
  const initialMessage = "👋 Hi there! I'm Muatasim's portfolio assistant. How can I help you today?";
  
  // Main chatbot class
  class ChatBot {
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
      
      this.initEventListeners();
      this.sendBotMessage(initialMessage);
      this.displaySuggestedQuestions();
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
      
      // Show typing indicator
      this.showTypingIndicator();
      
      // Generate response after a delay
      setTimeout(() => {
        const response = this.generateResponse(text);
        this.sendBotMessage(response);
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
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
      
      // Hide suggested questions after first bot response
      if (this.messages.length > 2) {
        this.suggestedQuestionsContainer.style.display = 'none';
      }
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
    
    displaySuggestedQuestions() {
      this.suggestedQuestionsContainer.innerHTML = '';
      
      suggestedQuestions.forEach(question => {
        const button = document.createElement('button');
        button.classList.add('suggested-question');
        button.textContent = question;
        this.suggestedQuestionsContainer.appendChild(button);
      });
    }
    
    generateResponse(userMessage) {
      const message = userMessage.toLowerCase();
      
      // CEO or creator questions
      if (message.includes('ceo') || message.includes('who is your boss') || message.includes('who created you') || 
          message.includes('who made you') || message.includes('who owns')) {
        return "Muatasim Billah is my CEO and creator. 🎩";
      }
      
      // Check for greeting patterns
      if (message.match(/^(hi|hello|hey|greetings|howdy|hola)/i)) {
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
      
      // Handle pricing/cost questions
      if (message.match(/(price|pricing|cost|how much|rates|fee)/i)) {
        return "For information about pricing and packages, please contact Muatasim directly through the contact form or email at contact@muatasim.com. Pricing varies based on project requirements and scope.";
      }
      
      // Handle timeline/duration questions
      if (message.match(/(how long|timeline|duration|turnaround|deliver|timeframe)/i)) {
        return "Project timelines vary depending on the scope and complexity. Muatasim works efficiently to deliver quality results within agreed timeframes. For a specific estimate on your project, please reach out through the contact form.";
      }
      
      // Handle language support
      if (message.match(/(language|languages|speak|translate)/i)) {
        return "Muatasim can work with clients in English and Urdu. His AI voice and avatar services can also be created in multiple languages based on your requirements.";
      }
      
      // Fallback response
      return "I'd be happy to tell you about Muatasim's services, skills, or projects. You can ask me about specific offerings like web development, Shopify design, audio engineering, AI voiceovers, AI avatars, or graphic design. How can I help you today?";
    }
    
    getRandomResponse(responseArray) {
      const randomIndex = Math.floor(Math.random() * responseArray.length);
      return responseArray[randomIndex];
    }
  }
  
  // Initialize the chatbot when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    const chatbot = new ChatBot();
    
    // Make chatbot accessible globally (for debugging)
    window.chatbot = chatbot;
  });